const mongoose = require("mongoose");

const itvtSslServicesSchema = new mongoose.Schema({
  domainServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItvtDomainServices"
  },
  sslPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SSLPlans"
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

let ItvtSslServices = mongoose.model("ItvtSslServices", itvtSslServicesSchema);
module.exports = ItvtSslServices;
