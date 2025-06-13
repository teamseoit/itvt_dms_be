const mongoose = require("mongoose");

const contentPlansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    retailPrice: {
      type: Number,
      required: true,
      index: true,
    },
    numberOfArticles: {
      type: Number,
      required: true,
    },
    deliveryTimeInDays: {
      type: Number,
      required: true,
    },
    revisionTimes: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContentPlans", contentPlansSchema);
