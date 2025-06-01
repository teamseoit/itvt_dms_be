const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const mobileNetworkServicesController = require("../../../controllers/services/mobile-network/controller");

router.post("/", check_role("667467eb263fb998b9925d40"), mobileNetworkServicesController.addMobileNetworkServices);
router.get("/", mobileNetworkServicesController.getMobileNetworkServices);
router.get("/:id", mobileNetworkServicesController.getDetailMobileNetworkServices);
router.put("/:id", check_role("667467eb263fb998b9925d41"), mobileNetworkServicesController.updateMobileNetworkServices);
router.delete("/:id", check_role("667467eb263fb998b9925d42"), mobileNetworkServicesController.deleteMobileNetworkServices);
router.get("/expired/all", mobileNetworkServicesController.getMobileNetworkServicesExpired);
router.get("/expiring/all", mobileNetworkServicesController.getMobileNetworkServicesExpiring);
router.get("/customer/:customer_id", mobileNetworkServicesController.getMobileNetworkServicesByCustomerId);

module.exports = router;