const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const serverController = require("../../controllers/suppliers/server/controller");

router.post("/", check_role("667463d04bede188dfb46a81"), serverController.addServer);
router.get("/", serverController.getServer);
router.get("/:id", serverController.getDetailServer);
router.put("/:id", check_role("667463d04bede188dfb46e81"), serverController.updateServer);
router.delete("/:id", check_role("667463d04bede188dfb46f81"), serverController.deleteServer);

module.exports = router;