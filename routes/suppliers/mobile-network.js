const router = require("express").Router();
const { check_role } = require("../../middleware/middleware_role");
const mobileNetworkController = require("../../controllers/suppliers/mobile-network/controller");

router.post("/", check_role("667463d04bede188dfb46d79"), mobileNetworkController.addMobileNetwork);
router.get("/", mobileNetworkController.getMobileNetwork);
router.get("/:id", mobileNetworkController.getDetailMobileNetwork);
router.put("/:id", check_role("667463d04bede188dfb46d80"), mobileNetworkController.updateMobileNetwork);
router.delete("/:id", check_role("667463d04bede188dfb46d81"), mobileNetworkController.deleteMobileNetwork);

module.exports = router;