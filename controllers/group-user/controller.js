const GroupUsers = require("../../models/group-user/model");
const Users = require("../../models/users/model");
const logAction = require("../../middleware/action_logs");

const groupUserController = {
  getGroupUser: async(req, res) => {
    try {
      const groupUser = await GroupUsers.find().sort({"createdAt": -1});
      return res.status(200).json(groupUser);
    } catch(err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  addGroupUser: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await GroupUsers.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên nhóm người dùng đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newGroupUser = new GroupUsers(req.body);
      const saveGroupUser = await newGroupUser.save();
      await logAction(req.auth._id, 'Nhóm người dùng', 'Thêm mới');
      return res.status(200).json(saveGroupUser);
    } catch(err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  getDetailGroupUser: async(req, res) => {
    try {
      const groupUser = await GroupUsers.findById(req.params.id);
      return res.status(200).json(groupUser);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateGroupUser: async(req, res) => {
    try {
      const groupUser = await GroupUsers.findById(req.params.id);
      await groupUser.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Nhóm người dùng', 'Cập nhật', `/trang-chu/tai-khoan/cap-nhat-tai-khoan/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteGroupUser: async(req, res) => {
    try {
      const groupUserId = req.params.id;
      const userExists = await Users.findOne({ group_user_id: groupUserId });
      if (userExists) {
        return res.status(400).json({ message: "Không thể xóa nhóm người dùng khi đang được sử dụng!" });
      }

      await GroupUsers.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Nhóm người dùng', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
}

module.exports = groupUserController;