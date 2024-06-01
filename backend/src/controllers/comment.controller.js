import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const postComment = asyncHandler(async (req, res) => {});

const getAllComments = asyncHandler(async (req, res) => {});    

export { postComment, getAllComments };