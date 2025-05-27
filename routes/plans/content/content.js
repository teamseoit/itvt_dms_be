const router = require("express").Router();
const { check_role } = require("../../../middleware/middleware_role");
const contentPlansController = require("../../../controllers/plans/content/controller");

router.post("/", check_role("66746678f7f723b779b1b06b"), contentPlansController.addContentPlans);
router.get("/", contentPlansController.getContentPlans);
router.get("/:id", contentPlansController.getDetailContentPlans);
router.put("/:id", check_role("66746678f7f723b779b1b06c"), contentPlansController.updateContentPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b06d"), contentPlansController.deleteContentPlans);

module.exports = router;