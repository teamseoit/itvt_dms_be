const Permissions = require('../models/permissions/model')
const jwt = require('jsonwebtoken');
const Token = require('../models/auth/token')
const Role = require('../models/roles/model')
const {ObjectId} = require('mongoose').Types

exports.check_role = (permission_id) =>{
  return async (req, res, next) =>{
    try{
      const auth = req.auth;
      
      if (req.method === 'DELETE') {
        const usageCount = await Role.countDocuments({
          permission_id: new ObjectId(permission_id)
        });
        
        if (usageCount > 0) {
          return res.status(400).json({
            message: "Không thể xóa quyền này vì đang được sử dụng!"
          });
        }
      }

      const hasPermission = await Role.countDocuments({
        $and:[
          {permission_id: new ObjectId(permission_id)},
          {group_user_id: new ObjectId(auth._id)}
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
