const EmailPlans = require("../../../models/plans/email/model");
const logAction = require("../../../middleware/actionLogs");

const emailPlansController = {
  getEmailPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        EmailPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("supplier", "name company"),
        EmailPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói email thành công!",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói email.",
        error: err.message
      });
    }
  },

  addEmailPlans: async (req, res) => {
    try {
      const { name } = req.body;

      const existingPlan = await EmailPlans.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Tên gói email đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new EmailPlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Email", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Tạo gói email thành công!",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi tạo gói email.",
        error: err.message
      });
    }
  },

  getDetailEmailPlans: async (req, res) => {
    try {
      const plan = await EmailPlans.findById(req.params.id).populate(
        "supplier",
        "name company"
      );

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói email!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy thông tin gói email thành công!",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói email.",
        error: err.message
      });
    }
  },

  updateEmailPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await EmailPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói email không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const duplicateName = await EmailPlans.findOne({ name });
        if (duplicateName && duplicateName._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói email đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await EmailPlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      ).populate("supplier", "name company");

      await logAction(
        req.auth._id,
        "Gói DV Email",
        "Cập nhật",
        `/goi-dich-vu/email/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói email thành công!",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói email.",
        error: err.message
      });
    }
  },

  deleteEmailPlans: async (req, res) => {
    try {
      const deleted = await EmailPlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói email để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV Email", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói email thành công!"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói email.",
        error: err.message
      });
    }
  }
};

module.exports = emailPlansController;
