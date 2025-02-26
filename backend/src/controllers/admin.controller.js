import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../utils/sendMail.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Follow } from "../models/follow.model.js";
import { Comment } from "../models/comment.model.js";
import { Report } from "../models/report.model.js";
import mongoose from "mongoose";

const getAllReportedBlog = asyncHandler(async (req, res) => {
  const { page, limit } = req.body;

  const blogs = Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "follows",
        localField: "owner._id",
        foreignField: "followedTo",
        as: "followers",
      },
    },
    {
      $addFields: {
        followersCount: {
          $size: "$followers",
        },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "blog",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentCount: {
          $size: "$comments",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "blog",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: {
          $size: "$likes",
        },
      },
    },
    {
      $lookup: {
        from: "reports",
        localField: "_id",
        foreignField: "blog",
        as: "reports",
        pipeline: [
          {
            $match: {
              isSolved: false,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        reportCount: {
          $size: "$reports",
        },
      },
    },
    {
      $match: {
        reportCount: {
          $gt: 0,
        },
      },
    },
    {
      $sort: {
        reportCount: -1,
      },
    },
    {
      $project: {
        title: 1,
        tags: 1,
        category: 1,
        owner: 1,
        createdAt: 1,
        commentCount: 1,
        followersCount: 1,
        likeCount: 1,
        content: 1,
        reportCount: 1,
      },
    },
  ]);

  const options = {
    page: page || 1,
    limit: limit || 10,
  };

  await Blog.aggregatePaginate(blogs, options)
    .then(async function (result) {
      const checkLikedByUser = async (userId) => {
        await Promise.all(
          result.docs.map(async (blog) => {
            const like = await Like.findOne({
              likedBy: new mongoose.Types.ObjectId(userId),
              blog: new mongoose.Types.ObjectId(blog._id),
            });
            if (like) {
              blog.isLiked = true;
            } else {
              blog.isLiked = false;
            }
          })
        );
      };

      await checkLikedByUser(req?.user?._id);

      result.docs.map((blog) => {
        blog.thumbnail = blog.content[0].data;
        blog.content = undefined;
      });

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          data: result,
          message: "Blogs fetched successfully",
        })
      );
    })
    .catch(function (err) {
      throw new ApiError(500, err.message);
    });
});

const getBlogById = asyncHandler(async (req, res) => {
  // get blog id from the request params
  const blogId = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  // get blog with user details
  const blog = await Blog.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "follows",
        localField: "owner._id",
        foreignField: "followedTo",
        as: "followers",
      },
    },
    {
      $addFields: {
        followersCount: {
          $size: "$followers",
        },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "blog",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentCount: {
          $size: "$comments",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "blog",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: {
          $size: "$likes",
        },
      },
    },
    {
      $lookup: {
        from: "reports",
        localField: "_id",
        foreignField: "blog",
        as: "reports",
        pipeline: [
          {
            $match: {
              isSolved: false,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        reportCount: {
          $size: "$reports",
        },
      },
    },
    {
      $project: {
        title: 1,
        tags: 1,
        category: 1,
        owner: 1,
        createdAt: 1,
        commentCount: 1,
        likeCount: 1,
        content: 1,
        reportCount: 1,
        followersCount: 1,
      },
    },
  ]);

  if (!blog || blog.length === 0) {
    throw new ApiError(404, "Blog not found");
  }

  let user = req.user;

  // check if user has liked the blog
  const like = await Like.find({
    likedBy: new mongoose.Types.ObjectId(user._id),
    blog: new mongoose.Types.ObjectId(blogId),
  });
  if (like.length > 0) {
    blog[0].isLiked = true;
  } else {
    blog[0].isLiked = false;
  }

  // check if user has favorited the blog
  let favorite = false;
  for (let i = 0; i < user.favorite.length; i++) {
    if (user.favorite[i].toString() === blogId.id) {
      favorite = true;
      break;
    }
  }
  blog[0].isFavorite = favorite;

  // check if user follow the owner of the blog
  const follow = await Follow.find({
    followedBy: new mongoose.Types.ObjectId(user._id),
    followedTo: new mongoose.Types.ObjectId(blog[0].owner._id),
  });
  if (follow.length > 0) {
    blog[0].isFollowed = true;
  } else {
    blog[0].isFollowed = false;
  }

  // send the response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: blog[0],
      message: "Blog fetched successfully",
    })
  );
});

const getReportsByBlogId = asyncHandler(async (req, res) => {
  // get blog id from the request params
  const blogId = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  // get report with user details
  const reports = await Report.aggregate([
    {
      $match: {
        blog: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $sort: {
        isSolved: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: reports,
      message: "Reports fetched successfully",
    })
  );
});

const deleteBlog = asyncHandler(async (req, res) => {
  // get blog id from the request body
  const { blogId } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  // get blog
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // get reason from the request body
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, "Reason is required");
  }

  // admin who delete the blog
  const admin = req.user;

  // get user who owns the blog
  const user = await User.findById(blog.owner);

  // send email to the owner of the blog
  const htmlContent = `
  <div style="max-width: 600px; margin: auto; background-color: #fff; border: 2px solid #f5c6cb; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; color: #721c24;">
    <div style="background-color: #dc3545; color: #fff; padding: 15px; font-size: 22px; font-weight: bold; border-radius: 6px 6px 0 0;">
        ⚠ Blog Deletion Notice
    </div>
    <div style="padding: 20px;">
        <p>Dear User,</p>
        <p>We regret to inform you that your blog post titled <strong style="color: #d9534f;">"${blog.title}"</strong> has been deleted by an administrator.</p>
        <p><strong>Deleted By:</strong> ${admin.userName}</p>
        <p><strong>Reason:</strong> <span style="font-weight: bold; color: #c82333;">${reason}</span></p>
        <p>If you believe this was a mistake or have any concerns, please contact our support team.</p>
    </div>
    <div style="margin-top: 20px; font-size: 14px; color: #666;">
        Regards,<br>
        BlogHorizon Team
    </div>
  </div>
  `;

  try {
    await sendMail({
      to: user.email,
      subject: "Blog deleted",
      content: htmlContent,
      isHtml: true,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send email");
  }

  // delete the blog
  await Blog.findByIdAndDelete(blogId);

  // delete all the likes, comments, and reports related to the blog
  await Like.deleteMany({ blog: blogId });
  await Comment.deleteMany({ blog: blogId });
  await Report.deleteMany({ blog: blogId });

  // send the response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "Blog deleted successfully",
    })
  );
});

const markReportAsResolved = asyncHandler(async (req, res) => {
  // get report id from the request params
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Report id is required");
  }

  // get report
  const report = await Report.findById(id);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  // mark report as resolved
  report.isSolved = true;
  await report.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: report,
      message: "Report marked as resolved",
    })
  );
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "User not authorized");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "User is admin",
    })
  );
});

export {
  getAllReportedBlog,
  getBlogById,
  getReportsByBlogId,
  deleteBlog,
  markReportAsResolved,
  verifyAdmin,
};
