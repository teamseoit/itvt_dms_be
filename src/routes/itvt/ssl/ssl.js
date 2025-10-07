const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const itvtSslServicesController = require("../../../controllers/itvt/ssl/controller");

// ITVT SSL Services Routes
router.get("/", check_role("667467eb263fb998b9925d51"), itvtSslServicesController.getItvtSslServices);
router.post("/", check_role("667467eb263fb998b9925d52"), itvtSslServicesController.addItvtSslServices);
router.get("/:id", check_role("667467eb263fb998b9925d53"), itvtSslServicesController.getDetailItvtSslServices);
router.put("/:id", check_role("667467eb263fb998b9925d53"), itvtSslServicesController.updateItvtSslServices);
router.delete("/:id", check_role("667467eb263fb998b9925d54"), itvtSslServicesController.deleteItvtSslServices);

module.exports = router;
