const mongoose = require("mongoose");

const contentServicesSchema = new mongoose.Schema({
  content_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContentPlans"
  },
  periods: {
    type: Number,
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    index: true
  },
  status: {
    type: Number,
    default: 1
  },
  registeredAt: {
    type: Date
  },
  expiredAt: {
    type: Date
  },
}, {timestamps: true});

contentServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if (this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let ContentServices = mongoose.model("ContentServices", contentServicesSchema);
module.exports = ContentServices;