const HostingPlans = require("../../../models/plans/hosting/model");
const logAction = require("../../../middleware/actionLogs");

const hostingPlansController = {
  getHostingPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        HostingPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("supplier", "name company"),
        HostingPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói hosting thành công!",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói hosting.",
        error: err.message
      });
    }
  },

  addHostingPlans: async (req, res) => {
    try {
      const { name } = req.body;

      const existingPlan = await HostingPlans.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Tên gói hosting đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new HostingPlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Hosting", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Tạo gói hosting thành công!",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi tạo gói hosting.",
        error: err.message
      });
    }
  },

  getDetailHostingPlans: async (req, res) => {
    try {
      const plan = await HostingPlans.findById(req.params.id).populate(
        "supplier",
        "name company"
      );

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói hosting!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy thông tin gói hosting thành công!",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói hosting.",
        error: err.message
      });
    }
  },

  updateHostingPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await HostingPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói hosting không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const duplicateName = await HostingPlans.findOne({ name });
        if (duplicateName && duplicateName._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói hosting đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await HostingPlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      ).populate("supplier", "name company");

      await logAction(
        req.auth._id,
        "Gói DV Hosting",
        "Cập nhật",
        `/goi-dich-vu/hosting/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói hosting thành công!",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói hosting.",
        error: err.message
      });
    }
  },

  deleteHostingPlans: async (req, res) => {
    try {
      const deleted = await HostingPlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói hosting để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV Hosting", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói hosting thành công!"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói hosting.",
        error: err.message
      });
    }
  },
};

module.exports = hostingPlansController;
