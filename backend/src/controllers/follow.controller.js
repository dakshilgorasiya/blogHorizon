import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Follow } from "../models/follow.model.js";

const toggleFollowUser = asyncHandler(async (req, res) => {});

const getFollowers = asyncHandler(async (req, res) => {});

const getFollowing = asyncHandler(async (req, res) => {});

const checkFollow = asyncHandler(async (req, res) => {});

export { toggleFollowUser, getFollowers, getFollowing, checkFollow };
