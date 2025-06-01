const HostingPlans = require("../../../models/plans/hosting/model");
const logAction = require("../../../middleware/actionLogs");

const hostingPlansController = {
  addHostingPlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await HostingPlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên gói hosting đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newHostingPlans = new HostingPlans(req.body);
      const saveHostingPlans = await newHostingPlans.save();
      await logAction(req.auth._id, 'Gói DV Hosting', 'Thêm mới');
      return res.status(200).json(saveHostingPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getHostingPlans: async(req, res) => {
    try {
      const hostingPlans = await HostingPlans.find().sort({"createdAt": -1}).populate('supplier_id', 'name company');
      return res.status(200).json(hostingPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailHostingPlans: async(req, res) => {
    try {
      const hostingPlans = await HostingPlans.findById(req.params.id).populate('supplier_id', 'name company phone address');
      return res.status(200).json(hostingPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteHostingPlans: async(req, res) => {
    try {
      await HostingPlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV Hosting', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateHostingPlans: async(req, res) => {
    try {
      const hostingPlans = await HostingPlans.findById(req.params.id);
      if (!hostingPlans) {
        return res.status(404).json({ message: "Tên gói hosting không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== hostingPlans.name) {
        const existingHostingPlanName = await HostingPlans.findOne({ name });
        if (existingHostingPlanName) {
          return res.status(400).json({ message: "Tên gói hosting đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      await hostingPlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV Hosting', 'Cập nhật', `/trang-chu/goi-dich-vu/cap-nhat-hosting/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = hostingPlansController;