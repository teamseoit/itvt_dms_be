const Roles = require('../../models/roles/model');
const {ObjectId} = require('mongoose').Types

const roleController = {
  getRoles: async(req, res) => {
    try {
      const roles = await Roles.find();
      return res.status(200).json({
        success: true,
        message: "Lấy danh sách vai trò thành công",
        data: roles
      });
    } catch(err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Lỗi khi lấy danh sách vai trò",
        error: err.message
      });
    }
  },
  getRolesByGroupUserId: async(req, res) => {
    try {
      const roles = await Roles.find({ group_user_id: req.params.group_user_id });
      return res.status(200).json(roles);
    } catch(err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
  }
}

module.exports = roleController;