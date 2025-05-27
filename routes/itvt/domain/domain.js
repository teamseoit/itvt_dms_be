const router = require("express").Router();
const { check_role } = require("../../../middleware/middleware_role");
const domainITVTController = require("../../../controllers/itvt/domain/controller");

router.post("/", check_role("667467eb263fb998b9925d2e"), domainITVTController.addDomainITVT);
router.get("/", domainITVTController.getDomainITVT);
router.get("/:id", domainITVTController.getDetailDomainITVT);
router.put("/:id", check_role("667467eb263fb998b9925d2f"), domainITVTController.updateDomainITVT);
router.delete("/:id", check_role("667467eb263fb998b9925d30"), domainITVTController.deleteDomainITVT);
router.get("/expired/all", domainITVTController.getDomainITVTExpired);
router.get("/expiring/all", domainITVTController.getDomainITVTExpiring);

module.exports = router;