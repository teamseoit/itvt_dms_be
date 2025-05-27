const mongoose = require("mongoose");
const sha512  = require("js-sha512");

const userchema = new mongoose.Schema({
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
}, {timestamps: true});

const Users = mongoose.model("Users", userchema);
module.exports = Users;

const init = async () =>{
  const count = await Users.estimatedDocumentCount()
  if(count == 0){
    await new Users({
      display_name: "IT Vũng Tàu",
      username: "itvt",
      password: sha512('itvt!@#$%vt533'),
      email: "teamseoit@gmail.com",
      group_user_id: "6684196550a34692df218d8d"
    }).save()
  }
}
init()