const mongoose = require("mongoose");

const itvtEmailServicesSchema = new mongoose.Schema({
  domainServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItvtDomainServices"
  },
  emailPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmailPlans"
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

let ItvtEmailServices = mongoose.model("ItvtEmailServices", itvtEmailServicesSchema);
module.exports = ItvtEmailServices;
