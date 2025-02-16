import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { BLOG_CATEGORY } from "../constants.js";

//* Define the schema for the blog model
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // content of the blog
    content: [
      {
        type: {
          type: String,
          enum: ["text", "image", "code"], // Define different content types
          required: true,
        },
        data: {
          type: mongoose.Schema.Types.Mixed, // Allows string or object
          required: true,
        },
      },
    ],
    // category of the blog
    category: {
      type: String,
      required: true,
      enum: BLOG_CATEGORY,
    },
    // number of users read the blog
    view: {
      type: Number,
      default: 0,
    },
    // hashtags for the blog
    tags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Add pagination plugin to the schema to enable pagination
blogSchema.plugin(aggregatePaginate);

export const Blog = mongoose.model("Blog", blogSchema);
