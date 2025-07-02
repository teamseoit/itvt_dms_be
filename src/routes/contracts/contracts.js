const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const contractController = require("../../controllers/contracts/controller");

router.get("/", check_role("667463d04bede188eee46d7b"), contractController.getContracts);
router.get("/:id", check_role("667463d04bede188eee46d7b"), contractController.getContractById);
router.put("/:id", check_role("667463d04bede188dfb4610c"), contractController.updateContract);
router.delete("/:id", check_role("667463d04bede188dfb46c7c"), contractController.deleteContract);
router.get("/:id/payment-history", check_role("667463d04bede188eee46d7b"), contractController.getPaymentHistory);

module.exports = router;