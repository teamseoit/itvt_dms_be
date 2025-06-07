const Permissions = require('../models/permissions/model')
const jwt = require('jsonwebtoken');
const Token = require('../models/auth/token')
const Role = require('../models/roles/model')
const User = require('../models/users/model')
const {ObjectId} = require('mongoose').Types

exports.check_role = (permission_id) =>{
  return async (req, res, next) =>{
    try{
      const auth = req.auth;
      
      const user = await User.findById(auth._id);
      if (!user) {
        return res.status(401).json({
          message: "Không tìm thấy thông tin người dùng!"
        });
      }

      const hasPermission = await Role.countDocuments({
        $and:[
          {permission_id: new ObjectId(permission_id)},
          {group_user_id: new ObjectId(user.group_user_id)}
        ]
      })

      if (hasPermission === 0) {
        return res.status(401).json({
          message: "Bạn không có quyền!"
        });
      }
      
      return next();
    }
    catch(error){
      return res.status(401).send(error.message);
    }
  }
}
