const mongoose = require("mongoose");

const serverPlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  cpu: {
    type: String,
  },
  ramInGB: {
    type: Number,
  },
  storageInGB: {
    type: Number,
  },
  bandwidthInTB: {
    type: Number,
  },
  purchasePrice: {
    type: Number,
    required: true,
    index: true
  },
  retailPrice: {
    type: Number,
    required: true,
    index: true
  },
  durationInMonths: {
    type: Number,
    default: 1
  },
  ipAddress: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServerSuppliers",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("ServerPlans", serverPlansSchema);
