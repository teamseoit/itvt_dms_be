const DomainPlans = require("../../../models/plans/domain/model");
const logAction = require("../../../middleware/action_logs");

const domainPlansController = {
  addDomainPlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await DomainPlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên miền đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newDomainPlans = new DomainPlans(req.body);
      const saveDomainPlans = await newDomainPlans.save();
      await logAction(req.auth._id, 'Gói DV Tên miền', 'Thêm mới');
      return res.status(200).json(saveDomainPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDomainPlans: async(req, res) => {
    try {
      const domainPlans = await DomainPlans.find().sort({"createdAt": -1}).populate('supplier_id', 'name company');
      return res.status(200).json(domainPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailDomainPlans: async(req, res) => {
    try {
      const domainPlans = await DomainPlans.findById(req.params.id).populate('supplier_id', 'name company phone address');
      return res.status(200).json(domainPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteDomainPlans: async(req, res) => {
    try {
      await DomainPlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV Tên miền', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateDomainPlans: async(req, res) => {
    try {
      const domainPlans = await DomainPlans.findById(req.params.id);
      if (!domainPlans) {
        return res.status(404).json({ message: "Tên miền không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== domainPlans.name) {
        const existingDomainPlanName = await DomainPlans.findOne({ name });
        if (existingDomainPlanName) {
          return res.status(400).json({ message: "Tên miền đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      await domainPlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV Tên miền', 'Cập nhật', `/trang-chu/goi-dich-vu/cap-nhat-ten-mien/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = domainPlansController;