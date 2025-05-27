const mongoose = require("mongoose");

const toplistServicesSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rental_location: {
    type: Number,
    required: true
  },
  periods: {
    type: Number,
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    index: true
  },
  status: {
    type: Number,
    default: 1
  },
  registeredAt: {
    type: Date
  },
  expiredAt: {
    type: Date
  },
}, {timestamps: true});

toplistServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if (this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let ToplistServices = mongoose.model("ToplistServices", toplistServicesSchema);
module.exports = ToplistServices;