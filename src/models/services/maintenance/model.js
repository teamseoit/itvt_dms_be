const mongoose = require("mongoose");

const maintenanceServicesSchema = new mongoose.Schema({
  service_type: {
    type: Number,
  },
  domain_service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainServices"
  },
  maintenance_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MaintenancePlans"
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
  domain_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainPlans"
  },
  domain_supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suppliers"
  },
}, {timestamps: true});

maintenanceServicesSchema.post(['save','updateOne','create'], async function (next) {
  const ModelContract = require('../../contracts/model');
  if (this.customer_id) {
    ModelContract.create_or_update_contract(this.customer_id);
  } else if (this['$set']?.customer_id) {
    ModelContract.create_or_update_contract(this['$set']?.customer_id);
  }
});

let MaintenanceServices = mongoose.model("MaintenanceServices", maintenanceServicesSchema);
module.exports = MaintenanceServices;