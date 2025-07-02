const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contracts',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    default: 'Chuyển khoản'
  },
  note: {
    type: String
  },
  createdBy: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('ContractPaymentHistory', paymentHistorySchema); 