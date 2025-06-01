const router = require("express").Router();
const functionsController = require("../../controllers/roles/functions");

router.get("/", functionsController.getFunction);
router.get("/roles", functionsController.getRoles);
router.post("/", functionsController.addRole);
router.get("/list-roles/:group_user_id", functionsController.getRolesByGroupUserId);

module.exports = router;