const router = require("express").Router();
const { check_role } = require("../../../middleware/role_middleware");
const emailPlansController = require("../../../controllers/plans/email/controller");

router.post("/", check_role("66746678f7f723b779b1b065"), emailPlansController.addEmailPlans);
router.get("/", emailPlansController.getEmailPlans);
router.get("/:id", emailPlansController.getDetailEmailPlans);
router.put("/:id", check_role("66746678f7f723b779b1b066"), emailPlansController.updateEmailPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b067"), emailPlansController.deleteEmailPlans);

module.exports = router;