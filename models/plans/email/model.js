const mongoose = require("mongoose");

const emailPlansSchema = new mongoose.Schema({
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

let EmailPlans = mongoose.model("EmailPlans", emailPlansSchema);
module.exports = EmailPlans;