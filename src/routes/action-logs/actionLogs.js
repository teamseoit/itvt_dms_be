const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const actionLogsController = require("../../controllers/action-logs/controller");

router.get("/", check_role("643263d04bede188dfb46d79"), actionLogsController.getActionLogs);

module.exports = router;