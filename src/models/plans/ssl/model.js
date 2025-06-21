const mongoose = require("mongoose");

const sslPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
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
    vat: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalPurchasePriceWithVAT: { 
      type: Number,
    },
    totalRetailPriceWithVAT: { 
      type: Number,
    },
    supplierId: {
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
