import mongoose from "mongoose";

//* Define the schema for the comment model
const commentSchema = new mongoose.Schema(
  {
    // user who commented
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // blog on which the comment is made
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    // comment on which the comment is made
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    // content of the comment
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
