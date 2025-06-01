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
    type: String
  },
}, {timestamps: true});

module.exports = mongoose.model('Backups', backupsSchema);