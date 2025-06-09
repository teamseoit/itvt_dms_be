const mongoose = require("mongoose");

const serverSupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
    },
    taxCode: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      index: true,
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
    },
    supportPhone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const ServerSupplier = mongoose.model("ServerSuppliers", serverSupplierSchema);

module.exports = ServerSupplier;
