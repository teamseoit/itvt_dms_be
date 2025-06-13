const MaintenancePlans = require("../../../models/plans/maintenance/model");
const logAction = require("../../../middleware/actionLogs");

const maintenancePlansController = {
  getMaintenancePlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        MaintenancePlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        MaintenancePlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói bảo trì thành công.",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói bảo trì.",
        error: err.message
      });
    }
  },

  addMaintenancePlans: async (req, res) => {
    try {
      const { name } = req.body;

      const existingPlan = await MaintenancePlans.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Tên gói bảo trì đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new MaintenancePlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Bảo trì", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm gói bảo trì thành công.",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm gói bảo trì.",
        error: err.message
      });
    }
  },

  getDetailMaintenancePlans: async (req, res) => {
    try {
      const plan = await MaintenancePlans.findById(req.params.id);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói bảo trì!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết gói bảo trì thành công.",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói bảo trì.",
        error: err.message
      });
    }
  },

  updateMaintenancePlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await MaintenancePlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói bảo trì không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const exists = await MaintenancePlans.findOne({ name });
        if (exists && exists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói bảo trì đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await MaintenancePlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      await logAction(req.auth._id, "Gói DV Bảo trì", "Cập nhật", `/goi-dich-vu/bao-tri/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói bảo trì thành công.",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói bảo trì.",
        error: err.message
      });
    }
  },

  deleteMaintenancePlans: async (req, res) => {
    try {
      const deleted = await MaintenancePlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói bảo trì để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV Bảo trì", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói bảo trì thành công."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói bảo trì.",
        error: err.message
      });
    }
  }
};

module.exports = maintenancePlansController;
