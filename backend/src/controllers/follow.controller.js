import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Follow } from "../models/follow.model.js";
import { mongoose } from "mongoose";
import { User } from "../models/user.model.js";

const toggleFollowUser = asyncHandler(async (req, res) => {
  // Get the user id of the user to follow/unfollow
  // Get the user id of the user who wants to follow/unfollow
  // Check if the user to follow/unfollow exists

  const { followId } = req.body;

  if (!followId) {
    throw new ApiError(400, "Please provide a user id to follow/unfollow");
  }

  if (
    new mongoose.Types.ObjectId(followId).toString() ===
    new mongoose.Types.ObjectId(req.user._id).toString()
  ) {
    throw new ApiError(400, "You cannot follow/unfollow yourself");
  }

  const userExists = await User.findById(followId);

  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const follow = await Follow.findOne({
    followedBy: req.user._id,
    followedTo: userExists._id,
  });

  if (follow) {
    await Follow.deleteOne({
      followedBy: req.user._id,
      followedTo: userExists._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unfollowed successfully"));
  } else {
    await Follow.create({
      followedBy: req.user._id,
      followedTo: userExists._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Followed successfully"));
  }
});

const getFollowers = asyncHandler(async (req, res) => {
  // Get the user id of the user to get followers
  // Get the followers of the user
  // return response

  const { userId } = req.user._id;

  const followers = await Follow.aggregate([
    {
      $match: {
        followedTo: req.user._id,
      },
    },
    {
      $count: "followersCount",
    },
    {
      $project: {
        _id: 0,
        followersCount: 1,
      },
    },
  ]);

  if (followers.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { followersCount: 0 }, "Followers"));
  }

  return res.status(200).json(new ApiResponse(200, followers[0], "Followers"));
});

const getFollowing = asyncHandler(async (req, res) => {
  // Get the user id of the user to get following
  // Get the following of the user
  // return response

  const { userId } = req.user._id;

  const following = await Follow.aggregate([
    {
      $match: {
        followedBy: req.user._id,
      },
    },
    {
      $count: "followingCount",
    },
  ]);

  if (following.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { followingCount: 0 }, "Following"));
  }

  return res.status(200).json(new ApiResponse(200, following[0], "Following"));
});

const checkFollow = asyncHandler(async (req, res) => {
  // Get the user id of the user to check if following
  // Get the user id of the user to check if followed
  // Check if the user to check if following exists
  // return response

  const { userId } = req.user._id;

  const { followId } = req.body;

  if (!followId) {
    throw new ApiError(400, "Please provide a user id to check if following");
  }

  const follow = await Follow.findOne({
    followedBy: req.user._id,
    followedTo: new mongoose.Types.ObjectId(followId),
  });

  if (follow) {
    return res
      .status(200)
      .json(new ApiResponse(200, { following: true }, "Following"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, { following: false }, "Not following"));
  }
});

export { toggleFollowUser, getFollowers, getFollowing, checkFollow };
