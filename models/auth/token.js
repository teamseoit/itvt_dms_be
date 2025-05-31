const mongoose = require("mongoose");
const sha512  = require("js-sha512");
const ObjectId = mongoose.Types.ObjectId
const tokenSchema = new mongoose.Schema({
  user_id:{
    type: ObjectId,
    require: true
  },
  refresh_token:{
    type: String,
    require: true
  }
}, {timestamps:true});

const ModelToken = mongoose.model("Token", tokenSchema);
module.exports = ModelToken
