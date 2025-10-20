const router = require("express").Router();
const backupsController = require("../../controllers/backups/controller");
const { check_role } = require("../../middleware/roleMiddleware");

// Lấy danh sách backup có phân trang
router.get("/", check_role("643263d04bede188dfb46d78"), backupsController.getBackups);

// Tạo backup mới
router.post("/create", check_role("643263d04bede188dfb46d76"), backupsController.createBackup);

// Tải file backup
router.get("/download/:id", check_role("643263d04bede188dfb46d76"), backupsController.downloadBackup);

// Xóa backup
router.delete("/:id", check_role("643263d04bede188dfb46d76"), backupsController.deleteBackup);

module.exports = router;