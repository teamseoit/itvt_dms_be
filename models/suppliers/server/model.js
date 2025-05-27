const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  company: {
    type: String,
    required: true,
    index: true,
  },
  tax_code: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    index: true,
  },
  name_support: {
    type: String,
  },
  phone_support: {
    type: String,
  },
  address: {
    type: String,
  }
}, {timestamps: true});

let Server = mongoose.model("Servers", serverSchema);
module.exports = Server;