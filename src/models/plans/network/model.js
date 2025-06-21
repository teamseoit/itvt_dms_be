const mongoose = require("mongoose");

const networkPlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  dataCapacityInGB: {
    type: Number,
    required: true,
    index: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
    index: true,
  },
  retailPrice: {
    type: Number,
    required: true,
    index: true,
  },
  validityInDays: {
    type: Number, // Thời gian sử dụng gói (30 ngày, 90 ngày, v.v.)
    required: false,
  },
  esimSupported: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NetworkSuppliers",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("NetworkPlans", networkPlansSchema);
