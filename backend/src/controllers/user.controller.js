import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../utils/sendMail.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { Follow } from "../models/follow.model.js";
import { Like } from "../models/like.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { COOKIE_CONFIG, BLOG_CATEGORY } from "../constants.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";

//* controller for user registration
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend

  const { userName, email, password, bio = "", interests } = req.body;

  const interestsList = interests.split(",").map((interest) => interest.trim());

  // validation - not empty
  if (!userName || !email || !password || interestsList.length === 0) {
    if (req?.files && req?.files?.avatar && req?.files?.avatar[0]?.path)
      fs.unlinkSync(req?.files?.avatar[0]?.path);

    throw new ApiError(400, "All fields are required");
  }

  // check for valid categories
  for (let interest of interestsList) {
    if (!BLOG_CATEGORY.includes(interest)) {
      if (req?.files && req?.files?.avatar && req?.files?.avatar[0]?.path)
        fs.unlinkSync(req?.files?.avatar[0]?.path);
      throw new ApiError(400, "Invalid interest category");
    }
  }

  // check for minimum 3 interests
  if (interestsList.length < 3) {
    if (req?.files && req?.files?.avatar && req?.files?.avatar[0]?.path)
      fs.unlinkSync(req?.files?.avatar[0]?.path);
    throw new ApiError(400, "At least 3 interests are required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    if (req?.files && req?.files?.avatar && req?.files?.avatar[0]?.path)
      fs.unlinkSync(req?.files?.avatar[0]?.path);
    throw new ApiError(409, "User already exists");
  }

  // check for avatar
  const avatarLocalPath = req?.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload it on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  // create user object - create entry in db
  const user = await User.create({
    userName: userName,
    email: email.toLowerCase(),
    password,
    bio,
    interests: interestsList,
    avatar: avatar.url,
    profileCompleted: true,
  });

  // generate otp and save in db
  const otp = user.generateOtp();
  user.otp = otp;
  user.otpAttempts = 3;
  await user.save({
    validateBeforeSave: false,
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 400px; text-align: center; background-color: #f9f9f9;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #555;">Use the following OTP to complete your verification process:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2d89ef; margin: 10px 0;">${otp}</p>
        <p style="font-size: 14px; color: #777;">This OTP is valid for a limited time. Do not share it with anyone.</p>
    </div>
`;

  try {
    await sendMail({
      to: user.email,
      subject: "OTP Code - BlogHorizon",
      content: htmlContent,
      isHtml: true,
    });
  } catch (error) {
    throw new ApiError(500, "Email sending failed");
  }

  // remove password and refreshtoken field from response
  const responseUser = {
    ...user._doc,
    password: undefined,
    otp: undefined,
    otpAttempts: undefined,
    otpExpiry: undefined,
  };

  // return response and save refreshToken in cookie
  return res.status(200).json(
    new ApiResponse({
      statusCode: 201,
      data: responseUser,
      message: "User registered successfully",
    })
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { email, password } = req.body;

  // validation - not empty
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  console.log(email);

  // find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // generate otp and save in db
  const otp = user.generateOtp();
  user.otp = otp;
  user.otpAttempts = 3;
  await user.save({
    validateBeforeSave: false,
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 400px; text-align: center; background-color: #f9f9f9;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #555;">Use the following OTP to complete your verification process:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2d89ef; margin: 10px 0;">${otp}</p>
        <p style="font-size: 14px; color: #777;">This OTP is valid for a limited time. Do not share it with anyone.</p>
    </div>
`;

  try {
    await sendMail({
      to: user.email,
      subject: "OTP Code - BlogHorizon",
      content: htmlContent,
      isHtml: true,
    });
  } catch (error) {
    throw new ApiError(500, "Email sending failed");
  }

  const responseUser = {
    ...user._doc,
    password: undefined,
    otp: undefined,
    otpAttempts: undefined,
    otpExpiry: undefined,
    refreshToken: undefined,
  };

  // send cookie
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responseUser,
      message: "User logged in successfully",
    })
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  // get refresh token from cookie
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  // find user by id

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  user.refreshToken = undefined;

  // remove refresh token from database
  await user.save({
    validateBeforeSave: false,
  });

  // clear cookies
  return res
    .status(200)
    .clearCookie("refreshToken", COOKIE_CONFIG)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: "User logged out successfully",
      })
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // remove password and refreshtoken field from response
  const responseUser = {
    ...req.user._doc,
    password: undefined,
    refreshToken: undefined,
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responseUser,
      message: "User details fetched successfully",
    })
  );
});

const updateAvatar = asyncHandler(async (req, res) => {
  // check for avatar
  const avatarLocalPath = req?.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload it on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  // update user avatar
  const user = req?.user;
  user.avatar = avatar.url;

  await user.save();

  const responseUser = {
    ...user._doc,
    password: undefined,
    refreshToken: undefined,
  };

  // return response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responseUser,
      message: "Avatar updated successfully",
    })
  );
});

const updateBio = asyncHandler(async (req, res) => {
  // get bio from frontend
  const { bio } = req.body;

  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }

  // get user from request and update user bio
  const user = req?.user;
  user.bio = bio;
  await user.save();

  const responseUser = {
    ...user._doc,
    password: undefined,
    refreshToken: undefined,
  };

  // return response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responseUser,
      message: "Bio updated successfully",
    })
  );
});

const makeBlogFavorite = asyncHandler(async (req, res) => {
  // add blog to favorite list
  // return response

  // get blog id from frontend
  const { blogId } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  // check if blog exists
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // get user from request
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.favorite) {
    user.favorite = [];
  }

  // check if blog is already favorite
  if (user.favorite.includes(blogId)) {
    user.favorite = user.favorite.filter((id) => id.toString() !== blogId);
  } else {
    user.favorite.push(blogId);
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "Blog favorite updated successfully",
    })
  );
});

const renewAccessToken = asyncHandler(async (req, res) => {
  // get refresh token from cookie
  const refreshToken = req?.cookies?.refreshToken;

  // check if refresh token exists
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  // decode refresh token
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // find user by id
  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // check refresh token with refresh token in db
  if (!user.compareRefreshToken(refreshToken)) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // generate new access token and refresh token
  const accessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();

  // save new refresh token in db
  user.refreshToken = newRefreshToken;
  await user.save({
    validateBeforeSave: false,
  });

  const responseUser = {
    ...user._doc,
    accessToken,
    password: undefined,
    refreshToken: undefined,
    otp: undefined,
    otpAttempts: undefined,
    otpExpiry: undefined,
  };

  // send new access token in response and save new refresh token in cookie
  return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, COOKIE_CONFIG)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: responseUser,
        message: "Access token renewed successfully",
      })
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  // get email from frontend
  const email = req?.body?.email;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // generate reset token
  const resetToken = await user.generateResetPasswordToken();

  // save reset token and expiry in db
  user.resetPasswordToken = resetToken;
  await user.save({
    validateBeforeSave: false,
  });

  // send email with reset token
  const resetUrl = `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/reset-password/${resetToken}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
      <p>Hi <b>${user.name || "User"}</b>,</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" 
          style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </div>
      <p>If you didn’t request a password reset, please ignore this email.</p>
      <p>Thanks, <br/> <b>BlogHorizon Team</b></p>
    </div>
  `;

  try {
    await sendMail({
      to: user.email,
      subject: "Reset Password - BlogHorizon",
      content: htmlContent,
      isHtml: true,
    });
    // return response
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: "Email sent successfully",
      })
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    throw new ApiError(500, "Email sending failed");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  // get reset token from frontend
  const resetToken = req?.params?.resetToken;

  if (!resetToken) {
    throw new ApiError(400, "Reset token is required");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // get user from reset token and check expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // update password
  const { password, confirmPassword } = req?.body;

  if (!password && !confirmPassword) {
    throw new ApiError(400, "Password and passwordConfirm are required");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and passwordConfirm do not match");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();

  // return response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "Password reset successfully",
    })
  );
});

const googleOauth = asyncHandler(async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Google token is required");
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    throw new ApiError(400, "Google token verification failed");
  }
  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(400, "Google token verification failed");
  }

  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      userName: name,
      email: email,
      avatar: picture,
      emailVerified: true,
    });
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });

  const responseUser = {
    ...user._doc,
    password: undefined,
    refreshToken: undefined,
    otp: undefined,
    otpAttempts: undefined,
    otpExpiry: undefined,
    accessToken,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, COOKIE_CONFIG)
    .json(
      new ApiResponse({
        statusCode: 201,
        data: responseUser,
        message: "User registered successfully",
      })
    );
});

const verifyOtp = asyncHandler(async (req, res) => {
  // get email, otp from frontend
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  // get user using email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.otp) {
    throw new ApiError(400, "OTP not generated");
  }

  if (user.otpAttempts === 0) {
    throw new ApiError(400, "OTP attempts exceeded");
  }

  // check if otp matches
  if (!user.compareOtp(otp)) {
    user.otpAttempts -= 1;
    await user.save({
      validateBeforeSave: false,
    });
    throw new ApiError(400, "Invalid OTP");
  }

  // check if otp is expired
  if (user.otpExpiry < Date.now()) {
    user.otp = undefined;
    user.otpAttempts = undefined;
    user.otpExpiry = undefined;
    await user.save();
    throw new ApiError(400, "OTP expired");
  }

  // update emailVerified field
  user.emailVerified = true;

  // generate access token and refresh token
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;

  // remove otp fields from user
  user.otp = undefined;
  user.otpAttempts = undefined;
  user.otpExpiry = undefined;

  // save user
  await user.save();

  // return response
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, COOKIE_CONFIG)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: {
          accessToken,
        },
        message: "OTP verified successfully",
      })
    );
});

const profileComplete = asyncHandler(async (req, res) => {
  // get password, bio, interests from frontend
  const { password, bio, interests } = req.body;

  if (!password || !bio || !interests) {
    throw new ApiError(400, "All fields are required");
  }

  // get user from req
  const user = req?.user;

  // check if user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // check if user is verified
  if (!user.emailVerified) {
    throw new ApiError(401, "Email not verified");
  }

  // check if user is profile completed
  if (user.profileCompleted) {
    throw new ApiError(400, "Profile already completed");
  }

  for (let interest of interests) {
    if (!BLOG_CATEGORY.includes(interest)) {
      throw new ApiError(400, "Invalid interest category");
    }
  }

  // check for minimum 3 interests
  if (interests.length < 3) {
    throw new ApiError(400, "At least 3 interests are required");
  }

  // update user details
  user.password = password;
  user.bio = bio;
  user.interests = interests;
  user.profileCompleted = true;

  await user.save();

  // return response
  const responseUser = {
    ...user._doc,
    password: undefined,
    refreshToken: undefined,
    otp: undefined,
    otpAttempts: undefined,
    otpExpiry: undefined,
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responseUser,
      message: "Profile completed successfully",
    })
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  // get user id from url
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is required");
  }

  // get user details from db and remove password, refreshtoken field, otp fields, resetToken fields calculate followers, following and find blogs
  let user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followedBy",
        as: "following",
      },
    },
    {
      $addFields: { following: { $size: "$following" } },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followTo",
        as: "followers",
      },
    },
    {
      $addFields: { followers: { $size: "$followers" } },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "_id",
        foreignField: "owner",
        as: "blogs",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "blog",
              as: "likes",
            },
          },
          {
            $addFields: { likes: { $size: "$likes" } },
          },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "blog",
              as: "comments",
            },
          },
          {
            $addFields: { comments: { $size: "$comments" } },
          },
          {
            $project: {
              title: 1,
              tags: 1,
              category: 1,
              owner: 1,
              createdAt: 1,
              likes: 1,
              comments: 1,
              content: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        otp: 0,
        otpAttempts: 0,
        otpExpiry: 0,
        resetPasswordToken: 0,
        resetPasswordTokenExpiry: 0,
        history: 0,
        favorite: 0,
        interests: 0,
        emailVerified: 0,
        profileCompleted: 0,
      },
    },
  ]);

  user = user[0];

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.blogs.map((blog) => {
    blog.thumbnail = blog.content[0].data;
    blog.content = null;
  });

  // if user is found than check if user is following the user and has liked the blog
  if (req?.user) {
    // check if user is following the user
    const following = await Follow.findOne({
      followedBy: req?.user?._id,
      followedTo: new mongoose.Types.ObjectId(userId),
    });
    if (following) user.isFollowing = true;
    else user.isFollowing = false;

    // check if user has liked the blog
    await Promise.all(
      user.blogs.map(async (blog) => {
        const liked = await Like.findOne({
          blog: blog._id,
          likedBy: req?.user?._id,
        });
        if (liked) blog.isLiked = true;
        else blog.isLiked = false;
      })
    );
  }

  // return response
  return res.status(200).json({
    statusCode: 200,
    data: user,
    message: "User profile fetched successfully",
  });
});

const getUserInterests = asyncHandler(async (req, res) => {
  // get user from request
  const user = req?.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // return response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: user.interests,
      message: "User interests fetched successfully",
    })
  );
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "User not authorized");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "User is admin",
    })
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  updateBio,
  makeBlogFavorite,
  renewAccessToken,
  forgotPassword,
  resetPassword,
  googleOauth,
  verifyOtp,
  profileComplete,
  getUserProfile,
  getUserInterests,
  verifyAdmin,
};
