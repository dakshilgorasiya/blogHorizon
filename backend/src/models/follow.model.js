import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    followedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Follow = mongoose.model("Follow", followSchema);