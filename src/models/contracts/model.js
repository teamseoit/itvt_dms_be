const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },
    contractCode: {
      type: String,
      unique: true,
    },
    exportVAT: { type: Boolean, default: false },
    services: [
      {
        serviceType: { type: String, required: true },
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "services.serviceTypeRef",
        },
        serviceTypeRef: { type: String, required: true },
        name: String,
        price: Number,
      },
    ],
    financials: {
      totalAmount: { type: Number, default: 0 },
      vatRate: { type: Number, default: 0.1 },
      vatAmount: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 },
      amountPaid: { type: Number, default: 0 },
      amountRemaining: { type: Number, default: 0 },
      isFullyPaid: { type: Boolean, default: false },
    },
    note: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contracts", contractSchema);
