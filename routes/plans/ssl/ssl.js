const router = require("express").Router();
const { check_role } = require("../../../middleware/middleware_role");
const sslPlansController = require("../../../controllers/plans/ssl/controller");

router.post("/", check_role("66746678f7f723b779b1b068"), sslPlansController.addSslPlans);
router.get("/", sslPlansController.getSslPlans);
router.get("/:id", sslPlansController.getDetailSslPlans);
router.put("/:id", check_role("66746678f7f723b779b1b069"), sslPlansController.updateSslPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b06a"), sslPlansController.deleteSslPlans);

module.exports = router;