import mongoose from "mongoose";

//* Define the schema for the like model
const likeSchema = new mongoose.Schema(
  {
    // user who liked
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // blog on which the like is made
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    // comment on which the like is
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
