import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../utils/sendMail.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { COOKIE_CONFIG, BLOG_CATEGORY } from "../constants.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import fs from "fs";

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
  });

  // generate accessToken and refreshToken
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // save refreshToken to database
  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });

  // remove password and refreshtoken field from response
  const responseUser = {
    ...user._doc,
    password: undefined,
    refreshToken: undefined,
    accessToken,
  };

  // return response and save refreshToken in cookie
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

const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { email, password } = req.body;

  // validation - not empty
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

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

  // give new access and refresh token
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save();

  const responseUser = {
    ...user._doc,
    password: undefined,
    refreshToken: undefined,
    accessToken,
  };

  // send cookie
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, COOKIE_CONFIG)
    .json(
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
  // get blog id from frontend
  // get user from request
  // check if blog exists
  // check if blog is already favorite
  // add blog to favorite list
  // return response

  const { blogId } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const user = await User.findById(req.user._id);

  if (!user.favorite) {
    user.favorite = [];
  }

  if (user.favorite.includes(blogId)) {
    throw new ApiError(400, "Blog already favorite");
  }

  user.favorite.push(blogId);

  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Blog added to favorite successfully"));
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

  // send new access token in response and save new refresh token in cookie
  return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, COOKIE_CONFIG)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: {
          accessToken,
        },
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
  const { password, passwordConfirm } = req?.body;

  if (!password && !passwordConfirm) {
    throw new ApiError(400, "Password and passwordConfirm are required");
  }

  if (password !== passwordConfirm) {
    throw new ApiError(400, "Password and passwordConfirm do not match");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save({
    validateBeforeSave: false,
  });

  // return response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "Password reset successfully",
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
};
