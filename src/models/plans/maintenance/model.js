const mongoose = require("mongoose");

const maintenancePlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  note: {
    type: String,
  }
}, {timestamps: true});

let MaintenancePlans = mongoose.model("MaintenancePlans", maintenancePlansSchema);
module.exports = MaintenancePlans;