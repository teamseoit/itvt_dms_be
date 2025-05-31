const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token xác thực.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.auth = decoded;
    next();
  } catch (err) {
    console.error('Access Token lỗi:', err.message);
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = verifyAccessToken;
