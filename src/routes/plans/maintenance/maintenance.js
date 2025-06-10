const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const maintenancePlansController = require("../../../controllers/plans/maintenance/controller");

router.get("/", check_role("66746678f7f723b779b1k070"), maintenancePlansController.getMaintenancePlans);
router.post("/", check_role("66746678f7f723b779b1b06e"), maintenancePlansController.addMaintenancePlans);
router.get("/:id", check_role("66746678f7f723b779b1b06f"), maintenancePlansController.getDetailMaintenancePlans);
router.put("/:id", check_role("66746678f7f723b779b1b06f"), maintenancePlansController.updateMaintenancePlans);
router.delete("/:id", check_role("66746678f7f723b779b1b070"), maintenancePlansController.deleteMaintenancePlans);

module.exports = router;