import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


//* Middleware that verify access token provided in the Authorization header and attach the user object to the request object
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken || accessToken === "null") {
      throw new ApiError(401, "Access token not found");
    }

    // Verify the access token
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
    // Find the user with the id from the decoded token
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Attach the user object to the request object
    req.user = user;

    // Call the next middleware
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
