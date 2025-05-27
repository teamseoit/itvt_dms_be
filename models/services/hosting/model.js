const mongoose = require("mongoose");

const hostingServicesSchema = new mongoose.Schema({
  domain_service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainServices"
  },
  hosting_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostingPlans"
  },
  periods: {
    type: Number,
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    index: true
  },
  status: {
    type: Number,
    default: 1
  },
  before_payment: {
    type: Boolean,
    default: false
  },
  after_payment: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date
  },
  expiredAt: {
    type: Date
  },
  domain_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainPlans"
  },
  domain_supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers"
  },
  hosting_supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers"
  },
}, {timestamps: true});

hostingServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if (this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let HostingServices = mongoose.model("HostingServices", hostingServicesSchema);
module.exports = HostingServices;