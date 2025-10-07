const mongoose = require("mongoose");
const dayjs = require("dayjs");

const itvtDomainServicesSchema = new mongoose.Schema(
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
    totalPrice: {
      type: Number,
      default: 0,
    },
    vatPrice: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItvtDomainServices", itvtDomainServicesSchema);
