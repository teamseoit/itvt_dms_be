const mongoose = require("mongoose");

const domainPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    extension: {
      type: String,
      required: true, // ví dụ: ".com", ".vn"
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
    renewalPrice: {
      type: Number,
      required: true, // giá gia hạn mỗi năm
    },
    registrationYears: {
      type: Number,
      default: 1, // số năm đăng ký mặc định
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceSuppliers",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // bật/tắt hiển thị gói tên miền
    },
  },
  { timestamps: true }
);

const DomainPlan = mongoose.model("DomainPlans", domainPlanSchema);

module.exports = DomainPlan;
