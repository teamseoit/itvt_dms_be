const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const toplistServicesController = require("../../../controllers/services/toplist/controller");

router.post("/", check_role("667467eb263fb998b9925d43"), toplistServicesController.addToplistService);
router.get("/", toplistServicesController.getToplistService);
router.get("/:id", toplistServicesController.getDetailToplistService);
router.put("/:id", check_role("667467eb263fb998b9925d44"), toplistServicesController.updateToplistService);
router.delete("/:id", check_role("667467eb263fb998b9925d45"), toplistServicesController.deleteToplistService);
router.get("/expired/all", toplistServicesController.getToplistServiceExpired);
router.get("/expiring/all", toplistServicesController.getToplistServiceExpiring);
router.get("/customer/:customer_id", toplistServicesController.getToplistServiceByCustomerId);

module.exports = router;