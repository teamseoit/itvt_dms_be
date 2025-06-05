const Permissions = require('../models/permissions/model')
const jwt = require('jsonwebtoken');
const Token = require('../models/auth/token')
const Role = require('../models/roles/model')
const {ObjectId} = require('mongoose').Types

exports.check_role = (permission_id) =>{
  return async (req, res, next) =>{
    try{
      const auth = req.auth;
      const count = await Role.countDocuments({
        $and:[
          {permission_id: new ObjectId(permission_id)},
          {group_user_id: new ObjectId(auth._id)}
        ]
      })

      if (count == 0) throw new Error(`Bạn không có quyền!`)
      return next();
    }
    catch(error){
      return res.status(401).send(error.message);
    }
  }
}
