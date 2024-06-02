import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  // check if the user is logged in
  // get the user id from the token
  // get title, category and tags from the request body
  // get markups from the request body
  // check if the category is valid
  // get thumbnail and images from the request files
  // upload thumbnail and images to cloudinary
  // create a new blog
  // save the blog to the database
  // send the response

  const { title, tag, markup, category } = req.body;

  const allowedCategories = [
    "Technology",
    "Business",
    "Health",
    "Entertainment",
    "Science",
    "Sports",
    "Education",
    "Lifestyle",
  ];

  if (!title || !tag || !markup || !category) {
    throw new ApiError(400, "Please fill in all fields");
  }

  if (!allowedCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const thumbnail = req.files?.thumbnail[0]?.path;

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnailResponse = await uploadOnCloudinary(thumbnail);

  if (!thumbnailResponse) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const photos = req.files?.photos;

  if (!photos) {
    throw new ApiError(400, "Photos are required");
  }

  const photosPath = photos.map((photo) => photo?.path);

  if (!photosPath) {
    throw new ApiError(400, "Failed to upload photos");
  }

  if (
    !(
      photosPath.length === JSON.parse(markup).length - 1 ||
      photosPath.length === JSON.parse(markup).length
    )
  ) {
    throw new ApiError(400, "Number of photos and markups is not valid");
  }

  const photosResponse = await Promise.all(
    photosPath.map(async (photo) => await uploadOnCloudinary(photo))
  );

  if (!photosResponse) {
    throw new ApiError(500, "Failed to upload photos on cloudinary");
  }

  const photosUrl = photosResponse.map((photo) => photo.url);

  const blog = await Blog.create({
    title,
    owner: req.user._id,
    tag: JSON.parse(tag),
    markup: JSON.parse(markup),
    category,
    thumbnail: thumbnailResponse.url,
    photos: photosUrl,
  });

  const createdBlog = await Blog.findById(blog._id);

  if (!createdBlog) {
    throw new ApiError(500, "Failed to create blog");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdBlog, "Blog created successfully"));
});

const getAllBlogs = asyncHandler(async (req, res) => {});

const getBlogById = asyncHandler(async (req, res) => {});

const getBlogOfUser = asyncHandler(async (req, res) => {});

const updateBlog = asyncHandler(async (req, res) => {});

const deleteBlog = asyncHandler(async (req, res) => {});

export {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogOfUser,
  updateBlog,
  deleteBlog,
};
