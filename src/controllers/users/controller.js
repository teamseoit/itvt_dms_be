const jwt = require('jsonwebtoken');
const validator = require('validator');
const sha512 = require('js-sha512');

const Users = require("../../models/users/model");
const logAction = require("../../middleware/actionLogs");

const hashPassword = (password) => sha512(password);

const findExistingUser = async (username, email) => {
  return await Users.findOne({ $or: [{ username }, { email }] });
};

const userController = {
  getUser: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        Users.find()
          .sort({ createdAt: -1 })
          .populate('group_user_id', 'name')
          .skip(skip)
          .limit(limit),
        Users.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách tài khoản thành công.",
        data: users,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách tài khoản."
      });
    }
  },

  addUser: async (req, res) => {
    try {
      const { display_name, username, email, password, group_user_id } = req.body;

      const existingUser = await findExistingUser(username, email);
      if (existingUser) {
        const errorMessage = existingUser.username === username
          ? 'Tên đăng nhập đã tồn tại! Vui lòng nhập tên khác!'
          : 'Email đã tồn tại! Vui lòng nhập email khác!';
          
        return res.status(400).json({
          success: false,
          message: errorMessage
        });
      }

      const newUser = await Users.create({
        display_name,
        username,
        email,
        password: hashPassword(password),
        group_user_id
      });

      await logAction(req.auth._id, 'Tài khoản', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm tài khoản thành công.",
        data: newUser
      });

    } catch (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm tài khoản."
      });
    }
  },

  getDetailUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tài khoản."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết tài khoản thành công.",
        data: user
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết tài khoản."
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng để xóa."
        });
      }

      await logAction(req.auth._id, 'Tài khoản', 'Xóa');

      return res.status(200).json({
        success: true,
        message: "Xóa tài khoản thành công."
      });

    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa tài khoản."
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = await Users.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tài khoản để cập nhật."
        });
      }

      await logAction(
        req.auth._id,
        'Tài khoản',
        'Cập nhật',
        `/tai-khoan/cap-nhat/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật tài khoản thành công.",
        data: updatedUser
      });

    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật tài khoản."
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const user = await Users.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tài khoản."
        });
      }

      const updatedUser = await Users.findByIdAndUpdate(
        id,
        { password: hashPassword(password) },
        { new: true }
      );

      await logAction(
        req.auth._id,
        'Tài khoản',
        'Cập nhật mật khẩu',
        `/tai-khoan/cap-nhat/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật mật khẩu thành công.",
        data: updatedUser
      });

    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        success: false, 
        message: "Lỗi máy chủ khi cập nhật mật khẩu."
      });
    }
  }
};

module.exports = userController;
