const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  display_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  group_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "GroupUsers",
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Users", userSchema);
