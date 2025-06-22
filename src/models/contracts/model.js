const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    contractCode: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },
    services: [{
      serviceType: {
        type: String,
        enum: ['domain'],
        required: true
      },
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'services.serviceModel'
      },
      serviceModel: {
        type: String,
        enum: ['DomainServices']
      }
    }],
    note: { type: String },
    createdBy: { type: String }
  },
  { timestamps: true }
);

contractSchema.pre('save', function(next) {
  if (!this.contractCode) {
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.contractCode = `HD_${random}`;
  }
  next();
});

contractSchema.statics.create_or_update_contract = async function(customerId) {
  try {
    let contract = await this.findOne({ customer: customerId });
    
    if (!contract) {
      contract = new this({
        customer: customerId,
        services: []
      });
    }

    const services = await this.getCustomerServices(customerId);
    
    contract.services = services;
    
    await contract.save();
    return contract;
  } catch (error) {
    console.error('Error creating/updating contract:', error);
    throw error;
  }
};

contractSchema.statics.getCustomerServices = async function(customerId) {
  const services = [];
  
  const DomainServices = require('../services/domain/model');

  const domainServices = await DomainServices.find({ customerId: customerId }).populate('domainPlanId');
  domainServices.forEach(service => {
    let price = 0;
    if (service.domainPlanId && service.domainPlanId.totalPrice) {
      price = service.domainPlanId.totalPrice;
    }
    services.push({
      serviceType: 'domain',
      serviceId: service._id,
      serviceModel: 'DomainServices',
      price: price
    });
  });
  return services;
};

module.exports = mongoose.model("Contracts", contractSchema);
