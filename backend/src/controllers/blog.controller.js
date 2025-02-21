import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Follow } from "../models/follow.model.js";
import { BLOG_CATEGORY } from "../constants.js";
import jwt from "jsonwebtoken";

//* Controller to create a blog
const createBlog = asyncHandler(async (req, res) => {
  // get user from the request
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Please login to create a blog");
  }

  // get title, content, category, tag from the request body
  let { title, content, category, tags } = req.body;

  content = JSON.parse(content);

  tags = JSON.parse(tags);

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  if (!tags) {
    throw new ApiError(400, "Tags are required");
  }

  // upload images on cloudinary
  const images = req.files?.images;

  if (images && images[0] === undefined) {
    throw new ApiError(400, "Thumnail is required");
  }

  if (
    images &&
    images.length !== content.filter((ele) => ele.type === "image").length
  ) {
    throw new ApiError(500, "Image upload failed");
  }

  const imagesPath = images.map((image) => image.path);

  const imagesResponse = await Promise.all(
    imagesPath.map(async (image) => await uploadOnCloudinary(image))
  );

  if (!imagesResponse) {
    throw new ApiError(500, "Failed to upload images on cloudinary");
  }

  imagesResponse.forEach((image) => {
    if (!image) {
      throw new ApiError(500, "Failed to upload images on cloudinary");
    }
  });

  let i = 0;
  // reset the content with the new image urls
  content = content.map((ele) => {
    if (ele.type === "image") {
      ele.data = imagesResponse[i].url;
      i++;
    }
    return ele;
  });

  // create a new blog
  const blog = await Blog.create({
    title,
    owner: user._id,
    content,
    category,
    tags,
  });

  if (!blog) {
    throw new ApiError(500, "Failed to create blog");
  }

  // send the response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: blog,
      message: "Blog created successfully",
    })
  );
});

const getAllBlogs = asyncHandler(async (req, res) => {
  // get pagination details from the query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // get all blogs with user details, likes, comments, followers
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
      },
    },
  ]);

  const options = {
    page,
    limit,
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

      if (req.user) {
        await checkLikedByUser(req.user._id);
      }

      result.docs.map((blog) => {
        blog.thumbnail = blog.content[0].data;
        blog.content = null;
      });

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          data: result,
          message: "Blogs fetched successfully",
        })
      );
    })
    .catch(function (error) {
      throw new ApiError(500, error.message);
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
      $project: {
        title: 1,
        tags: 1,
        category: 1,
        owner: 1,
        createdAt: 1,
        commentCount: 1,
        likeCount: 1,
        content: 1,
        followersCount: 1,
      },
    },
  ]);

  if (!blog || blog.length === 0) {
    throw new ApiError(404, "Blog not found");
  }

  let user = req.user;

  // update history of user if user is logged in
  if (user) {
    user = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          history: new mongoose.Types.ObjectId(blogId),
        },
      },
      {
        new: true,
      }
    );
  }

  // check if user has liked the blog
  if (user) {
    const like = await Like.find({
      likedBy: new mongoose.Types.ObjectId(user._id),
      blog: new mongoose.Types.ObjectId(blogId),
    });
    if (like.length > 0) {
      blog[0].isLiked = true;
    } else {
      blog[0].isLiked = false;
    }
  } else {
    blog[0].isLiked = false;
  }

  // check if user has favorited the blog
  if (user) {
    let favorite = false;
    for (let i = 0; i < user.favorite.length; i++) {
      if (user.favorite[i].toString() === blogId.id) {
        favorite = true;
        break;
      }
    }
    blog[0].isFavorite = favorite;
  } else {
    blog[0].isFavorite = false;
  }

  // check if user follow the owner of the blog
  if (user) {
    const follow = await Follow.find({
      followedBy: new mongoose.Types.ObjectId(user._id),
      followedTo: new mongoose.Types.ObjectId(blog[0].owner._id),
    });
    if (follow.length > 0) {
      blog[0].isFollowed = true;
    } else {
      blog[0].isFollowed = false;
    }
  } else {
    blog[0].isFollowed = false;
  }

  // update view of blog
  const updatedBlog = await Blog.findByIdAndUpdate(
    new mongoose.Types.ObjectId(blogId),
    {
      $inc: {
        view: 1,
      },
    },
    {
      new: true,
    }
  );

  // send the response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: blog[0],
      message: "Blog fetched successfully",
    })
  );
});

const getBlogOfUser = asyncHandler(async (req, res) => {
  // get user id from the request params
  // get blogs of the user
  // use pagination to limit the number of blogs
  // send the response

  const userId = req.user._id;

  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;

  try {
    let blogs = Blog.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          title: 1,
          tag: 1,
          category: 1,
          thumbnail: 1,
          createdAt: 1,
        },
      },
    ]);

    const options = {
      page,
      limit,
    };

    await Blog.aggregatePaginate(blogs, options)
      .then(function (result) {
        return res
          .status(200)
          .json(new ApiResponse(200, result, "Blogs fetched successfully"));
      })
      .catch(function (error) {
        throw new ApiError(500, error.message);
      });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  // get blog id from the request body
  // get blog details from the request body
  // get the blog
  // check if the user is the owner of the blog
  // update the blog
  // send the response

  const { blogId, title, tag, markup, category } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this blog");
  }

  const allowedCategories = [
    "Technology",
    "Business",
    "Health",
    "Entertainment",
    "Science",
    "Sports",
    "Education",
    "Lifestyle",
  ];

  if (!title || !tag || !markup || !category) {
    throw new ApiError(400, "Please fill in all fields");
  }

  if (!allowedCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const thumbnail = req.files?.thumbnail[0]?.path;

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnailResponse = await uploadOnCloudinary(thumbnail);

  if (!thumbnailResponse) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const photos = req.files?.photos;

  if (!photos) {
    throw new ApiError(400, "Photos are required");
  }

  const photosPath = photos.map((photo) => photo?.path);

  if (!photosPath) {
    throw new ApiError(400, "Failed to upload photos");
  }

  if (
    !(
      photosPath.length === JSON.parse(markup).length - 1 ||
      photosPath.length === JSON.parse(markup).length
    )
  ) {
    throw new ApiError(400, "Number of photos and markups is not valid");
  }

  const photosResponse = await Promise.all(
    photosPath.map(async (photo) => await uploadOnCloudinary(photo))
  );

  if (!photosResponse) {
    throw new ApiError(500, "Failed to upload photos on cloudinary");
  }

  const photosUrl = photosResponse.map((photo) => photo.url);

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $set: {
        title,
        tag: JSON.parse(tag),
        markup: JSON.parse(markup),
        category,
        thumbnail: thumbnailResponse.url,
        photos: photosUrl,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedBlog) {
    throw new ApiError(500, "Failed to update blog");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
});

const deleteBlog = asyncHandler(async (req, res) => {
  // get blog id from the request body
  // get the blog
  // check if the user is the owner of the blog
  // delete the blog
  // send the response

  const { blogId } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this blog");
  }

  const deletedBlog = await Blog.deleteOne({ _id: blogId });

  if (!deletedBlog) {
    throw new ApiError(500, "Failed to delete blog");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Blog deleted successfully"));
});

const getFavoriteBlogs = asyncHandler(async (req, res) => {
  // get user id from the request body
  // get favorite blogs of the user
  // return the response

  const userId = req.user._id;

  const favoriteBlog = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "favorite",
        foreignField: "_id",
        as: "favoriteBlog",
      },
    },
    {
      $unwind: "$favoriteBlog",
    },
    {
      $lookup: {
        from: "users",
        localField: "favoriteBlog.owner",
        foreignField: "_id",
        as: "favoriteBlog.owner",
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
      $unwind: "$favoriteBlog.owner",
    },
    {
      $project: {
        favoriteBlog: {
          _id: 1,
          title: 1,
          tag: 1,
          category: 1,
          thumbnail: 1,
          owner: 1,
          view: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  const favorite = favoriteBlog.map((ele) => ele.favoriteBlog);

  return res
    .status(200)
    .json(
      new ApiResponse(200, favorite, "Favorite blogs fetched successfully")
    );
});

const getHistoryBlogs = asyncHandler(async (req, res) => {
  // get user id from the request body
  // get history blogs of the user
  // return the response

  const userId = req.user._id;

  const historyBlog = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "history",
        foreignField: "_id",
        as: "historyBlog",
      },
    },
    {
      $unwind: "$historyBlog",
    },
    {
      $lookup: {
        from: "users",
        localField: "historyBlog.owner",
        foreignField: "_id",
        as: "historyBlog.owner",
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
      $unwind: "$historyBlog.owner",
    },
    {
      $project: {
        historyBlog: {
          _id: 1,
          title: 1,
          tag: 1,
          category: 1,
          thumbnail: 1,
          owner: 1,
          view: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  const history = historyBlog.map((ele) => ele.historyBlog);

  return res
    .status(200)
    .json(new ApiResponse(200, history, "History blogs fetched successfully"));
});

const getInterests = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: BLOG_CATEGORY,
      message: "Interests fetched successfully",
    })
  );
});

export {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogOfUser,
  updateBlog,
  deleteBlog,
  getFavoriteBlogs,
  getHistoryBlogs,
  getInterests,
};
