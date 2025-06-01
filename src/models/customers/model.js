const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  fullname: { type: String, required: true, index: true },
  email: { type: String, index: true },
  gender: { type: Number, required: true },
  idNumber: { type: Number, required: true },
  phone: { type: Number, required: true, index: true },
  address: String,
  company: String,
  tax_code: String,
  address_company: String,
  representative: String,
  representative_hotline: String,
  mail_vat: String,
  image_front_view: [String],
  image_back_view: [String],
  type_customer: { type: Boolean, default: false }
}, { timestamps: true });

// Liên kết dịch vụ liên quan
customerSchema.virtual('data_service', {
  ref: 'DomainServices',
  localField: '_id',
  foreignField: 'customer_id',
  justOne: false,
});

module.exports = mongoose.model("Customers", customerSchema);
