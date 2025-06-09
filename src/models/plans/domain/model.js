const mongoose = require("mongoose");

const domainPlanSchema = new mongoose.Schema(
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
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
    },
  },
  { timestamps: true }
);

const DomainPlan = mongoose.model("DomainPlans", domainPlanSchema);

module.exports = DomainPlan;
