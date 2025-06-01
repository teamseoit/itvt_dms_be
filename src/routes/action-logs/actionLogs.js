const router = require("express").Router();
const actionLogsController = require("../../controllers/action-logs/controller");

router.get("/", actionLogsController.getActionLogs);

module.exports = router;