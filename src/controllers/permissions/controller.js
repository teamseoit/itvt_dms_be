const Permissions = require('../../models/permissions/model');

const permissionController = {
  getPermission: async(req, res) => {
    try {
      const permissions = await Permissions.find();
      return res.status(200).json({
        success: true,
        message: "Lấy danh sách quyền thành công",
        data: permissions
      });
    } catch(err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        data: null
      });
    }
  }
}

module.exports = permissionController;