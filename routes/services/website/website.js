const router = require("express").Router();
const { check_role } = require("../../../middleware/middleware_role");
const websiteServicesController = require("../../../controllers/services/website/controller");

router.post("/", check_role("667467eb263fb998b9925d46"), websiteServicesController.addWebsiteServices);
router.get("/", websiteServicesController.getWebsiteServices);
router.get("/:id", websiteServicesController.getDetailWebsiteServices);
router.put("/:id", check_role("667467eb263fb998b9925d47"), websiteServicesController.updateWebsiteServices);
router.delete("/:id", check_role("667467eb263fb998b9925d48"), websiteServicesController.deleteWebsiteServices);
router.get("/closed/all", websiteServicesController.getWebsiteServicesClosed);
router.get("/customer/:customer_id", websiteServicesController.getWebsiteServicesByCustomerId);

module.exports = router;