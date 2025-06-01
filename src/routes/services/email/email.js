const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const emailServicesController = require("../../../controllers/services/email/controller");

router.post("/", check_role("667467eb263fb998b9925d34"), emailServicesController.addEmailServices);
router.get("/", emailServicesController.getEmailServices);
router.get("/:id", emailServicesController.getDetailEmailServices);
router.put("/:id", check_role("667467eb263fb998b9925d35"), emailServicesController.updateEmailServices);
router.delete("/:id", check_role("667467eb263fb998b9925d36"), emailServicesController.deleteEmailServices);
router.get("/expired/all", emailServicesController.getEmailServicesExpired);
router.get("/expiring/all", emailServicesController.getEmailServicesExpiring);
router.get("/before-payment/all", emailServicesController.getEmailServicesBeforePayment);
router.get("/customer/:customer_id", emailServicesController.getEmailServicesByCustomerId);

module.exports = router;