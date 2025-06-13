const mongoose = require("mongoose");

const maintenancePlansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    scopeOfWork: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenancePlans", maintenancePlansSchema);
