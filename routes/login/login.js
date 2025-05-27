const router = require("express").Router();
const loginController = require("../../controllers/login/controller");

router.post("/", loginController.login);
router.post("/logout", loginController.logout);

module.exports = router;