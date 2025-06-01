const mongoose = require("mongoose");

const sslPlansSchema = new mongoose.Schema({
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
  feature: {
    type: String,
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers",
    required: true
  }
}, {timestamps: true});

let SslPlans = mongoose.model("SslPlans", sslPlansSchema);
module.exports = SslPlans;