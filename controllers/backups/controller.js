const Backups = require('../../models/backups/model');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupsController = {
  getBackups: async(req, res) => {
    try {
      // Tạo thư mục backup nếu chưa có
      const backupDir = path.join('backups');
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
    
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backup-${dateStr}.gz`;
      const fullPath = path.join(backupDir, fileName);

      const mongodumpPath = 'D:\\mongodb\\bin\\mongodump.exe';
      const cmd = `${mongodumpPath} --uri="mongodb://localhost:27017/local_data_dms_test" --archive="${fullPath}" --gzip`;
      exec(cmd, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Lỗi backup: ${stderr}`);
          return res.status(500).json({ message: 'Lỗi không tạo được backup!' });
        }
    
        const stats = fs.statSync(fullPath);
        const fileSize = stats.size;
    
        const backupEntry = new Backups({
          fileName,
          filePath: fullPath,
          fileSize,
          createdBy: 'admin'
        });
    
        await backupEntry.save();
        console.log('Backup created and saved.');
        res.download(fullPath, fileName);
      });
    } catch(err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách backup!' });
    }
  },
  getListBackups: async(req, res) => {
    try {
      const backups = await Backups.find().sort({ createdAt: -1 });
      res.json(backups);
    } catch(err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách backup!' });
    }
  },
  getDownload: async(req, res) => {
    try {
      const backup = await Backups.findById(req.params.id);
      if (!backup) return res.status(404).send('Không tìm thấy file backup!');

      res.download(backup.filePath, backup.fileName);
    } catch(err) {
      res.status(500).json({ message: 'Lỗi khi tải file' });
    }
  },

}

module.exports = backupsController;