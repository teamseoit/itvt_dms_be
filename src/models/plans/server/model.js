const mongoose = require("mongoose");

const serverPlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  supplier_server_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servers",
    required: true
  }
}, {timestamps: true});

let ServerPlans = mongoose.model("ServerPlans", serverPlansSchema);
module.exports = ServerPlans;