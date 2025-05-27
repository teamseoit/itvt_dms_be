const mongoose = require("mongoose");

const domainPlansSchema = new mongoose.Schema({
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
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers",
    required: true
  }
}, {timestamps: true});

let DomainPlans = mongoose.model("DomainPlans", domainPlansSchema);
module.exports = DomainPlans;