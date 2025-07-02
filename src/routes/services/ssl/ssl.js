const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const sslServicesController = require("../../../controllers/services/ssl/controller");

router.get("/", check_role("667467eb263fb998b9925a39"), sslServicesController.getSslServices);
router.post("/", check_role("667467eb263fb998b9925d37"), sslServicesController.addSslServices);
router.get("/:id", check_role("667467eb263fb998b9925d38"), sslServicesController.getDetailSslServices);
router.put("/:id", check_role("667467eb263fb998b9925d38"), sslServicesController.updateSslServices);
router.delete("/:id", check_role("667467eb263fb998b9925d39"), sslServicesController.deleteSslServices);

module.exports = router;