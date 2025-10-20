const Backups = require('../../models/backups/model');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { MONGO_URL } = require('../../config/env');
const logAction = require('../../middleware/actionLogs');

const backupsController = {
  // Tạo backup mới (đồng bộ - không chạy nền)
  createBackup: async(req, res) => {
    try {
      // Tạo thư mục backup nếu chưa có
      const backupDir = path.join('backups');
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

      // Kiểm tra tồn tại mongodump
      const mongodumpPath = 'D:\\mongodb\\bin\\mongodump.exe';
      if (!fs.existsSync(mongodumpPath)) {
        return res.status(400).json({
          success: false,
          message: 'Không tìm thấy mongodump. Vui lòng cài MongoDB Tools hoặc cấu hình đường dẫn mongodump.'
        });
      }

      // Xác định URI DB
      const mongoUri = MONGO_URL || 'mongodb://localhost:27017/local_data_dms_test';

      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backup-${dateStr}.gz`;
      const fullPath = path.join(backupDir, fileName);

      const cmd = `${mongodumpPath} --uri="${mongoUri}" --archive="${fullPath}" --gzip`;

      exec(cmd, async (error, stdout, stderr) => {
        if (error) {
          console.error('Lỗi backup:', stderr || error.message);
          return res.status(500).json({
            success: false,
            message: 'Tạo backup thất bại. Vui lòng kiểm tra cấu hình MongoDB/mongodump.'
          });
        }

        try {
          const stats = fs.statSync(fullPath);
          const fileSize = stats.size;

          const backupEntry = await Backups.create({
            fileName,
            filePath: fullPath,
            fileSize,
            createdBy: req.auth._id,
            status: 'completed',
            description: req.body.description || 'Backup tự động'
          });

          await logAction(req.auth._id, 'Backup', 'Tạo mới');

          return res.status(201).json({
            success: true,
            message: 'Tạo backup thành công!',
            data: backupEntry
          });
        } catch (saveErr) {
          console.error('Lỗi lưu thông tin backup:', saveErr);
          return res.status(500).json({
            success: false,
            message: 'Đã tạo file backup nhưng lưu cơ sở dữ liệu thất bại.'
          });
        }
      });
    } catch(err) {
      console.error('Error creating backup:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi máy chủ khi tạo backup!' 
      });
    }
  },

  // Lấy danh sách backup có phân trang
  getBackups: async(req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [backups, total] = await Promise.all([
        Backups.find()
          .sort({ createdAt: -1 })
          .populate('createdBy', 'display_name username')
          .skip(skip)
          .limit(limit),
        Backups.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách backup thành công.",
        data: backups,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch(err) {
      console.error('Error fetching backups:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi máy chủ khi lấy danh sách backup!' 
      });
    }
  },

  // Tải file backup
  downloadBackup: async(req, res) => {
    try {
      const { id } = req.params;
      const backup = await Backups.findById(id);
      
      if (!backup) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy file backup!'
        });
      }

      // Kiểm tra file có tồn tại không
      if (!fs.existsSync(backup.filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File backup không tồn tại trên server!'
        });
      }

      await logAction(req.auth._id, 'Backup', 'Tải xuống', `/backups/download/${id}`);
      res.download(backup.filePath, backup.fileName);
    } catch(err) {
      console.error('Error downloading backup:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi máy chủ khi tải file backup!' 
      });
    }
  },

  // Xóa backup
  deleteBackup: async(req, res) => {
    try {
      const { id } = req.params;
      const backup = await Backups.findById(id);
      
      if (!backup) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy backup để xóa!'
        });
      }

      // Xóa file vật lý nếu tồn tại
      if (fs.existsSync(backup.filePath)) {
        fs.unlinkSync(backup.filePath);
      }

      await Backups.findByIdAndDelete(id);
      await logAction(req.auth._id, 'Backup', 'Xóa', `/backups/${id}`);

      return res.status(200).json({
        success: true,
        message: 'Xóa backup thành công!'
      });
    } catch(err) {
      console.error('Error deleting backup:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi máy chủ khi xóa backup!' 
      });
    }
  }
}

module.exports = backupsController;