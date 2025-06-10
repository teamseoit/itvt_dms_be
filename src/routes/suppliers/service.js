const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const serviceController = require("../../controllers/suppliers/service/controller");

router.get("/", check_role("667463d04bede188dfb46e78"), serviceController.getService);
router.post("/", check_role("667463d04bede188dfb46d76"), serviceController.addService);
router.get("/:id", check_role("667463d04bede188dfb46d77"), serviceController.getDetailService);
router.put("/:id", check_role("667463d04bede188dfb46d77"), serviceController.updateService);
router.delete("/:id", check_role("667463d04bede188dfb46d78"), serviceController.deleteService);

module.exports = router;