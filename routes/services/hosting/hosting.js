const router = require("express").Router();
const { check_role } = require("../../../middleware/role_middleware");
const hostingServicesController = require("../../../controllers/services/hosting/controller");

router.post("/", check_role("667467eb263fb998b9925d31"), hostingServicesController.addHostingServices);
router.get("/", hostingServicesController.getHostingServices);
router.get("/:id", hostingServicesController.getDetailHostingServices);
router.put("/:id", check_role("667467eb263fb998b9925d32"), hostingServicesController.updateHostingServices);
router.delete("/:id", check_role("667467eb263fb998b9925d33"), hostingServicesController.deleteHostingServices);
router.get("/expired/all", hostingServicesController.getHostingServicesExpired);
router.get("/expiring/all", hostingServicesController.getHostingServicesExpiring);
router.get("/before-payment/all", hostingServicesController.getHostingServicesBeforePayment);
router.get("/customer/:customer_id", hostingServicesController.getHostingServicesByCustomerId);

module.exports = router;