import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const toggleLike = asyncHandler(async (req, res) => {
  // Get the user id from the request
  // Get the blog id or comment id from the request
  // get the type from the request
  // toggle like
  // return the response

  const { type, id } = req.body;

  if (!type || !id) {
    throw new ApiError("Type and id are required", 400);
  }

  if (type == "comment") {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new ApiError("Comment not found", 404);
    }

    const like = await Like.findOne({ comment: id, likedBy: req.user.id });

    if (like) {
      await Like.deleteOne({ _id: like._id });

      return res.status(200).json(new ApiResponse(200, "Like removed", null));
    } else {
      await Like.create({ comment: id, likedBy: req.user.id });

      return res.status(201).json(new ApiResponse(201, "Liked", null));
    }
  } else if (type == "blog") {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError("Blog not found", 404);
    }

    const like = await Like.findOne({ blog: id, likedBy: req.user.id });

    if (like) {
      await like.deleteOne({ _id: like._id });

      return res.status(200).json(new ApiResponse(200, "Like removed", null));
    } else {
      await Like.create({ blog: id, likedBy: req.user.id });

      return res.status(201).json(new ApiResponse(201, "Liked", null));
    }
  } else {
    throw new ApiError("Invalid type", 400);
  }
});

const getLikes = asyncHandler(async (req, res) => {
  // Get the blog id or comment id from the request
  // get the type from the request
  // get the likes
  // return the response

  const { type, id } = req.body;

  if (!type || !id) {
    throw new ApiError("Type and id are required", 400);
  }

  if (type === "comment") {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new ApiError("Comment not found", 404);
    }

    const likes = await Like.aggregate([
      {
        $match: { comment: comment._id },
      },
      {
        $count: "totalLikes",
      },
    ]);

    if (!likes.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, { totalLikes: 0 }, "No likes"));
    }

    return res.status(200).json(new ApiResponse(200, likes[0], "Likes"));
  } else if (type == "blog") {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError("Blog not found", 404);
    }

    const likes = await Like.aggregate([
      {
        $match: { blog: blog._id },
      },
      {
        $count: "totalLikes",
      },
    ]);

    if (!likes.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, { totalLikes: 0 }, "No likes"));
    }

    return res.status(200).json(new ApiResponse(200, likes[0], "Likes"));
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
