const jwt = require('jsonwebtoken');
const sha512 = require('js-sha512');
const Users = require('../../models/users/model');
const TokenModel = require('../../models/users/token');

const generateAccessToken = ({ _id, username, group_user_id }) => {
  return jwt.sign(
    { _id, username, group_user_id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const hashPassword = (password) => sha512(password);

const loginController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await Users.findOne({ username }).lean();
      if (!user) {
        return res.status(400).json({ message: 'Tài khoản không tồn tại! Vui lòng nhập lại thông tin!' });
      }

      if (hashPassword(password) !== user.password) {
        return res.status(400).json({ message: 'Mật khẩu không đúng! Vui lòng nhập lại thông tin!' });
      }

      if (!user.group_user_id) {
        return res.status(403).json({ message: 'Tài khoản của bạn chưa được phân quyền! Vui lòng đăng nhập lại sau!' });
      }

      const accessToken = generateAccessToken(user);

      await TokenModel.create({
        user_id: user._id,
        token: accessToken,
      });

      res.setHeader('Authorization', `Bearer ${accessToken}`);

      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        data: {
          role: user.group_user_id,
          user_info: {
            _id: user._id,
            username: user.username,
            display_name: user.display_name,
            email: user.email,
          },
          token: accessToken,
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.', error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1]?.trim();

      if (!token) {
        return res.status(400).json({ message: 'Không tìm thấy token để đăng xuất.' });
      }

      const result = await TokenModel.deleteOne({ token });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Token không tồn tại hoặc đã bị xoá.' });
      }

      return res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (error) {
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng xuất.', error: error.message });
    }
  }
};

module.exports = loginController;