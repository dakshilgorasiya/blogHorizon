import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/report.model.js";
import { Blog } from "../models/blog.model.js";

const createReport = asyncHandler(async (req, res) => {
  // Get the blog, content from the request
  // Create a report
  // Return the response

  const { blogId, content } = req.body;

  if (!blogId || !content) {
    throw new ApiError("Blog and content are required", 400);
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError("Blog not found", 404);
  }

  const report = await Report.create({
    owner: req.user._id,
    blog: blogId,
    content,
  });

  return res.status(201).json(new ApiResponse(201, "Reported", report));
});

const getReports = asyncHandler(async (req, res) => {
  // Get the page and limit from the request
  // Get the reports
  // Return the response

  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;

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
        $lookup:{
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
                    }
                }
            ]
        }
    },
    {
        $unwind: "$blog"
    }
  ]);

  const reports = await Report.aggregatePaginate(aggregateReport, {
    page,
    limit,
  })
    .then((result) => {
      return res.status(200).json(new ApiResponse(200, result, "Reports"));
    })
    .catch((error) => {
      throw new ApiError("Error fetching reports", 500);
    });
});

const markReportAsResolved = asyncHandler(async (req, res) => {
  // Get the report id from the request
  // Find the report
  // Update the report
  // Return the response

  const { reportId } = req.body;

  if (!reportId) {
    throw new ApiError("Report id is required", 400);
  }

  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError("Report not found", 404);
  }

  report.isSolved = true;

  const newReport = await report.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newReport, "Report resolved"));
});

export { createReport, getReports, markReportAsResolved };
