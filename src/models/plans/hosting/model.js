const mongoose = require("mongoose");

const hostingPlansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
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
      required: false,
    },
    registrationYears: {
      type: Number,
      default: 1,
    },
    account: {
      type: Number,
      required: true,
      index: true,
    },
    capacity: {
      type: Number,
      required: true,
      index: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const HostingPlans = mongoose.model("HostingPlans", hostingPlansSchema);
module.exports = HostingPlans;
