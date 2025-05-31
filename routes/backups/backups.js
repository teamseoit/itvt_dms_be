const router = require("express").Router();
const backupsController = require("../../controllers/backups/controller");
const { check_role } = require("../../middleware/role_middleware");

router.get("/", check_role("643263d04bede188dfb46d76"), backupsController.getListBackups);
router.get("/backups", check_role("643263d04bede188dfb46d76"), backupsController.getBackups);
router.get("/download/:id", check_role("643263d04bede188dfb46d76"), backupsController.getDownload);

module.exports = router;