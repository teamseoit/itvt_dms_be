const router = require("express").Router();
const { check_role } = require("../../../middleware/middleware_role");
const sslITVTController = require("../../../controllers/itvt/ssl/controller");

router.post("/", check_role("667467eb263fb998b9925d37"), sslITVTController.addSslITVT);
router.get("/", sslITVTController.getSslITVT);
router.get("/:id", sslITVTController.getDetailSslITVT);
router.put("/:id", check_role("667467eb263fb998b9925d38"), sslITVTController.updateSslITVT);
router.delete("/:id", check_role("667467eb263fb998b9925d39"), sslITVTController.deleteSslITVT);
router.get("/expired/all", sslITVTController.getSslITVTExpired);
router.get("/expiring/all", sslITVTController.getSslITVTExpiring);

module.exports = router;