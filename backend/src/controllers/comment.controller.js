import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const postComment = asyncHandler(async (req, res) => {
  // Get the blog, content from the request
  // get type of comment
  // Create a comment
  // Return the response

  const { blogId, content, commentId } = req.body;

  if (!content) {
    throw new ApiError("Content is required", 400);
  }

  if (!(blogId || commentId)) {
    throw new ApiError("Blog or Comment is required", 400);
  }

  if (blogId) {
    const comment = await Comment.create({
      owner: req.user._id,
      blog: blogId,
      content,
    });
    return res.status(201).json(new ApiResponse(201, comment, "Commented"));
  } else {
    const comment = await Comment.create({
      owner: req.user._id,
      comment: commentId,
      content,
    });
    return res.status(201).json(new ApiResponse(201, comment, "Commented"));
  }
});

const getAllComments = asyncHandler(async (req, res) => {
  // Get the page and limit from the request
  // Get the comments
  // Return the response

  const { blogId, commentId } = req.body;

  if (!(blogId || commentId)) {
    throw new ApiError("Blog or Comment is required", 400);
  }

  if (blogId) {
    const aggregateComment = Comment.aggregate([
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
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$owner",
      },
    ]);

    const comments = await Comment.aggregatePaginate(aggregateComment, {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,
    });

    let tempArr = comments.docs.map(async (comment) => {
      const likeDocs = await Like.find({ comment: comment._id });
      comment.likes = likeDocs.length === 0 ? 0 : likeDocs.length;
      
      const isLiked = await Like.findOne({ comment: comment._id, likedBy: req.user._id });
      comment.liked = isLiked ? true : false;

      const replies = await Comment.find({ comment: comment._id });
      comment.replies = replies.length === 0 ? 0 : replies.length;

      return comment;
    });

    await Promise.all(tempArr).then((comment)=>{
      comments.docs = comment;
    }).catch((error)=>{
      throw new ApiError(`Error ${error}`, 500);
    })

    return res.status(200).json(new ApiResponse(200, comments, "Comments"));
  }else{
    const aggregateComment = Comment.aggregate([
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
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$owner",
      },
    ]);

    const comments = await Comment.aggregatePaginate(aggregateComment, {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,
    });

    let tempArr = comments.docs.map(async (comment) => {
      const likeDocs = await Like.find({ comment: comment._id });
      comment.likes = likeDocs.length === 0 ? 0 : likeDocs.length;
      
      const isLiked = await Like.findOne({ comment: comment._id, likedBy: req.user._id });
      comment.liked = isLiked ? true : false;

      const replies = await Comment.find({ comment: comment._id });
      comment.replies = replies.length === 0 ? 0 : replies.length;

      return comment;
    });

    await Promise.all(tempArr).then((comment)=>{
      comments.docs = comment;
    }).catch((error)=>{
      throw new ApiError(`Error ${error}`, 500);
    })

    return res.status(200).json(new ApiResponse(200, comments, "Comments"));
  }
});

export { postComment, getAllComments };
