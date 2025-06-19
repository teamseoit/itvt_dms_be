const mongoose = require("mongoose");

const domainPlanSchema = new mongoose.Schema(
  {
    nameAction: {
      type: Number,
      required: true,
      index: true,
    },
    extension: {
      type: String,
      required: true,
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
    vatPrice: {
      type: Number,
    },
    vat: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
    }
  },
  { timestamps: true }
);

const DomainPlan = mongoose.model("DomainPlans", domainPlanSchema);

module.exports = DomainPlan;
