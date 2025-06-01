const path = require('path');
const multer = require('multer');
const fs = require('fs');

const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const uploadDir = path.join('uploads', `${now.getFullYear()}`, `${now.getMonth() + 1}`.padStart(2, '0'));
    createDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB
});

module.exports = upload;
