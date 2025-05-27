const router = require("express").Router();
const upload = require('../../middleware/upload');
const customerController = require("../../controllers/customers/controller");
const { check_role } = require("../../middleware/middleware_role");

router.post('/', check_role("667463d04bede188dfb46d7e"), upload.fields([
  { name: 'image_front_view', maxCount: 1 },
  { name: 'image_back_view', maxCount: 1 },
]), customerController.addCustomer);
router.get("/",  customerController.getCustomer);
router.get("/:id", customerController.getDetailCustomer);
router.get("/type/guests", customerController.getGuestsCustomer);
router.get("/type/company", customerController.getCompanyCustomer);
router.put('/:id', check_role("667463d04bede188dfb46d7f"), upload.fields([
  { name: 'image_front_view', maxCount: 1 },
  { name: 'image_back_view', maxCount: 1 },
]), customerController.updateCustomer);
router.delete("/:id", check_role("667463d04bede188dfb46b7f"), customerController.deleteCustomer);

module.exports = router;