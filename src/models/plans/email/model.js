const mongoose = require("mongoose");

const emailPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    renewalPrice: {
      type: Number,
      required: true,
    },
    accountCount: {
      type: Number,
      required: true,
      min: 1,
    },
    storagePerAccountGB: {
      type: Number,
      required: true,
      min: 1,
    },
    emailFeatures: {
      type: [String],
      default: [],
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
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
    },
  },
  { timestamps: true }
);

const EmailPlans = mongoose.model("EmailPlans", emailPlanSchema);
module.exports = EmailPlans;
