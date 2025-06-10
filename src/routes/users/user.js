const router = require("express").Router();
const { check_role } = require("../../middleware/roleMiddleware");
const userController = require("../../controllers/users/controller");

router.get("/", check_role("66746193cb45907845ee9f36"), userController.getUser);
router.post("/", check_role("66746193cb45907845239f36"), userController.addUser);
router.get("/:id", check_role("66746193cb45907845239f38"), userController.getDetailUser);
router.put("/:id", check_role("66746193cb45907845239f38"), userController.updateUser);
router.put("/change-password/:id", check_role("66746193cb45907845239f37"), userController.changePassword);
router.delete("/:id", check_role("66746193cb45907845239f50"), userController.deleteUser);

module.exports = router;