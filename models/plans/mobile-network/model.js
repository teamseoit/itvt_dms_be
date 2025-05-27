const mongoose = require("mongoose");

const mobileNetworkPlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  capacity: {
    type: Number,
    required: true,
    index: true
  },
  import_price: {
    type: Number,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  content: {
    type: String
  },
  esim: {
    type: Boolean
  },
  supplier_mobile_network_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MobileNetworks",
    required: true
  }
}, {timestamps: true});

let MobileNetworkPlans = mongoose.model("MobileNetworkPlans", mobileNetworkPlansSchema);
module.exports = MobileNetworkPlans;