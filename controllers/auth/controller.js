const sha512 = require('js-sha512');
const Users = require('../../models/users/model');
const TokenModel = require('../../models/auth/token');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} = require('../../utils/jwt');

const hashPassword = (password) => sha512(password);

const buildPayload = (user) => ({
  _id: user._id,
  username: user.username,
  group_user_id: user.group_user_id
});

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username }).lean();

      if (!user || hashPassword(password) !== user.password) {
        return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
      }

      if (!user.group_user_id) {
        return res.status(403).json({ message: 'Tài khoản chưa được phân quyền!' });
      }

      const payload = buildPayload(user);
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await TokenModel.findOneAndUpdate(
        { user_id: user._id },
        { refresh_token: refreshToken },
        { upsert: true }
      );

      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        data: {
          token: accessToken,
          refresh_token: refreshToken,
          role: user.group_user_id,
          user_info: {
            _id: user._id,
            username: user.username,
            display_name: user.display_name,
            email: user.email
          }
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi đăng nhập.', error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json({ message: 'Không tìm thấy người dùng để đăng xuất.' });
      }

      const result = await TokenModel.deleteOne({ user_id: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Không tìm thấy refresh token trong DB để xóa.' });
      }

      return res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi đăng xuất.', error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(401).json({ message: 'Thiếu refresh token.' });
      }

      const tokenDoc = await TokenModel.findOne({ refresh_token });
      if (!tokenDoc) {
        return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn.' });
      }

      let payload;
      try {
        payload = verifyToken(refresh_token, process.env.JWT_REFRESH_SECRET);
      } catch (err) {
        return res.status(403).json({ message: 'Refresh token không hợp lệ.', error: err.message });
      }

      const newAccessToken = generateAccessToken({
        _id: payload._id,
        username: payload.username,
        group_user_id: payload.group_user_id
      });

      return res.status(200).json({ access_token: newAccessToken });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
  }
};

module.exports = authController;
