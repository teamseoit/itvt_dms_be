const mongoose = require("mongoose");

const serviceSupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    taxCode: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    supportName: {
      type: String,
      trim: true,
    },
    supportPhone: {
      type: Number,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ServiceSupplier = mongoose.model("ServiceSuppliers", serviceSupplierSchema);

module.exports = ServiceSupplier;
