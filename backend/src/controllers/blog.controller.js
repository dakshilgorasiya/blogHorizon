import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { BLOG_CATEGORY } from "../constants.js";

const createBlog = asyncHandler(async (req, res) => {
  // check if the user is logged in
  // get the user id from the token
  // get title, category and tags from the request body
  // get markups from the request body
  // check if the category is valid
  // get thumbnail and images from the request files
  // upload thumbnail and images to cloudinary
  // create a new blog
  // save the blog to the database
  // send the response

  const { title, tag, markup, category } = req.body;

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

  const blog = await Blog.create({
    title,
    owner: req.user._id,
    tag: JSON.parse(tag),
    markup: JSON.parse(markup),
    category,
    thumbnail: thumbnailResponse.url,
    photos: photosUrl,
  });

  const createdBlog = await Blog.findById(blog._id);

  if (!createdBlog) {
    throw new ApiError(500, "Failed to create blog");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdBlog, "Blog created successfully"));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  // get category and sort from the request body
  // get pagination details from the query
  // get blogs with user details
  // use pagination to limit the number of blogs
  // send the response

  const category = req.body.category || null;

  const sortCriteria = req.body.sort || "createdAt";

  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;

  try {
    // let blogs = Blog.aggregate();

    let blogs;

    if (!category) {
      blogs = Blog.aggregate([
        {
          $sort: {
            [sortCriteria]: -1,
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
          $project: {
            title: 1,
            tag: 1,
            category: 1,
            thumbnail: 1,
            owner: 1,
            createdAt: 1,
            view: 1,
          },
        },
      ]);
    } else {
      blogs = Blog.aggregate([
        {
          $match: {
            category: category,
          },
        },
        {
          $sort: {
            [sortCriteria]: -1,
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
          $project: {
            title: 1,
            tag: 1,
            category: 1,
            thumbnail: 1,
            owner: 1,
            createdAt: 1,
            view: 1,
          },
        },
      ]);
    }
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

const getBlogById = asyncHandler(async (req, res) => {
  // get blog id from the request params
  // get blog with user details
  // update view of blog
  // update history of the user
  // send the response

  const blogId = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

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
        tag: 1,
        category: 1,
        thumbnail: 1,
        owner: 1,
        createdAt: 1,
        commentCount: 1,
        likeCount: 1,
        markup: 1,
        photos: 1,
      },
    },
  ]);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

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

  const user = await User.findById(req.user._id);

  if (!user.history) {
    console.log("No history found");
    user.history = [];
  }

  user.history = user.history.filter((ele) => {
    // console.log(ele.toString(), new mongoose.Types.ObjectId(blogId).toString());
    return ele.toString() !== new mongoose.Types.ObjectId(blogId).toString();
  });
  user.history.push(new mongoose.Types.ObjectId(blogId));

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog?.[0], "Blog fetched successfully"));
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
