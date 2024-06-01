import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {});

const getAllBlogs = asyncHandler(async (req, res) => {});

const getBlogById = asyncHandler(async (req, res) => {});

const getBlogOfUser = asyncHandler(async (req, res) => {});

const updateBlog = asyncHandler(async (req, res) => {});

const deleteBlog = asyncHandler(async (req, res) => {});

export {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogOfUser,
  updateBlog,
  deleteBlog,
};
