const router = require("express").Router();
const groupUserController = require("../../controllers/group-user/controller");
const { check_role } = require("../../middleware/roleMiddleware");

router.get("/", check_role("66746193cb45907845fe9f39"), groupUserController.getGroupUser);
router.post("/", check_role("66746193cb45907845239f39"), groupUserController.addGroupUser);
router.get("/:id", check_role("66746193cb45907845239f3a"), groupUserController.getDetailGroupUser);
router.put("/:id", check_role("66746193cb45907845239f3a"), groupUserController.updateGroupUser);
router.delete("/:id", check_role("66746193cb45907845239f4a"), groupUserController.deleteGroupUser);

module.exports = router;