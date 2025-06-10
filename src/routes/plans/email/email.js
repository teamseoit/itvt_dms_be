const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const emailPlansController = require("../../../controllers/plans/email/controller");

router.get("/", check_role("66746678f7f723b779b1k067"), emailPlansController.getEmailPlans);
router.post("/", check_role("66746678f7f723b779b1b065"), emailPlansController.addEmailPlans);
router.get("/:id", check_role("66746678f7f723b779b1b066"), emailPlansController.getDetailEmailPlans);
router.put("/:id", check_role("66746678f7f723b779b1b066"), emailPlansController.updateEmailPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b067"), emailPlansController.deleteEmailPlans);

module.exports = router;