const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true, 
    index: true,
    trim: true
  },
  email: { 
    type: String, 
    index: true,
    lowercase: true,
    trim: true
  },
  gender: { 
    type: Number, 
    required: true,
    enum: [0, 1, 2]
  },
  identityNumber: { 
    type: Number, 
    required: true,
    unique: true
  },
  phoneNumber: { 
    type: Number, 
    required: true, 
    index: true,
    unique: true
  },
  address: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  taxCode: {
    type: String,
    trim: true
  },
  companyAddress: {
    type: String,
    trim: true
  },
  representativeName: {
    type: String,
    trim: true
  },
  representativePhone: {
    type: String,
    trim: true
  },
  vatEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  identityCardFrontImage: {
    type: String,
    trim: true
  },
  identityCardBackImage: {
    type: String,
    trim: true
  },
  typeCustomer: { 
    type: Boolean, 
    default: false,
    index: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

customerSchema.index({ fullName: 'text', email: 'text' });

customerSchema.virtual('services', {
  ref: 'DomainServices',
  localField: '_id', 
  foreignField: 'customerId',
  justOne: false
});

module.exports = mongoose.model("Customers", customerSchema);
