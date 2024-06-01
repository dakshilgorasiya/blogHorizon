import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reportSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reportSchema.plugin(mongooseAggregatePaginate);

export const Report = mongoose.model("Report", reportSchema);
