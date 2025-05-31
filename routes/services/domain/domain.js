const router = require("express").Router();
const { check_role } = require("../../../middleware/role_middleware");
const domainServicesController = require("../../../controllers/services/domain/controller");

router.post("/", check_role("667467eb263fb998b9925d2e"), domainServicesController.addDomainServices);
router.get("/", domainServicesController.getDomainServices);
router.get("/:id", domainServicesController.getDetailDomainServices);
router.put("/:id", check_role("667467eb263fb998b9925d2f"), domainServicesController.updateDomainServices);
router.delete("/:id", check_role("667467eb263fb998b9925d30"), domainServicesController.deleteDomainServices);
router.get("/expired/all", domainServicesController.getDomainServicesExpired);
router.get("/expiring/all", domainServicesController.getDomainServicesExpiring);
router.get("/before-payment/all", domainServicesController.getDomainServicesBeforePayment);
router.get("/customer/:customer_id", domainServicesController.getDomainServicesByCustomerId);

module.exports = router;