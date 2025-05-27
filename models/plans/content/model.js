const mongoose = require("mongoose");

const contentPlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  number_of_articles: {
    type: Number,
    required: true,
    index: true
  }
}, {timestamps: true});

let ContentPlans = mongoose.model("ContentPlans", contentPlansSchema);
module.exports = ContentPlans;