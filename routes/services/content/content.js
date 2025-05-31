const router = require("express").Router();
const { check_role } = require("../../../middleware/role_middleware");
const contentServicesController = require("../../../controllers/services/content/controller");

router.post("/", check_role("667467eb263fb998b9925d3a"), contentServicesController.addContentServices);
router.get("/", contentServicesController.getContentServices);
router.get("/:id", contentServicesController.getDetailContentServices);
router.put("/:id", check_role("667467eb263fb998b9925d3b"), contentServicesController.updateContentServices);
router.delete("/:id", check_role("667467eb263fb998b9925d3c"), contentServicesController.deleteContentServices);
router.get("/expired/all", contentServicesController.getContentServicesExpired);
router.get("/expiring/all", contentServicesController.getContentServicesExpiring);
router.get("/customer/:customer_id", contentServicesController.getContentServicesByCustomerId);

module.exports = router;