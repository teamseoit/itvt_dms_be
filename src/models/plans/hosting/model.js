const mongoose = require("mongoose");

const hostingPlansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    purchasePrice: {
      type: Number,
      required: true,
      index: true,
    },
    vat: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    vatPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
    },
  },
  { timestamps: true }
);

const HostingPlans = mongoose.model("HostingPlans", hostingPlansSchema);
module.exports = HostingPlans;
