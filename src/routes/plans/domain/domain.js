const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const domainPlansController = require("../../../controllers/plans/domain/controller");

router.post("/", check_role("66746678f7f723b779b1b05f"), domainPlansController.addDomainPlan);
router.get("/", domainPlansController.getDomainPlans);
router.get("/:id", domainPlansController.getDetailDomainPlan);
router.put("/:id", check_role("66746678f7f723b779b1b060"), domainPlansController.updateDomainPlan);
router.delete("/:id", check_role("66746678f7f723b779b1b061"), domainPlansController.deleteDomainPlan);

module.exports = router;