import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const toggleLike = asyncHandler(async (req, res) => {
  // Get the user id and type of like from the request
  const { type, id } = req.body;

  if (!type || !id) {
    throw new ApiError("Type and id are required", 400);
  }

  if (type == "comment") {
    // Check if the comment exists
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new ApiError("Comment not found", 404);
    }

    // Check if the user has already liked the comment
    const like = await Like.findOne({ comment: id, likedBy: req.user.id });

    // If the user has already liked the comment, remove the like else add the like
    let userLiked = false;
    if (like) {
      userLiked = false;
      await Like.deleteOne({ _id: like._id });
    } else {
      userLiked = true;
      await Like.create({ comment: id, likedBy: req.user.id });
    }

    const likes = await Like.find({ comment: id });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Comment like toggled",
        data: {
          totalLikes: likes.length,
          userLiked,
        },
      })
    );
  } else if (type == "blog") {
    // Check if the blog exists
    console.log(id);
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError("Blog not found", 404);
    }

    // Check if the user has already liked the blog
    const like = await Like.findOne({ blog: id, likedBy: req.user.id });

    let userLiked = false;

    // If the user has already liked the blog, remove the like else add the like
    if (like) {
      userLiked = false;
      await like.deleteOne({ _id: like._id });
    } else {
      userLiked = true;
      await Like.create({ blog: id, likedBy: req.user.id });
    }

    const likes = await Like.find({ blog: id });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Blog like toggled",
        data: {
          totalLikes: likes.length,
          userLiked,
        },
      })
    );
  } else {
    throw new ApiError("Invalid type", 400);
  }
});

const getLikes = asyncHandler(async (req, res) => {
  // Get the type and id from the request
  const { type, id } = req.query;

  if (!type || !id) {
    throw new ApiError("Type and id are required", 400);
  }

  if (type === "comment") {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new ApiError("Comment not found", 404);
    }

    // get the likes
    const likes = await Like.find({ comment: comment._id });

    let userLiked = false;

    // if user is logged id check if the user liked the comment
    if (req.user) {
      const like = await Like.findOne({
        comment: comment._id,
        likedBy: req.user.id,
      });
      if (like) {
        userLiked = true;
      } else {
        userLiked = false;
      }
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Likes",
        data: {
          totalLikes: likes.length,
          userLiked,
        },
      })
    );
  } else if (type == "blog") {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError("Blog not found", 404);
    }

    // get the likes
    const likes = await Like.find({ blog: blog._id });

    let userLiked = false;

    // if user is logged id check if the user liked the blog
    if (req.user) {
      const like = await Like.findOne({ blog: blog._id, likedBy: req.user.id });
      if (like) {
        userLiked = true;
      } else {
        userLiked = false;
      }
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Likes",
        data: {
          totalLikes: likes.length,
          userLiked,
        },
      })
    );
  } else {
    throw new ApiError("Invalid type", 400);
  }
});

const checkLike = asyncHandler(async (req, res) => {
  // Get the blog id or comment id from the request
  // get the type from the request
  // check if the user liked the blog or comment
  // return the response

  const { type, id } = req.body;

  if (!type || !id) {
    throw new ApiError("Type and id are required", 400);
  }

  if (type === "comment") {
    const like = await Like.findOne({
      comment: new mongoose.Types.ObjectId(id),
      likedBy: req.user.id,
    });
    if (like) {
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: true }, "Liked"));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: false }, "Not liked"));
    }
  } else if (type === "blog") {
    const like = await Like.findOne({
      blog: new mongoose.Types.ObjectId(id),
      likedBy: req.user.id,
    });
    if (like) {
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: true }, "Liked"));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: false }, "Not liked"));
    }
  } else {
    throw new ApiError("Invalid type", 400);
  }
});

export { toggleLike, getLikes, checkLike };
