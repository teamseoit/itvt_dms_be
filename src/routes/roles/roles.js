const router = require("express").Router();
const roleController = require("../../controllers/roles/controller");

router.get("/", roleController.getPermission);
router.get("/roles", roleController.getRoles);
router.post("/", roleController.addRole);
router.get("/list-roles/:group_user_id", roleController.getRolesByGroupUserId);

module.exports = router;