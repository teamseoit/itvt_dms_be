const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const contentPlansController = require("../../../controllers/plans/content/controller");

router.get("/", check_role("66746678f7f723b779b1a06e"), contentPlansController.getContentPlans);
router.post("/", check_role("66746678f7f723b779b1b06b"), contentPlansController.addContentPlans);
router.get("/:id", check_role("66746678f7f723b779b1b06c"), contentPlansController.getDetailContentPlans);
router.put("/:id", check_role("66746678f7f723b779b1b06c"), contentPlansController.updateContentPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b06d"), contentPlansController.deleteContentPlans);

module.exports = router;