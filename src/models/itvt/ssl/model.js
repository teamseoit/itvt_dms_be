const mongoose = require("mongoose");

const sslITVTSchema = new mongoose.Schema({
  domain_itvt_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainITVT"
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
    index: true,
    required: true
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

let SslITVT = mongoose.model("SslITVT", sslITVTSchema);
module.exports = SslITVT;