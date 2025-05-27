const mongoose = require("mongoose");

const sslServicesSchema = new mongoose.Schema({
  domain_service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainServices"
  },
  ssl_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SslPlans"
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
  ssl_supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers"
  },
}, {timestamps: true});

sslServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if (this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let SslServices = mongoose.model("SslServices", sslServicesSchema);
module.exports = SslServices;