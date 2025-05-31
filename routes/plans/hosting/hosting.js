const router = require("express").Router();
const { check_role } = require("../../../middleware/role_middleware");
const hostingPlansController = require("../../../controllers/plans/hosting/controller");

router.post("/", check_role("66746678f7f723b779b1b062"), hostingPlansController.addHostingPlans);
router.get("/", hostingPlansController.getHostingPlans);
router.get("/:id", hostingPlansController.getDetailHostingPlans);
router.put("/:id", check_role("66746678f7f723b779b1b063"), hostingPlansController.updateHostingPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b064"), hostingPlansController.deleteHostingPlans);

module.exports = router;