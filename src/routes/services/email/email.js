const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const emailServicesController = require("../../../controllers/services/email/controller");

router.get("/", check_role("667467eb263fb998b9925a36"), emailServicesController.getEmailServices);
router.post("/", check_role("667467eb263fb998b9925d34"), emailServicesController.addEmailServices);
router.get("/:id", check_role("667467eb263fb998b9925d35"), emailServicesController.getDetailEmailServices);
router.put("/:id", check_role("667467eb263fb998b9925d35"), emailServicesController.updateEmailServices);
router.delete("/:id", check_role("667467eb263fb998b9925d36"), emailServicesController.deleteEmailServices);

module.exports = router;