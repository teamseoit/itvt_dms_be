const jwt = require('jsonwebtoken');
const validator = require('validator');
const sha512 = require('js-sha512');

const Users = require("../../models/users/model");
const logAction = require("../../middleware/actionLogs");
const { addUserSchema } = require('../../validators/userValidator');

const hashPassword = (password) => sha512(password);

const findExistingUser = async (username, email) => {
  return await Users.findOne({ $or: [{ username }, { email }] });
};

const userController = {
  addUser: async (req, res) => {
    try {
      const { error, value } = addUserSchema.validate(req.body, { abortEarly: false });

      if (error) {
        const messages = error.details.map(err => err.message);
        return res.status(400).json({ message: messages.join(' ') });
      }

      const { display_name, username, email, password, group_user_id } = value;

      const existingUser = await findExistingUser(username, email);
      if (existingUser) {
        const errorMessage =
          existingUser.username === username
            ? 'Tên đăng nhập đã tồn tại! Vui lòng nhập tên khác!'
            : 'Email đã tồn tại! Vui lòng nhập email khác!';
        return res.status(400).json({ message: errorMessage });
      }

      const newUser = await Users.create({
        display_name,
        username,
        email,
        password: hashPassword(password),
        group_user_id
      });

      await logAction(req.auth._id, 'Tài khoản', 'Thêm mới');
      return res.status(200).json(newUser);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const users = await Users.find().sort({ createdAt: -1 }).populate('group_user_id', 'name');
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  },

  getDetailUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await Users.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });

      await logAction(req.auth._id, 'Tài khoản', 'Xóa');
      return res.status(200).json({ message: 'Xóa thành công!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      await user.updateOne({ $set: req.body });
      await logAction(req.auth._id, 'Tài khoản', 'Cập nhật', `/trang-chu/tai-khoan/cap-nhat-tai-khoan/${req.params.id}`);

      return res.status(200).json({ message: 'Cập nhật thành công!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      const newPassword = req.body.password;
      await user.updateOne({ password: hashPassword(newPassword) });

      await logAction(req.auth._id, 'Tài khoản', 'Cập nhật mật khẩu', `/trang-chu/tai-khoan/cap-nhat-tai-khoan/${req.params.id}`);
      return res.status(200).json({ message: 'Cập nhật mật khẩu thành công!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
};

module.exports = userController;
