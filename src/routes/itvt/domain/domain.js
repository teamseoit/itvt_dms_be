const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const itvtDomainServicesController = require("../../../controllers/itvt/domain/controller");

// ITVT Domain Services Routes
router.get("/", check_role("667467eb263fb998b9925d49"), itvtDomainServicesController.getItvtDomainServices);
router.post("/", check_role("667467eb263fb998b9925d4a"), itvtDomainServicesController.addItvtDomainServices);
router.get("/:id", check_role("667467eb263fb998b9925d4b"), itvtDomainServicesController.getDetailItvtDomainServices);
router.put("/:id", check_role("667467eb263fb998b9925d4b"), itvtDomainServicesController.updateItvtDomainServices);
router.delete("/:id", check_role("667467eb263fb998b9925d4c"), itvtDomainServicesController.deleteItvtDomainServices);

module.exports = router;
