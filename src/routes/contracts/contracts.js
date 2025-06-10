const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const contractController = require("../../controllers/contracts/controller");

router.get("/", check_role("667463d04bede188eee46d7b"), contractController.getContract);
// router.post("/", check_role("667463d04bede188dfb46d7b"), contractController.addContract);
router.get("/:id", check_role("667463d04bede188dfb4610c"), contractController.getDetailContract);
router.put("/:id", check_role("667463d04bede188dfb4610c"), contractController.updateContract);
router.delete("/:id", check_role("667463d04bede188dfb46c7c"), contractController.deleteContract);
// router.delete("/:id", check_role("667463d04bede188dfb46d7c"), contractController.giahan);

module.exports = router;