const mongoose = require("mongoose");

const ipWhitelistSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
}, {timestamps: true});

let IpWhitelists = mongoose.model("IpWhitelists", ipWhitelistSchema);
module.exports = IpWhitelists;

const init = async () =>{
  const count = await IpWhitelists.estimatedDocumentCount()
  if(count == 0){
    await new IpWhitelists({
      ip: "171.243.62.18"
    }).save()
  }
}
init()