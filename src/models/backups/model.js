const mongoose = require('mongoose');

const backupsSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  description: {
    type: String,
    default: 'Backup tự động'
  }
}, {timestamps: true});

module.exports = mongoose.model('Backups', backupsSchema);