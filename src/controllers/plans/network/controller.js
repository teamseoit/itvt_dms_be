const NetworkPlans = require("../../../models/plans/network/model");
const logAction = require("../../../middleware/actionLogs");

const networkPlansController = {
  getNetworkPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        NetworkPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('supplier'),
        NetworkPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói nhà mạng thành công.",
        data: plans,
        meta: {
          page,
          limit,
          totalDocs,
          totalPages: Math.ceil(totalDocs / limit)
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy danh sách gói nhà mạng.",
        error: err.message
      });
    }
  },

  addNetworkPlans: async (req, res) => {
    try {
      const { name } = req.body;

      const existingPlan = await NetworkPlans.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Tên gói nhà mạng đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new NetworkPlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Nhà mạng", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm gói nhà mạng thành công.",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm gói nhà mạng.",
        error: err.message
      });
    }
  },

  getDetailNetworkPlans: async (req, res) => {
    try {
      const plan = await NetworkPlans.findById(req.params.id).populate('supplier');

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói nhà mạng!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết gói nhà mạng thành công.",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói nhà mạng.",
        error: err.message
      });
    }
  },

  updateNetworkPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await NetworkPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói nhà mạng không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const exists = await NetworkPlans.findOne({ name });
        if (exists && exists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói nhà mạng đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await NetworkPlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      await logAction(req.auth._id, "Gói DV Nhà mạng", "Cập nhật", `/goi-dich-vu/nha-mang/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói nhà mạng thành công.",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói nhà mạng.",
        error: err.message
      });
    }
  },

  deleteNetworkPlans: async (req, res) => {
    try {
      const deleted = await NetworkPlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói nhà mạng để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV Nhà mạng", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói nhà mạng thành công."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói nhà mạng.",
        error: err.message
      });
    }
  }
};

module.exports = networkPlansController;
