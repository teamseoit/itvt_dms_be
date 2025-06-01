const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const serverPlansController = require("../../../controllers/plans/server/controller");

router.post("/", check_role("66746678f7f723b779b1b074"), serverPlansController.addServerPlans);
router.get("/", serverPlansController.getServerPlans);
router.get("/:id", serverPlansController.getDetailServerPlans);
router.put("/:id", check_role("66746678f7f723b779b1b075"), serverPlansController.updateServerPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b076"), serverPlansController.deleteServerPlans);

module.exports = router;