const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const toplistPlansController = require("../../../controllers/plans/toplist/controller");

router.get("/", check_role("66746678f7f500b779b1e084"), toplistPlansController.getToplistPlans);
router.post("/", check_role("66746678f7f500b779b1e081"), toplistPlansController.addToplistPlans);
router.get("/:id", check_role("66746678f7f500b779b1e082"), toplistPlansController.getDetailToplistPlans);
router.put("/:id", check_role("66746678f7f500b779b1e082"), toplistPlansController.updateToplistPlans);
router.delete("/:id", check_role("66746678f7f500b779b1e083"), toplistPlansController.deleteToplistPlans);

module.exports = router;