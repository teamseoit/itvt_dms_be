const router = require("express").Router();
const { check_role } = require("../../middleware/role_middleware");
const userController = require("../../controllers/users/controller");

router.post("/", check_role("66746193cb45907845239f36"), userController.addUser);
router.get("/", userController.getUser);
router.get("/:id", userController.getDetailUser);
router.put("/:id", check_role("66746193cb45907845239f38"), userController.updateUser);
router.put("/change-password/:id", check_role("66746193cb45907845239f38"), userController.changePassword);
router.delete("/:id", check_role("66746193cb45907845239f50"), userController.deleteUser);

module.exports = router;