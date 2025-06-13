const router = require("express").Router();
const { check_role } = require("../../../middleware/roleMiddleware");
const networkPlansController = require("../../../controllers/plans/network/controller")

router.get("/", check_role("66746678f7f723b779b1a073"), networkPlansController.getNetworkPlans);
router.post("/", check_role("66746678f7f723b779b1b071"), networkPlansController.addNetworkPlans);
router.get("/:id", check_role("66746678f7f723b779b1b072"), networkPlansController.getDetailNetworkPlans);
router.put("/:id", check_role("66746678f7f723b779b1b072"), networkPlansController.updateNetworkPlans);
router.delete("/:id", check_role("66746678f7f723b779b1b073"), networkPlansController.deleteNetworkPlans);

module.exports = router;