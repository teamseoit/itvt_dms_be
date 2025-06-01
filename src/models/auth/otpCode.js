const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
  otp: { type: String, required: true },
  expiredAt: { type: Date, required: true },
  retryCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('OtpCode', otpCodeSchema);
