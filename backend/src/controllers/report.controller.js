import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/report.model.js";
import { Blog } from "../models/blog.model.js";

const createReport = asyncHandler(async (req, res) => {
  // Get the blog, content, title from the request
  const { blogId, content, title } = req.body;

  if (!blogId || !content || !title) {
    throw new ApiError("Blog, title and content are required", 400);
  }

  // Check if blog exists
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError("Blog not found", 404);
  }

  // Create a report
  const report = await Report.create({
    owner: req.user._id,
    blog: blogId,
    content,
    title,
  });

  // Return the response
  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: report,
      message: "Report created",
    })
  );
});

export { createReport };
