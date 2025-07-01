const mongoose = require("mongoose");

const hostingServicesSchema = new mongoose.Schema({
  domainServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainServices"
  },
  hostingPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostingPlans"
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    index: true
  },
  periodValue: {
    type: Number,
    required: true
  },
  periodUnit: {
    type: String,
    default: "năm",
  },
  vatIncluded: {
    type: Boolean,
    default: false
  },
  status: {
    type: Number,
    default: 1
  },
  registeredAt: {
    type: Date
  },
  expiredAt: {
    type: Date
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
}, {timestamps: true});

let HostingServices = mongoose.model("HostingServices", hostingServicesSchema);
module.exports = HostingServices;