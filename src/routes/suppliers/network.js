const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const networkController = require("../../controllers/suppliers/network/controller");

router.post("/", check_role("667463d04bede188dfb46d79"), networkController.addNetwork);
router.get("/", networkController.getNetwork);
router.get("/:id", networkController.getDetailNetwork);
router.put("/:id", check_role("667463d04bede188dfb46d80"), networkController.updateNetwork);
router.delete("/:id", check_role("667463d04bede188dfb46d81"), networkController.deleteNetwork);

module.exports = router;