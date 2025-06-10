const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const mobileNetworkPlansController = require("../../../controllers/plans/mobile-network/controller")

router.get("/", check_role("66746678f7f723b779b1k073"), mobileNetworkPlansController.getMobileNetworkPlans);
router.post("/", check_role("66746678f7f723b779b1b071"), mobileNetworkPlansController.addMobileNetworkPlans);
router.get("/:id", check_role("66746678f7f723b779b1b072"), mobileNetworkPlansController.getDetailMobileNetworkPlans);
router.put("/:id", check_role("66746678f7f723b779b1b072"), mobileNetworkPlansController.updateMobileNetworkPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b073"), mobileNetworkPlansController.deleteMobileNetworkPlans);

module.exports = router;