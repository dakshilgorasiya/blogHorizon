import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const postComment = asyncHandler(async (req, res) => {
  // Get the blog, content from the request
  const { blogId, content, commentId } = req.body;

  if (!content) {
    throw new ApiError("Content is required", 400);
  }

  if (!(blogId || commentId)) {
    throw new ApiError("Blog or Comment is required", 400);
  }

  // get type of comment
  if (blogId) {
    // Create a comment
    const comment = await Comment.create({
      owner: req.user._id,
      blog: blogId,
      content,
    });
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        data: comment,
        message: "Commented",
      })
    );
  } else {
    // Create a comment
    const comment = await Comment.create({
      owner: req.user._id,
      comment: commentId,
      content,
    });
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        data: comment,
        message: "Commented",
      })
    );
  }
});

const getAllComments = asyncHandler(async (req, res) => {
  // Get the blog or content from the request
  const { blogId, commentId } = req.query;

  if (!(blogId || commentId)) {
    throw new ApiError("Blog or Comment is required", 400);
  }

  if (blogId) {
    const comments = await Comment.aggregate([
      {
        $match: { blog: new mongoose.Types.ObjectId(blogId) },
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
          foreignField: "comment",
          as: "replies",
        },
      },
      {
        $addFields: {
          haveReplies: {
            $cond: {
              if: { $gt: [{ $size: "$replies" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $addFields: {
          replies: {
            $size: "$replies",
          },
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: comments,
        message: "Comments fetched successfully",
      })
    );
  } else {
    const comments = await Comment.aggregate([
      {
        $match: { comment: new mongoose.Types.ObjectId(commentId) },
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
          foreignField: "comment",
          as: "replies",
        },
      },
      {
        $addFields: {
          haveReplies: {
            $cond: {
              if: { $gt: [{ $size: "$replies" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $addFields: {
          replies: {
            $size: "$replies",
          },
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: comments,
        message: "Comments fetched successfully",
      })
    );
  }
});

export { postComment, getAllComments };
