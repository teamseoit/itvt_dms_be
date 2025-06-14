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
      enum: [-1, 0, 1],
      default: 1,
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

    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model("DomainServices", domainServicesSchema);
