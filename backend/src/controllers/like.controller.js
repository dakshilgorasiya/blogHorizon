import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

const toggleLike = asyncHandler(async (req, res) => {});

const getLikes = asyncHandler(async (req, res) => {});

const checkLike = asyncHandler(async (req, res) => {});

export { toggleLike, getLikes, checkLike };