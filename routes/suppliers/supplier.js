const router = require("express").Router();
const { check_role } = require("../../middleware/role_middleware");
const supplierController = require("../../controllers/suppliers/controller");

router.post("/", check_role("667463d04bede188dfb46d76"), supplierController.addSupplier);
router.get("/", supplierController.getSupplier);
router.get("/:id", supplierController.getDetailSupplier);
router.put("/:id", check_role("667463d04bede188dfb46d77"), supplierController.updateSupplier);
router.delete("/:id", check_role("667463d04bede188dfb46d78"), supplierController.deleteSupplier);

module.exports = router;