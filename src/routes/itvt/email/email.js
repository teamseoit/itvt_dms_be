const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const itvtEmailServicesController = require("../../../controllers/itvt/email/controller");

// ITVT Email Services Routes
router.get("/", check_role("667467eb263fb998b9925d55"), itvtEmailServicesController.getItvtEmailServices);
router.post("/", check_role("667467eb263fb998b9925d56"), itvtEmailServicesController.addItvtEmailServices);
router.get("/:id", check_role("667467eb263fb998b9925d57"), itvtEmailServicesController.getDetailItvtEmailServices);
router.put("/:id", check_role("667467eb263fb998b9925d57"), itvtEmailServicesController.updateItvtEmailServices);
router.delete("/:id", check_role("667467eb263fb998b9925d58"), itvtEmailServicesController.deleteItvtEmailServices);

module.exports = router;
