const mongoose = require("mongoose");

const cronDomainServicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  periods: { // 1 năm, 2 năm - thời gian đăng ký
    type: Number,
    required: true
  },
  supplier_id: { // nhà cung cấp
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers"
  },
  domain_plan_id: { // gói dịch vụ
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainPlans"
  },
  customer_id: { // khách hàng
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers"
  },
  status: { // 1,2,3 đang sử dụng, sắp hết hạn, đã hết hạn
    type: Number
  },
  before_payment: { // true => đã thanh toán
    type: Boolean,
    default: false
  },
  registeredAt: { // ngày đăng ký
    type: Date
  },
  expiredAt: { // ngày hết hạn
    type: Date
  },
}, {timestamps: true});

let CronDomainServices = mongoose.model("CronDomainServices", cronDomainServicesSchema);
module.exports = CronDomainServices;

