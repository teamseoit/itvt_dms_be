const jwt = require('jsonwebtoken');
const sha512 = require('js-sha512');

const Users = require("../../models/users/model");
const ModelToken = require('../../models/users/token');

const loginController = {
  login: async(req, res) => {
    try {
      const {username, password} = req.body;
      const validUser = await Users.findOne({username}).lean();
      if (!validUser) {
        return res.status(400).json({message: 'Tài khoản không tồn tại! Vui lòng nhập lại thông tin!'});
      }

      const hashedPassword = sha512(password);
      if (hashedPassword !== validUser.password) {
        return res.status(400).json({ message: 'Mật khẩu không đúng! Vui lòng nhập lại thông tin!' });
      }

      if (!validUser.group_user_id) {
        return res.status(400).json({ message: 'Tài khoản của bạn chưa được phân quyền! Vui lòng đăng nhập lại sau!' });
      }

      const token = jwt.sign({ ...validUser }, process.env.JWT_SECRET);
      await new ModelToken({
        user_id: validUser._id,
        token: token
      }).save();

      return res.json({
        token: token,
        display_name: validUser.display_name,
        group_user_id: validUser.group_user_id
      });
    } catch(error) {
      console.error(error);
      return res.status(400).send(error.message);
    }
  },

  logout: async (req, res) => {
    try {
      res.cookie('access_token', '', { httpOnly: true, expires: new Date(0) });  
      return res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
}

module.exports = loginController;