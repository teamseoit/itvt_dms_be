const mongoose = require("mongoose");

const mobileNetworkServicesSchema = new mongoose.Schema({
  periods: {
    type: Number,
    required: true
  },
  supplier_mobile_network_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MobileNetworks"
  },
  mobile_network_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MobileNetworkPlans"
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

mobileNetworkServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if(this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let MobileNetworkServices = mongoose.model("MobileNetworkServices", mobileNetworkServicesSchema);
module.exports = MobileNetworkServices;