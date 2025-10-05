const mongoose = require("mongoose");

const websiteServicesSchema = new mongoose.Schema({
  domainServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainServices"
  },
  price: {
    type: Number,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    index: true
  },
  status: {
    type: Number,
    default: 1
  },
  domainPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainPlans"
  },
  domainSupplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceSuppliers"
  },
  endDate: {
    type: Date
  }
}, {timestamps: true});

let WebsiteServices = mongoose.model("WebsiteServices", websiteServicesSchema);
module.exports = WebsiteServices;