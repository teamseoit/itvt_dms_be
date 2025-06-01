const mongoose = require("mongoose");

const domainITVTSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers",
  },
  domain_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainPlans",
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
  server_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServerPlans",
    required: true
  },
  ping_cloudflare: {
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
}, {timestamps: true});

let DomainITVT = mongoose.model("DomainITVT", domainITVTSchema);
module.exports = DomainITVT;
