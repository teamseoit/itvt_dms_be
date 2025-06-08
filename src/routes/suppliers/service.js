const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const serviceController = require("../../controllers/suppliers/service/controller");

router.post("/", check_role("667463d04bede188dfb46d76"), serviceController.addService);
router.get("/", serviceController.getService);
router.get("/:id", serviceController.getDetailService);
router.put("/:id", check_role("667463d04bede188dfb46d77"), serviceController.updateService);
router.delete("/:id", check_role("667463d04bede188dfb46d78"), serviceController.deleteService);

module.exports = router;