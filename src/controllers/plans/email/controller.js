const EmailPlans = require("../../../models/plans/email/model");
const logAction = require("../../../middleware/actionLogs");

const emailPlansController = {
  addEmailPlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await EmailPlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên gói email đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newEmailPlans = new EmailPlans(req.body);
      const saveEmailPlans = await newEmailPlans.save();
      await logAction(req.auth._id, 'Gói DV Email', 'Thêm mới');
      return res.status(200).json(saveEmailPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getEmailPlans: async(req, res) => {
    try {
      const emailPlans = await EmailPlans.find().sort({"createdAt": -1}).populate('supplier_id', 'name company');
      return res.status(200).json(emailPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailEmailPlans: async(req, res) => {
    try {
      const emailPlans = await EmailPlans.findById(req.params.id).populate('supplier_id', 'name company phone address');
      return res.status(200).json(emailPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteEmailPlans: async(req, res) => {
    try {
      await EmailPlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV Email', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateEmailPlans: async(req, res) => {
    try {
      const emailPlans = await EmailPlans.findById(req.params.id);
      if (!emailPlans) {
        return res.status(404).json({ message: "Tên gói email không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== emailPlans.name) {
        const existingEmailPlanName = await EmailPlans.findOne({ name });
        if (existingEmailPlanName) {
          return res.status(400).json({ message: "Tên gói email đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      await emailPlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV Email', 'Cập nhật', `/trang-chu/goi-dich-vu/cap-nhat-email/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = emailPlansController;