import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
