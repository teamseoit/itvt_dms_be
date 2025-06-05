const sha512 = require('js-sha512');
const Users = require('../../models/users/model');
const TokenModel = require('../../models/auth/token');
const OtpCode = require('../../models/auth/otpCode');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} = require('../../utils/jwt');
const sendEmail = require('../../utils/sendEmail');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
      const user = await Users.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    }).lean();

      if (!user || hashPassword(password) !== user.password) {
        return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
      }

      if (!user.group_user_id) {
        return res.status(403).json({ message: 'Tài khoản chưa được phân quyền!' });
      }

      const otp = generateOTP();
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

      await OtpCode.findOneAndUpdate(
        { user_id: user._id },
        { otp, expiredAt },
        { upsert: true }
      );

      await sendEmail(
        user.email,
        'Mã OTP xác thực đăng nhập',
        `<p>Chào ${user.display_name || user.username},</p>
        <p>Mã OTP của bạn là: <b>${otp}</b></p>
        <p>Mã có hiệu lực trong 5 phút.</p>`
      );

      return res.status(200).json({
        message: 'OTP đã được gửi đến email. Vui lòng xác minh.',
        user_id: user._id
      });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi gửi OTP.', error: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { user_id, otp } = req.body;

      const record = await OtpCode.findOne({ user_id });

      if (!record) {
        return res.status(404).json({ message: 'Không tìm thấy mã OTP.' });
      }

      if (record.retryCount >= 3) {
        await OtpCode.deleteOne({ user_id });
        return res.status(403).json({ message: 'Bạn đã nhập sai OTP quá 3 lần. Vui lòng yêu cầu gửi lại OTP.' });
      }

      if (new Date() > record.expiredAt) {
        return res.status(410).json({ message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại OTP.' });
      }

      if (record.otp !== otp) {
        record.retryCount += 1;
        await record.save();
        return res.status(400).json({ message: `Mã OTP không đúng. Bạn còn ${3 - record.retryCount} lần thử.` });
      }

      const user = await Users.findById(user_id).lean();
      const payload = buildPayload(user);
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await TokenModel.findOneAndUpdate(
        { user_id },
        { refresh_token: refreshToken },
        { upsert: true }
      );

      await OtpCode.deleteOne({ user_id });

      return res.status(200).json({
        message: 'Xác minh OTP thành công!',
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
      return res.status(500).json({ message: 'Lỗi xác minh OTP.', error: error.message });
    }
  },

  resendOtp: async (req, res) => {
    try {
      const { user_id } = req.body;
      const user = await Users.findById(user_id).lean();

      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }

      const otp = generateOTP();
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

      await OtpCode.findOneAndUpdate(
        { user_id },
        { otp, expiredAt, retryCount: 0 },
        { upsert: true }
      );

      await sendEmail(
        user.email,
        'Mã OTP mới xác thực đăng nhập',
        `<p>Chào ${user.display_name || user.username},</p>
        <p>Mã OTP của bạn là: <b>${otp}</b></p>
        <p>Mã có hiệu lực trong 5 phút.</p>`
      );

      return res.status(200).json({ message: 'OTP mới đã được gửi đến email của bạn.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi gửi lại OTP.', error: error.message });
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
