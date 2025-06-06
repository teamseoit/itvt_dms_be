const router = require("express").Router();
const permissionController = require("../../controllers/permissions/controller");

router.get("/", permissionController.getPermission);

module.exports = router;