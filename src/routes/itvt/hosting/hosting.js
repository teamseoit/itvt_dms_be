const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const itvtHostingServicesController = require("../../../controllers/itvt/hosting/controller");

// ITVT Hosting Services Routes
router.get("/", check_role("667467eb263fb998b9925d4d"), itvtHostingServicesController.getItvtHostingServices);
router.post("/", check_role("667467eb263fb998b9925d4e"), itvtHostingServicesController.addItvtHostingServices);
router.get("/:id", check_role("667467eb263fb998b9925d4f"), itvtHostingServicesController.getDetailItvtHostingServices);
router.put("/:id", check_role("667467eb263fb998b9925d4f"), itvtHostingServicesController.updateItvtHostingServices);
router.delete("/:id", check_role("667467eb263fb998b9925d50"), itvtHostingServicesController.deleteItvtHostingServices);

module.exports = router;
