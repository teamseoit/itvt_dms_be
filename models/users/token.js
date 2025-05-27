const mongoose = require("mongoose");
const sha512  = require("js-sha512");
const ObjectId = mongoose.Types.ObjectId
const userchema = new mongoose.Schema({
  user_id:{
    type: ObjectId,
    require: true
  },
  token:{
    type: String,
    require: true
  }
}, {timestamps:true});

const ModelToken = mongoose.model("Token", userchema);
module.exports = ModelToken
