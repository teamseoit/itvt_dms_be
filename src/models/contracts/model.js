const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    contractCode: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },
    note: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contracts", contractSchema);
