const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const sslServicesController = require("../../../controllers/services/ssl/controller");

router.post("/", check_role("667467eb263fb998b9925d37"), sslServicesController.addSslServices);
router.get("/", sslServicesController.getSslServices);
router.get("/:id", sslServicesController.getDetailSslServices);
router.put("/:id", check_role("667467eb263fb998b9925d38"), sslServicesController.updateSslServices);
router.delete("/:id", check_role("667467eb263fb998b9925d39"), sslServicesController.deleteSslServices);
router.get("/expired/all", sslServicesController.getSslServicesExpired);
router.get("/expiring/all", sslServicesController.getSslServicesExpiring);
router.get("/before-payment/all", sslServicesController.getSslServicesBeforePayment);
router.get("/customer/:customer_id", sslServicesController.getSslServicesByCustomerId);

module.exports = router;