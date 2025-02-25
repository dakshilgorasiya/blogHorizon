import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/report.model.js";
import { Blog } from "../models/blog.model.js";

const createReport = asyncHandler(async (req, res) => {
  // Get the blog, content from the request
  const { blogId, content } = req.body;

  if (!blogId || !content) {
    throw new ApiError("Blog and content are required", 400);
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

const getReports = asyncHandler(async (req, res) => {
  // Get the page and limit from the request
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Get the reports
  const aggregateReport = Report.aggregate([
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
              email: 1,
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
        from: "blogs",
        localField: "blog",
        foreignField: "_id",
        as: "blog",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$blog",
    },
  ]);

  // Return the response
  const reports = await Report.aggregatePaginate(aggregateReport, {
    page,
    limit,
  })
    .then((result) => {
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          data: result,
          message: "Reports fetched",
        })
      );
    })
    .catch((error) => {
      throw new ApiError("Error fetching reports", 500);
    });
});

const markReportAsResolved = asyncHandler(async (req, res) => {
  // Get the report id from the request
  const { reportId } = req.body;

  if (!reportId) {
    throw new ApiError("Report id is required", 400);
  }

  // Find the report
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError("Report not found", 404);
  }

  // Update the report
  report.isSolved = true;

  // Save the report
  await report.save();

  // Return the response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: report,
      message: "Report marked as resolved",
    })
  );
});

export { createReport, getReports, markReportAsResolved };
