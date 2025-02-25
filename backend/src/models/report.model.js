import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

//* Define the schema for the report model
const reportSchema = new mongoose.Schema(
  {
    // user who reported
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // blog on which the report is made
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    // complaint of user
    content: {
      type: String,
      required: true,
    },
    // title of the report
    title: {
      type: String,
      required: true,
    },
    // status of the report
    isSolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reportSchema.plugin(mongooseAggregatePaginate);

export const Report = mongoose.model("Report", reportSchema);
