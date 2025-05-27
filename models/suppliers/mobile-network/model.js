const mongoose = require("mongoose");

const mobileNetworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {timestamps: true});

let MobileNetwork = mongoose.model("MobileNetworks", mobileNetworkSchema);
module.exports = MobileNetwork;