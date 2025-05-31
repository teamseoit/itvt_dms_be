const router = require("express").Router();
const ipWhiteListController = require("../../controllers/ip-whitelist/controller");
const { check_role } = require("../../middleware/role_middleware");

router.get("/", check_role("643263d04bede188fff66d76"), ipWhiteListController.getIpWhitelist);
router.post("/", check_role("643263d04bede188dff66d76"), ipWhiteListController.addIpWhitelist);
router.delete("/:id", check_role("643263d04bede188dff67d76"), ipWhiteListController.deleteIpWhitelist);
router.get("/list/ip-valid", ipWhiteListController.isValidIp);

module.exports = router;