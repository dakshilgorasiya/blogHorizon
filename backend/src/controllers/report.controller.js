import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/report.model.js";

const createReport = asyncHandler(async (req, res) => {});

const getReports = asyncHandler(async (req, res) => {});

const markReportAsResolved = asyncHandler(async (req, res) => {});

export { createReport, getReports,  markReportAsResolved };
