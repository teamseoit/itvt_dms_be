const mongoose = require("mongoose");

const hostingPlansSchema = new mongoose.Schema({
  name: {
    type: String,
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
  account: {
    type: Number,
    required: true,
    index: true
  },
  capacity: {
    type: Number,
    required: true,
    index: true
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers",
    required: true
  }
}, {timestamps: true});

let HostingPlans = mongoose.model("HostingPlans", hostingPlansSchema);
module.exports = HostingPlans;