const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const hostingServicesController = require("../../../controllers/services/hosting/controller");

router.get("/", check_role("667467eb263fb998b9925a33"), hostingServicesController.getHostingServices);
router.post("/", check_role("667467eb263fb998b9925d31"), hostingServicesController.addHostingServices);
router.get("/:id", check_role("667467eb263fb998b9925d32"), hostingServicesController.getDetailHostingServices);
router.put("/:id", check_role("667467eb263fb998b9925d32"), hostingServicesController.updateHostingServices);
router.delete("/:id", check_role("667467eb263fb998b9925d33"), hostingServicesController.deleteHostingServices);

module.exports = router;