const router = require("express").Router();
const roleController = require("../../controllers/roles/controller");

router.get("/", roleController.getRoles);
router.get("/:group_user_id", roleController.getRolesByGroupUserId);

module.exports = router;