const Permissions = require('../../models/permissions/model');

const permissionController = {
  getPermission: async(req, res) => {
    try {
      const permissions = await Permissions.find();
      return res.status(200).json(permissions);
    } catch(err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
  }
}

module.exports = permissionController;