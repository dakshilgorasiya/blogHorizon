import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
    thumbnail: {
      type: String,
      required: true,
    },
    markup: [
      {
        type: String,
      },
    ],
    photos: [
      {
        type: String, // cloudinary url
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        // TODO: add more categories
        "Technology",
        "Business",
        "Health",
        "Entertainment",
        "Science",
        "Sports",
        "Education",
        "Lifestyle",
      ],
    },
    view: {
      type: Number,
      default: 0,
    },
    tag: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

blogSchema.plugin(mongooseAggregatePaginate);

export const Blog = mongoose.model("Blog", blogSchema);
