const MaintenancePlans = require("../../../models/plans/maintenance/model");
const logAction = require("../../../middleware/action_logs");

const maintenancePlansController = {
  addMaintenancePlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await MaintenancePlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên gói bảo trì đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newMaintenancePlans = new MaintenancePlans(req.body);
      const saveMaintenancePlans = await newMaintenancePlans.save();
      await logAction(req.auth._id, 'Gói DV Bảo trì', 'Thêm mới');
      return res.status(200).json(saveMaintenancePlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMaintenancePlans: async(req, res) => {
    try {
      const maintenancePlans = await MaintenancePlans.find().sort({"createdAt": -1});
      return res.status(200).json(maintenancePlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailMaintenancePlans: async(req, res) => {
    try {
      const maintenancePlans = await MaintenancePlans.findById(req.params.id);
      return res.status(200).json(maintenancePlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteMaintenancePlans: async(req, res) => {
    try {
      await MaintenancePlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV Bảo trì', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateMaintenancePlans: async(req, res) => {
    try {
      const maintenancePlans = await MaintenancePlans.findById(req.params.id);
      if (!maintenancePlans) {
        return res.status(404).json({ message: "Tên gói bảo trì không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== maintenancePlans.name) {
        const existingMaintenancePlanName = await MaintenancePlans.findOne({ name });
        if (existingMaintenancePlanName) {
          return res.status(400).json({ message: "Tên gói bảo trì đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      await maintenancePlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV Bảo trì', 'Cập nhật', `/trang-chu/goi-dich-vu/cap-nhat-bao-tri/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = maintenancePlansController;