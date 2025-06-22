const mongoose = require("mongoose");
const dayjs = require("dayjs");

const domainServicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    periodValue: {
      type: Number,
      required: true,
      min: 1,
    },
    periodUnit: {
      type: String,
      default: "năm",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },
    domainPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DomainPlans",
      default: null,
    },
    serverPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerPlans",
      default: null,
    },
    vatIncluded: {
      type: Boolean,
      default: false,
    },
    registeredAt: {
      type: Date,
    },
    expiredAt: {
      type: Date,
    },
    pingCloudflare: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    daysUntilExpiry: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

domainServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customerId) {
    ModelContract.create_or_update_contract(this.customerId);
  } else if (this['$set']?.customerId) {
    ModelContract.create_or_update_contract(this['$set']?.customerId);
  }
});

module.exports = mongoose.model("DomainServices", domainServicesSchema);
