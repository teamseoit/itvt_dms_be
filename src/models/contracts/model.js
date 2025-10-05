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
        enum: ['domain', 'hosting', 'ssl', 'email', 'website'],
        required: true
      },
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'services.serviceModel'
      },
      serviceModel: {
        type: String,
        enum: ['DomainServices', 'HostingServices', 'SslServices', 'EmailServices', 'WebsiteServices']
      },
      price: {
        type: Number,
        default: 0
      }
    }],
    financials: {
      totalAmount: {
        type: Number,
        default: 0
      },
      amountPaid: {
        type: Number,
        default: 0
      },
      amountRemaining: {
        type: Number,
        default: 0
      },
      isFullyPaid: {
        type: Boolean,
        default: false
      }
    },
    note: { type: String },
    createdBy: { type: String }
  },
  { timestamps: true }
);

contractSchema.pre('save', async function(next) {
  if (!this.contractCode || this.contractCode === null) {
    let contractCode;
    let isUnique = false;
    
    // Tạo contractCode duy nhất
    while (!isUnique) {
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      contractCode = `HD_${random}`;
      
      // Kiểm tra xem contractCode đã tồn tại chưa
      const existingContract = await this.constructor.findOne({ contractCode });
      if (!existingContract) {
        isUnique = true;
      }
    }
    
    this.contractCode = contractCode;
  }
  next();
});

contractSchema.statics.create_or_update_contract = async function(customerId) {
  try {
    let contract = await this.findOne({ customer: customerId });
    
    if (!contract) {
      contract = new this({
        customer: customerId,
        services: [],
        financials: {
          totalAmount: 0,
          amountPaid: 0,
          amountRemaining: 0,
          isFullyPaid: false
        }
      });
    }

    const services = await this.getCustomerServices(customerId);
    
    // Tính tổng tiền từ tất cả services
    const totalAmount = services.reduce((sum, service) => sum + (service.price || 0), 0);
    
    contract.services = services;
    contract.financials.totalAmount = totalAmount;
    contract.financials.amountRemaining = totalAmount - contract.financials.amountPaid;
    contract.financials.isFullyPaid = contract.financials.amountPaid >= totalAmount;
    
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
  const HostingServices = require('../services/hosting/model');
  const SslServices = require('../services/ssl/model');
  const EmailServices = require('../services/email/model');
  const WebsiteServices = require('../services/website/model');

  const domainServices = await DomainServices.find({ customerId: customerId });
  const hostingServices = await HostingServices.find({ customerId: customerId });
  const sslServices = await SslServices.find({ customerId: customerId });
  const emailServices = await EmailServices.find({ customerId: customerId });
  const websiteServices = await WebsiteServices.find({ customerId: customerId });

  domainServices.forEach(service => {
    services.push({
      serviceType: 'domain',
      serviceId: service._id,
      serviceModel: 'DomainServices',
      price: service.totalPrice || 0
    });
  });

  hostingServices.forEach(service => {
    services.push({
      serviceType: 'hosting',
      serviceId: service._id,
      serviceModel: 'HostingServices',
      price: service.totalPrice || 0
    });
  });

  sslServices.forEach(service => {
    services.push({
      serviceType: 'ssl',
      serviceId: service._id,
      serviceModel: 'SslServices',
      price: service.totalPrice || 0
    });
  });

  emailServices.forEach(service => {
    services.push({
      serviceType: 'email',
      serviceId: service._id,
      serviceModel: 'EmailServices',
      price: service.totalPrice || 0
    });
  });

  websiteServices.forEach(service => {
    services.push({
      serviceType: 'website',
      serviceId: service._id,
      serviceModel: 'WebsiteServices',
      price: service.price || 0
    });
  });

  return services;
};

contractSchema.statics.recalculateFinancials = async function(customerId) {
  try {
    const contract = await this.findOne({ customer: customerId });
    if (!contract) {
      // Nếu chưa có contract, tạo mới
      return await this.create_or_update_contract(customerId);
    }

    const services = await this.getCustomerServices(customerId);
    const totalAmount = services.reduce((sum, service) => sum + (service.price || 0), 0);
    
    contract.services = services;
    contract.financials.totalAmount = totalAmount;
    contract.financials.amountRemaining = totalAmount - contract.financials.amountPaid;
    contract.financials.isFullyPaid = contract.financials.amountPaid >= totalAmount;
    
    await contract.save();
    return contract;
  } catch (error) {
    console.error('Error recalculating financials:', error);
    throw error;
  }
};

module.exports = mongoose.model("Contracts", contractSchema);
