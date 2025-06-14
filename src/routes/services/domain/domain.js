const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const domainServicesController = require("../../../controllers/services/domain/controller");

router.get("/", check_role("667467eb263fb998b9925a30"), domainServicesController.getDomainServices);
router.post("/", check_role("667467eb263fb998b9925d2e"), domainServicesController.addDomainServices);
router.get("/:id", check_role("667467eb263fb998b9925d2f"), domainServicesController.getDetailDomainServices);
router.put("/:id", check_role("667467eb263fb998b9925d2f"), domainServicesController.updateDomainServices);
router.delete("/:id", check_role("667467eb263fb998b9925d30"), domainServicesController.deleteDomainServices);
router.get("/status", check_role("667467eb263fb998b9925a30"), domainServicesController.getDomainServicesStatusAutoUpdate);
router.put("/status/update-all", check_role("667467eb263fb998b9925a30"), domainServicesController.updateAllDomainServicesStatus);
router.get("/expiring", check_role("667467eb263fb998b9925a30"), domainServicesController.getExpiringDomains);
router.get("/expired", check_role("667467eb263fb998b9925a30"), domainServicesController.getExpiredDomains);
router.post("/notifications/send", check_role("667467eb263fb998b9925a30"), domainServicesController.sendDomainNotifications);
router.put("/status/update-with-notifications", check_role("667467eb263fb998b9925a30"), domainServicesController.updateDomainStatusWithNotifications);

module.exports = router;