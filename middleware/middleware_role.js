const ModelFunction = require('../models/functions/functions')
const jwt = require('jsonwebtoken');
const ModelToken = require('../models/users/token')
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

exports.check_token_api = async (req, res, next) => {
  try {
    const token = req.headers?.token || req.cookies?.token;
    if(!token) return res.status(403).send(`Phiên đăng nhập hết hạn!`)

    const count = await ModelToken.countDocuments({token:token});
    if(count == 0) return res.status(403).send(`Phiên đăng nhập hết hạn!`)

    const data = jwt.verify(token, process.env.JWT_SECRET);
    if(!data) return res.status(403).send(`Phiên đăng nhập hết hạn!`)
    
    req.auth = data;
    return next();
  } catch (error) {
    console.error(error);
  }
}