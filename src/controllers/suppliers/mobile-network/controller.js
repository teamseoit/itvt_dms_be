const MobileNetwork = require("../../../models/suppliers/mobile-network/model");
const MobileNetworkPlans = require("../../../models/plans/mobile-network/model");
const logAction = require("../../../middleware/actionLogs");

const mobileNetworkController = {
  getMobileNetwork: async(req, res) => {
    try {
      const mobileNetwork = await MobileNetwork.find().sort({"createdAt": -1});
      return res.status(200).json(mobileNetwork);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  addMobileNetwork: async(req, res) => {
    try {
      const { name } = req.body;
      const existingName = await MobileNetwork.findOne({name});
      if (existingName) {
        return res.status(400).json({ message: 'Tên nhà mạng di động đã tồn tại! Vui lòng nhập tên khác!' });
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên nhà mạng không được chứa ký tự đặc biệt!" });
      }
      
      const newMobileNetwork = new MobileNetwork(req.body);
      const saveMobileNetwork = await newMobileNetwork.save();
      await logAction(req.auth._id, 'Nhà mạng', 'Thêm mới');
      return res.status(200).json(saveMobileNetwork);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailMobileNetwork: async(req, res) => {
    try {
      const mobileNetwork = await MobileNetwork.findById(req.params.id);
      return res.status(200).json(mobileNetwork);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateMobileNetwork: async(req, res) => {
    try {
      const mobileNetwork = await MobileNetwork.findById(req.params.id);
      if (!mobileNetwork) {
        return res.status(404).json({ message: "Nhà mạng không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== mobileNetwork.name) {
        const existingMobileNetworkName = await MobileNetwork.findOne({ name });
        if (existingMobileNetworkName) {
          return res.status(400).json({ message: "Tên nhà mạng đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên nhà mạng không được chứa ký tự đặc biệt!" });
      }

      await mobileNetwork.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Nhà mạng', 'Cập nhật', `/trang-chu/nha-cung-cap/nha-mang/cap-nhat-nha-mang/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteMobileNetwork: async(req, res) => {
    try {
      const supplierId = req.params.id;
      const mobileNetworkPlanExists = await MobileNetworkPlans.findOne({ supplier_id: supplierId });

      if (mobileNetworkPlanExists) {
        return res.status(400).json({ message: "Không thể xóa nhà cung cấp khi đang được sử dụng!" });
      }

      await MobileNetwork.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Nhà mạng', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
}

module.exports = mobileNetworkController;