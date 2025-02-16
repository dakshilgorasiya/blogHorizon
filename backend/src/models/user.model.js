import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateHash } from "../utils/generateHash.js";
import crypto from "crypto";

//* Define the schema for the user model
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    // cloudinary url
    avatar: {
      type: String,
      required: true,
    },
    // encrypted password
    password: {
      type: String,
    },
    // history of blogs read by the user
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    // blogs saved by the user
    favorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    interests: {
      type: [String],
    },
    bio: {
      type: String,
      default: "",
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    // refresh token to generate new access token
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Middleware to hash accessToken before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("refreshToken")) return next();

  if (!this.refreshToken) {
    next();
  }

  this.refreshToken = generateHash(this.refreshToken);
  next();
});

// Middleware to hash resetPasswordToken before saving and set expiry
userSchema.pre("save", async function (next) {
  if (!this.isModified("resetPasswordToken")) return next();

  if (!this.resetPasswordToken) {
    next();
  }

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(this.resetPasswordToken)
    .digest("hex");

  this.resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  next();
});

// Middleware to hash otp before saving and set expiry
userSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  if (!this.otp) {
    next();
  }

  this.otp = crypto.createHash("sha256").update(this.otp).digest("hex");

  this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  next();
});

// Method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to comare refreshToken
userSchema.methods.compareRefreshToken = function (refreshToken) {
  const hash = generateHash(refreshToken);
  return this.refreshToken === hash;
};

// Method to compare otp
userSchema.methods.compareOtp = function (otp) {
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return this.otp === hash;
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Method to generate resetPasswordToken
userSchema.methods.generateResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return resetToken;
};

// Method to generate otp
userSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp
  return otp;
};

export const User = mongoose.model("User", userSchema);
