const router = require("express").Router();
const upload = require('../../middleware/upload');
const customerController = require("../../controllers/customers/controller");
const { check_role } = require("../../middleware/roleMiddleware");

const imageUploadConfig = [
  { name: 'identityCardFrontImage', maxCount: 1 },
  { name: 'identityCardBackImage', maxCount: 1 }
];

router.get("/", check_role("667463d04bede188dfb46f7f"), customerController.getCustomer);

router.post('/', 
  check_role("667463d04bede188dfb46d7e"),
  upload.fields(imageUploadConfig), 
  customerController.addCustomer
);

router.get("/:id", check_role("667463d04bede188dfb46d7f"), customerController.getDetailCustomer);

router.put('/:id',
  check_role("667463d04bede188dfb46d7f"),
  upload.fields(imageUploadConfig),
  customerController.updateCustomer
);

router.delete("/:id",
  check_role("667463d04bede188dfb46b7f"), 
  customerController.deleteCustomer
);

module.exports = router;
