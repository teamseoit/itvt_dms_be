const MobileNetworkPlans = require("../../../models/plans/mobile-network/model");
const logAction = require("../../../middleware/actionLogs");

const mobileNetworkPlansController = {
  getMobileNetworkPlans: async(req, res) => {
    try {
      const mobileNetworkPlans = await MobileNetworkPlans.find().sort({"createdAt": -1}).populate('supplier_mobile_network_id');
      return res.status(200).json(mobileNetworkPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  addMobileNetworkPlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await MobileNetworkPlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên gói nhà mạng đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newMobileNetworkPlans = new MobileNetworkPlans(req.body);
      const saveMobileNetworkPlans = await newMobileNetworkPlans.save();
      await logAction(req.auth._id, 'Gói DV Nhà mạng', 'Thêm mới');
      return res.status(200).json(saveMobileNetworkPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailMobileNetworkPlans: async(req, res) => {
    try {
      const mobileNetworkPlans = await MobileNetworkPlans.findById(req.params.id).populate('supplier_mobile_network_id');
      return res.status(200).json(mobileNetworkPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateMobileNetworkPlans: async(req, res) => {
    try {
      const mobileNetworkPlans = await MobileNetworkPlans.findById(req.params.id);
      if (!mobileNetworkPlans) {
        return res.status(404).json({ message: "Tên gói nhà mạng không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== mobileNetworkPlans.name) {
        const existingMobileNetworkPlanName = await MobileNetworkPlans.findOne({ name });
        if (existingMobileNetworkPlanName) {
          return res.status(400).json({ message: "Tên gói nhà mạng đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      await mobileNetworkPlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV Nhà mạng', 'Cập nhật', `/trang-chu/goi-dich/cap-nhat-nha-mang/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteMobileNetworkPlans: async(req, res) => {
    try {
      await MobileNetworkPlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV Nhà mạng', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
}

module.exports = mobileNetworkPlansController;