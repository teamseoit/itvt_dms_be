const mongoose = require("mongoose");
const GroupUsers = require("../models/group-user/model");

const ObjectId = mongoose.Types.ObjectId;

const initDefaultGroupUsers = async () => {
  try {
    const count = await GroupUsers.estimatedDocumentCount();
    if (count === 0) {
      const data = [
        {
          _id: new ObjectId("6684196550a34692df218d8d"),
          name: "Quản trị viên",
          description: "Nhóm quản trị viên là nhóm có tất cả các chức năng để quản lý",
        },
      ];
      await GroupUsers.insertMany(data);
    }
  } catch (err) {
    console.error("Không thể khởi tạo nhóm người dùng:", err);
  }
};

module.exports = initDefaultGroupUsers;
