const GroupUsers = require("../../models/group-user/model");
const Users = require("../../models/users/model");
const logAction = require("../../middleware/actionLogs");

const groupUserController = {
  getGroupUser: async (req, res) => {
    try {
      const groupUsers = await GroupUsers.find().sort({ createdAt: -1 });
      res.status(200).json(groupUsers);
    } catch (err) {
      console.error("Error fetching group users:", err);
      res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách nhóm người dùng." });
    }
  },

  addGroupUser: async (req, res) => {
    try {
      const { name } = req.body;
      const existing = await GroupUsers.findOne({ name });

      if (existing) {
        return res.status(400).json({ message: "Tên nhóm người dùng đã tồn tại! Vui lòng nhập tên khác!" });
      }

      const newGroupUser = new GroupUsers({ name });
      const savedGroupUser = await newGroupUser.save();

      await logAction(req.auth._id, 'Nhóm người dùng', 'Thêm mới');
      res.status(201).json(savedGroupUser);
    } catch (err) {
      console.error("Error adding group user:", err);
      res.status(500).json({ message: "Lỗi máy chủ khi thêm nhóm người dùng." });
    }
  },

  getDetailGroupUser: async (req, res) => {
    try {
      const groupUser = await GroupUsers.findById(req.params.id);

      if (!groupUser) {
        return res.status(404).json({ message: "Không tìm thấy nhóm người dùng." });
      }

      res.status(200).json(groupUser);
    } catch (err) {
      console.error("Error getting group user details:", err);
      res.status(500).json({ message: "Lỗi máy chủ khi lấy chi tiết nhóm người dùng." });
    }
  },

  updateGroupUser: async (req, res) => {
    try {
      const updated = await GroupUsers.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy nhóm người dùng để cập nhật." });
      }

      await logAction(req.auth._id, 'Nhóm người dùng', 'Cập nhật', `/trang-chu/tai-khoan/cap-nhat-tai-khoan/${req.params.id}`);
      res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating group user:", err);
      res.status(500).json({ message: "Lỗi máy chủ khi cập nhật nhóm người dùng." });
    }
  },

  deleteGroupUser: async (req, res) => {
    try {
      const groupUserId = req.params.id;

      const userExists = await Users.findOne({ group_user_id: groupUserId });
      if (userExists) {
        return res.status(400).json({ message: "Không thể xóa nhóm người dùng khi đang được sử dụng!" });
      }

      const deleted = await GroupUsers.findByIdAndDelete(groupUserId);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy nhóm người dùng để xóa." });
      }

      await logAction(req.auth._id, 'Nhóm người dùng', 'Xóa');
      res.status(204).send(); // No content
    } catch (err) {
      console.error("Error deleting group user:", err);
      res.status(500).json({ message: "Lỗi máy chủ khi xóa nhóm người dùng." });
    }
  },
};

module.exports = groupUserController;
