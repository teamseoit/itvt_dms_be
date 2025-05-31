const ModelFunction = require('../models/functions/functions')
const jwt = require('jsonwebtoken');
const ModelToken = require('../models/auth/token')
const ModelRole = require('../models/functions/roles')
const {ObjectId} = require('mongoose').Types

exports.check_role = (function_id) =>{
  return async (req, res, next) =>{
    try{
      const auth = req.auth;
      const count = await ModelRole.countDocuments({
        $and:[
          {function_id: new ObjectId(function_id)},
          {user_id: new ObjectId(auth._id)}
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
