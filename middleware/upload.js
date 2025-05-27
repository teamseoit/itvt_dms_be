const path = require('path');
const multer = require("multer");
const fs = require('fs');

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const uploadDir = path.join('uploads', year.toString(), month);

    createDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      console.log('Chỉ hỗ trợ png, jpg, jpeg!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 4 // 4 MB
  }
});

module.exports = upload;