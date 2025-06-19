const mongoose = require("mongoose");

const ipWhitelistSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true
  }
}, {timestamps: true});

let IpWhitelists = mongoose.model("IpWhitelists", ipWhitelistSchema);
module.exports = IpWhitelists;

const init = async () =>{
  const count = await IpWhitelists.estimatedDocumentCount()
  if (count == 0) {
    const Users = require("../users/model");
    const adminUser = await Users.findOne({ username: "itvt" });
    
    if (adminUser) {
      await new IpWhitelists({
        ip: "171.243.62.18",
        createdBy: adminUser._id
      }).save();
      await new IpWhitelists({
        ip: "171.243.63.94",
        createdBy: adminUser._id
      }).save();
    }
  }
}
init()