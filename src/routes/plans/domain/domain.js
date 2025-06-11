const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const domainPlansController = require("../../../controllers/plans/domain/controller");

router.get("/", check_role("66746678f7f723b779b1a061"), domainPlansController.getDomainPlans);  
router.post("/", check_role("66746678f7f723b779b1b05f"), domainPlansController.addDomainPlan);
router.get("/:id", check_role("66746678f7f723b779b1b060"), domainPlansController.getDetailDomainPlan);
router.put("/:id", check_role("66746678f7f723b779b1b060"), domainPlansController.updateDomainPlan);
router.delete("/:id", check_role("66746678f7f723b779b1b061"), domainPlansController.deleteDomainPlan);

module.exports = router;