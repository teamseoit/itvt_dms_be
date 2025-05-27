const router = require("express").Router();
const { check_role } = require("../../../middleware/middleware_role");
const maintenancePlansController = require("../../../controllers/plans/maintenance/controller");

router.post("/", check_role("66746678f7f723b779b1b06e"), maintenancePlansController.addMaintenancePlans);
router.get("/", maintenancePlansController.getMaintenancePlans);
router.get("/:id", maintenancePlansController.getDetailMaintenancePlans);
router.put("/:id", check_role("66746678f7f723b779b1b06f"), maintenancePlansController.updateMaintenancePlans);
router.delete("/:id", check_role("66746678f7f723b779b1b070"), maintenancePlansController.deleteMaintenancePlans);

module.exports = router;