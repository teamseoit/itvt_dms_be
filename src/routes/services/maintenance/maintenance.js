const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const maintenanceServicesController = require("../../../controllers/services/maintenance/controller");

router.post("/", check_role("667467eb263fb998b9925d3d"), maintenanceServicesController.addMaintenanceServices);
router.get("/", maintenanceServicesController.getMaintenanceServices);
router.get("/:id", maintenanceServicesController.getDetailMaintenanceServices);
router.put("/:id", check_role("667467eb263fb998b9925d3e"), maintenanceServicesController.updateMaintenanceServices);
router.delete("/:id", check_role("667467eb263fb998b9925d3f"), maintenanceServicesController.deleteMaintenanceServices);
router.get("/expired/all", maintenanceServicesController.getMaintenanceServicesExpired);
router.get("/expiring/all", maintenanceServicesController.getMaintenanceServicesExpiring);
router.get("/customer/:customer_id", maintenanceServicesController.getMaintenanceServicesByCustomerId);

module.exports = router;