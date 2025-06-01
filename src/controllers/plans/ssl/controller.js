const SslPlans = require("../../../models/plans/ssl/model");
const logAction = require("../../../middleware/actionLogs");

const sslPlansController = {
  addSslPlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await SslPlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên gói SSL đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newSslPlans = new SslPlans(req.body);
      const saveSslPlans = await newSslPlans.save();
      await logAction(req.auth._id, 'Gói DV SSL', 'Thêm mới');
      return res.status(200).json(saveSslPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslPlans: async(req, res) => {
    try {
      const sslPlans = await SslPlans.find().sort({"createdAt": -1}).populate('supplier_id', 'name company');
      return res.status(200).json(sslPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailSslPlans: async(req, res) => {
    try {
      const sslPlans = await SslPlans.findById(req.params.id).populate('supplier_id', 'name company phone address');
      return res.status(200).json(sslPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteSslPlans: async(req, res) => {
    try {
      await SslPlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV SSL', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateSslPlans: async(req, res) => {
    try {
      const sslPlans = await SslPlans.findById(req.params.id);
      if (!sslPlans) {
        return res.status(404).json({ message: "Tên gói SSL không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== sslPlans.name) {
        const existingSslPlanName = await SslPlans.findOne({ name });
        if (existingSslPlanName) {
          return res.status(400).json({ message: "Tên gói SSL đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }
      await sslPlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV SSL', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-ssl/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = sslPlansController;