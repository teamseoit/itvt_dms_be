const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const contractController = require("../../controllers/contracts/controller");

// router.post("/", check_role("667463d04bede188dfb46d7b"), contractController.addContract);
router.get("/", contractController.getContract);
router.get("/:id", contractController.getDetailContract);
router.put("/:id", check_role("667463d04bede188dfb46d7c"), contractController.updateContract);
router.delete("/:id", check_role("667463d04bede188dfb46c7c"), contractController.deleteContract);

module.exports = router;