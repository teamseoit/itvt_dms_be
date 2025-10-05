const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const websiteServicesController = require("../../../controllers/services/website/controller");

router.get("/", check_role("667467eb263fb998b9925a48"), websiteServicesController.getWebsiteServices);
router.post("/", check_role("667467eb263fb998b9925d46"), websiteServicesController.addWebsiteServices);
router.get("/:id", check_role("667467eb263fb998b9925d47"), websiteServicesController.getDetailWebsiteServices);
router.put("/:id", check_role("667467eb263fb998b9925d47"), websiteServicesController.updateWebsiteServices);
router.delete("/:id", check_role("667467eb263fb998b9925d48"), websiteServicesController.deleteWebsiteServices);
// router.get("/closed/all", websiteServicesController.getWebsiteServicesClosed);
// router.get("/customer/:customer_id", websiteServicesController.getWebsiteServicesByCustomerId);

module.exports = router;