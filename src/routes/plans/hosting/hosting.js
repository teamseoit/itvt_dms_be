const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const hostingPlansController = require("../../../controllers/plans/hosting/controller");

router.get("/", check_role("66746678f7f723b779b1a065"), hostingPlansController.getHostingPlans);
router.post("/", check_role("66746678f7f723b779b1b062"), hostingPlansController.addHostingPlans);
router.get("/:id", check_role("66746678f7f723b779b1b063"), hostingPlansController.getDetailHostingPlans);
router.put("/:id", check_role("66746678f7f723b779b1b063"), hostingPlansController.updateHostingPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b064"), hostingPlansController.deleteHostingPlans);

module.exports = router;