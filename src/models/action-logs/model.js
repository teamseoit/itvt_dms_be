const mongoose = require("mongoose");

const actionLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true 
  },
  object: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  link: {
    type: String,
  }
}, {timestamps: true});

let ActionLogs = mongoose.model("ActionLogs", actionLogSchema);
module.exports = ActionLogs;