const Joi = require("joi");
const GroupUsers = require("../../models/group-user/model");
const Users = require("../../models/users/model");
const logAction = require("../../middleware/actionLogs");

const groupUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Tên nhóm không được để trống.',
    'string.min': 'Tên nhóm phải có ít nhất 3 ký tự.',
    'any.required': 'Vui lòng nhập tên nhóm quyền.'
  })
});

const groupUserController = {
  getGroupUser: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [groupUsers, total] = await Promise.all([
        GroupUsers.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        GroupUsers.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách nhóm quyền thành công.",
        data: groupUsers,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch (error) {
      console.error("Error fetching group users:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách nhóm quyền."
      });
    }
  },

  addGroupUser: async (req, res) => {
    try {
      const { error } = groupUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const { name } = req.body;

      const exists = await GroupUsers.findOne({ name });
      if (exists) {
        return res.status(400).json({ success: false, message: "Tên nhóm quyền đã tồn tại!" });
      }

      const newGroupUser = new GroupUsers({ name });
      const saved = await newGroupUser.save();

      await logAction(req.auth._id, 'Nhóm quyền', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm nhóm quyền thành công.",
        data: saved
      });
    } catch (error) {
      console.error("Error adding group user:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm nhóm quyền."
      });
    }
  },

  getDetailGroupUser: async (req, res) => {
    try {
      const { id } = req.params;
      const groupUser = await GroupUsers.findById(id);

      if (!groupUser) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nhóm quyền." });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết nhóm quyền thành công.",
        data: groupUser
      });
    } catch (error) {
      console.error("Error getting group user details:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết nhóm quyền."
      });
    }
  },

  updateGroupUser: async (req, res) => {
    try {
      const { error } = groupUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const { id } = req.params;

      const updated = await GroupUsers.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nhóm quyền để cập nhật." });
      }

      await logAction(req.auth._id, 'Nhóm người dùng', 'Cập nhật', `/tai-khoan/cap-nhat-tai-khoan/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật nhóm quyền thành công.",
        data: updated
      });
    } catch (error) {
      console.error("Error updating group user:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật nhóm quyền."
      });
    }
  },

  deleteGroupUser: async (req, res) => {
    try {
      const { id } = req.params;

      const isGroupInUse = await Users.findOne({ group_user_id: id });
      if (isGroupInUse) {
        return res.status(400).json({
          success: false,
          message: "Không thể xóa nhóm quyền khi đang được sử dụng!"
        });
      }

      const deletedGroup = await GroupUsers.findByIdAndDelete(id);
      if (!deletedGroup) {
        return res.status(404).json({
          success: false, 
          message: "Không tìm thấy nhóm quyền để xóa."
        });
      }

      await logAction(req.auth._id, 'Nhóm quyền', 'Xóa');

      return res.status(200).json({
        success: true,
        message: "Xóa nhóm quyền thành công.",
        data: deletedGroup
      });
    } catch (error) {
      console.error("Error deleting group user:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa nhóm quyền."
      });
    }
  }
};

module.exports = groupUserController;
