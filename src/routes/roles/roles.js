const router = require("express").Router();
const roleController = require("../../controllers/roles/controller");

router.get("/", roleController.getRoles);
router.post("/", roleController.addRole);
router.get("/:group_user_id", roleController.getRolesByGroupUserId);

module.exports = router;