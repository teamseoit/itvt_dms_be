const mongoose = require("mongoose");
const dayjs = require("dayjs");

const domainServicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    periodValue: {
      type: Number,
      required: true,
      min: 1,
    },
    periodUnit: {
      type: String,
      default: "năm",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },
    domainPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DomainPlans",
      default: null,
    },
    serverPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerPlans",
      default: null,
    },
    vatIncluded: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    registeredAt: {
      type: Date,
    },
    expiredAt: {
      type: Date,
    },
    pingCloudflare: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      enum: [1, 2, 3], // 1: Hoạt động, 2: Sắp hết hạn, 3: Hết hạn
      default: 1,
    },
    daysUntilExpiry: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

domainServicesSchema.pre("validate", async function (next) {
  try {
    if (this.domainPlan) {
      const DomainPlan = mongoose.model("DomainPlans");
      const plan = await DomainPlan.findById(this.domainPlan).lean();

      if (plan && plan.retailPrice && this.periodValue) {
        this.totalPrice = plan.retailPrice * this.periodValue;
      }
    }

    // Tính expiredAt nếu có registeredAt
    if (this.registeredAt && this.periodValue && this.periodUnit) {
      const unitMap = {
        "năm": "year",
      };

      const unitForDayjs = unitMap[this.periodUnit];
      if (unitForDayjs) {
        this.expiredAt = dayjs(this.registeredAt)
          .add(this.periodValue, unitForDayjs)
          .toDate();
      }
    }

    // Tự động cập nhật status và daysUntilExpiry dựa trên expiredAt
    if (this.expiredAt) {
      const currentDate = dayjs();
      const expiryDate = dayjs(this.expiredAt);
      const daysUntilExpiry = expiryDate.diff(currentDate, 'day');

      this.daysUntilExpiry = daysUntilExpiry;

      if (daysUntilExpiry < 0) {
        // Đã hết hạn
        this.status = 3;
      } else if (daysUntilExpiry <= 30) {
        // Sắp hết hạn (trong vòng 30 ngày)
        this.status = 2;
      } else {
        // Còn hạn
        this.status = 1;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Middleware để cập nhật status và daysUntilExpiry trước khi save
domainServicesSchema.pre("save", function (next) {
  if (this.expiredAt) {
    const currentDate = dayjs();
    const expiryDate = dayjs(this.expiredAt);
    const daysUntilExpiry = expiryDate.diff(currentDate, 'day');

    this.daysUntilExpiry = daysUntilExpiry;

    if (daysUntilExpiry < 0) {
      this.status = 3;
    } else if (daysUntilExpiry <= 30) {
      this.status = 2;
    } else {
      this.status = 1;
    }
  }
  next();
});

module.exports = mongoose.model("DomainServices", domainServicesSchema);
