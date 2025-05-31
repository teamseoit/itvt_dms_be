const router = require("express").Router();
const { check_role } = require("../../../middleware/role_middleware");
const mobileNetworkPlansController = require("../../../controllers/plans/mobile-network/controller")

router.post("/", check_role("66746678f7f723b779b1b071"), mobileNetworkPlansController.addMobileNetworkPlans);
router.get("/", mobileNetworkPlansController.getMobileNetworkPlans);
router.get("/:id", mobileNetworkPlansController.getDetailMobileNetworkPlans);
router.put("/:id", check_role("66746678f7f723b779b1b072"), mobileNetworkPlansController.updateMobileNetworkPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b073"), mobileNetworkPlansController.deleteMobileNetworkPlans);

module.exports = router;