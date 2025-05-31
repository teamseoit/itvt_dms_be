const jwt = require('jsonwebtoken');
const validator = require('validator');

const Users = require("../../models/users/model");
const sha512 = require('js-sha512');
const logAction = require("../../middleware/action_logs");

const userController = {
  addUser: async(req, res) => {
    try {
      const {display_name, username, email, password, group_user_id} = req.body;

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email không hợp lệ! Vui lòng nhập email đúng định dạng!' });
      }

      const existingUser = await Users.findOne({ $or: [{username}, {email}] });
      if (existingUser) {
        let errorMessage = '';
        if (existingUser.username === username) {
          errorMessage = 'Tên đăng nhập đã tồn tại! Vui lòng nhập tên khác!';
        } else if (existingUser.email === email) {
          errorMessage = 'Email đã tồn tại! Vui lòng nhập email khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const hashedPassword = sha512(password);
      const newUser = await Users({display_name, username, email, password: hashedPassword, group_user_id });
      const saveUser = await newUser.save();
      await logAction(req.auth._id, 'Tài khoản', 'Thêm mới');
      return res.status(200).json(saveUser);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getUser: async(req, res) => {
    try {
      const users = await Users.find().sort({"createdAt": -1}).populate('group_user_id', 'name');
      return res.status(200).json(users);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailUser: async(req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      return res.status(200).json(user);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteUser: async(req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Tài khoản', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateUser: async(req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      await user.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Tài khoản', 'Cập nhật', `/trang-chu/tai-khoan/cap-nhat-tai-khoan/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  changePassword: async(req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      const newPassword = req.body.password;
      const hashedNewPassword = sha512(newPassword);
      await user.updateOne({password: hashedNewPassword});
      await logAction(req.auth._id, 'Tài khoản', 'Cập nhật mật khẩu', `/trang-chu/tai-khoan/cap-nhat-tai-khoan/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = userController;