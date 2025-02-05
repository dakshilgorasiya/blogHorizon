import mongoose from "mongoose";

//* Define the schema for the follow model
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