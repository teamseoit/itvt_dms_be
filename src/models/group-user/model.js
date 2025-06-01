const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const groupUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
}, {timestamps: true});

let GroupUsers = mongoose.model("GroupUsers", groupUserSchema);
module.exports = GroupUsers;

const init = async () => {
  const count = await GroupUsers.estimatedDocumentCount();
  if (count == 0) {
    const array = [
      {
        _id: new ObjectId("6684196550a34692df218d8d"),
        name: 'Quản trị viên',
        description: 'Nhóm quản trị viên là nhóm có tất cả các chức năng để quản lý',
      },
    ];
    await GroupUsers.insertMany(array);
  }
}

init()