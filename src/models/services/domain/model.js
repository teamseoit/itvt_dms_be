const mongoose = require("mongoose");

const domainServicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  periods: {
    type: Number,
    required: true
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers"
  },
  domain_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainPlans"
  },
  server_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServerPlans"
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    index: true
  },
  ping_cloudflare: {
    type: Boolean,
    default: false
  },
  status: {
    type: Number,
    default: 1
  },
  before_payment: {
    type: Boolean,
    default: false
  },
  after_payment: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date
  },
  expiredAt: {
    type: Date
  },
}, {timestamps: true});

// domainServicesSchema.pre('save', async function (next){

//   const date = new Date(this.registeredAt);
//   this.expiredAt =  new Date(date.setFullYear(date.getFullYear() + this.periods));

//   next()
// })

domainServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if (this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let DomainServices = mongoose.model("DomainServices", domainServicesSchema);
module.exports = DomainServices;
