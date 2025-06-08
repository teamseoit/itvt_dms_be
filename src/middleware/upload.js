const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');

const ALLOWED_MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const getUploadDir = () => {
  const now = new Date();
  return path.join(
    'uploads',
    now.getFullYear().toString(),
    (now.getMonth() + 1).toString().padStart(2, '0')
  );
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = getUploadDir();
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, ALLOWED_MIMETYPES.includes(file.mimetype));
  },
  limits: { fileSize: MAX_FILE_SIZE }
});

module.exports = upload;
