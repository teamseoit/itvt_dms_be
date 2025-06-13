const ContentPlans = require("../../../models/plans/content/model");
const logAction = require("../../../middleware/actionLogs");

const contentPlansController = {
  getContentPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        ContentPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ContentPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói content thành công.",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói content.",
        error: err.message
      });
    }
  },

  addContentPlans: async (req, res) => {
    try {
      const { name } = req.body;
      const existing = await ContentPlans.findOne({ name });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Tên gói đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new ContentPlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Viết bài Content & PR", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm gói content thành công.",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm gói content.",
        error: err.message
      });
    }
  },

  getDetailContentPlans: async (req, res) => {
    try {
      const plan = await ContentPlans.findById(req.params.id);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói content!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết gói content thành công.",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói content.",
        error: err.message
      });
    }
  },

  updateContentPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await ContentPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Tên gói content không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const exists = await ContentPlans.findOne({ name });
        if (exists && exists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói content đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await ContentPlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      await logAction(
        req.auth._id,
        "Gói DV Viết bài Content & PR",
        "Cập nhật",
        `/goi-dich-vu/viet-bai-content/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói content thành công.",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói content.",
        error: err.message
      });
    }
  },

  deleteContentPlans: async (req, res) => {
    try {
      const deleted = await ContentPlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói content để xóa!"
        });
      }

      await logAction(req.auth._id, "Gói DV Viết bài Content & PR", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói content thành công."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói content.",
        error: err.message
      });
    }
  }
};

module.exports = contentPlansController;
