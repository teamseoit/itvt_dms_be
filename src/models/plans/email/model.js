const mongoose = require("mongoose");

const emailPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    nameAction: {
      type: Number,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    vat: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalPurchaseWithoutVAT: {
      type: Number,
    },
    totalPurchaseWithVAT: {
      type: Number,
    },
    totalRetailWithoutVAT: {
      type: Number,
    },
    totalRetailWithVAT: {
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

const EmailPlans = mongoose.model("EmailPlans", emailPlanSchema);
module.exports = EmailPlans;
