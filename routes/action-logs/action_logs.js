const router = require("express").Router();
const actionLogsController = require("../../middleware/controller_action_logs");

router.get("/", actionLogsController.getActionLogs);

module.exports = router;