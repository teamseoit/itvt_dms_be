const mongoose = require("mongoose");

const sslPlanSchema = new mongoose.Schema(
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
      index: true,
    },
    retailPrice: {
      type: Number,
      required: true,
      index: true,
    },
    renewalPrice: {
      type: Number,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const SSLPlans = mongoose.model("SSLPlans", sslPlanSchema);
module.exports = SSLPlans;
