const router = require("express").Router();
const groupUserController = require("../../controllers/group-user/controller");
const { check_role } = require("../../middleware/roleMiddleware");
const validate = require('../../middleware/validate');
const { createGroupUserSchema, updateGroupUserSchema } = require('../../validators/groupUserValidator');

router.post("/", check_role("66746193cb45907845239f39"), validate(createGroupUserSchema), groupUserController.addGroupUser);
router.get("/", groupUserController.getGroupUser);
router.get("/:id", groupUserController.getDetailGroupUser);
router.put("/:id", check_role("66746193cb45907845239f3a"), validate(updateGroupUserSchema), groupUserController.updateGroupUser);
router.delete("/:id", check_role("66746193cb45907845239f4a"), groupUserController.deleteGroupUser);

module.exports = router;