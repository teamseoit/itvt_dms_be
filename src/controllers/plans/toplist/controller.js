const ToplistPlans = require("../../../models/plans/toplist/model");
const logAction = require("../../../middleware/actionLogs");

const toplistPlansController = {
  getToplistPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        ToplistPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ToplistPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói toplist thành công.",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói toplist.",
        error: err.message
      });
    }
  },

  addToplistPlans: async (req, res) => {
    try {
      const { name } = req.body;
      const existing = await ToplistPlans.findOne({ name });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Tên gói đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new ToplistPlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Toplist", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm gói toplist thành công.",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm gói toplist.",
        error: err.message
      });
    }
  },

  getDetailToplistPlans: async (req, res) => {
    try {
      const plan = await ToplistPlans.findById(req.params.id);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói toplist!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết gói toplist thành công.",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói toplist.",
        error: err.message
      });
    }
  },

  updateToplistPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await ToplistPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói toplist không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const exists = await ToplistPlans.findOne({ name });
        if (exists && exists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói toplist đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await ToplistPlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      await logAction(
        req.auth._id,
        "Gói DV Toplist",
        "Cập nhật",
        `/goi-dich-vu/toplist-vung-tau/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói toplist thành công.",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói toplist.",
        error: err.message
      });
    }
  },

  deleteToplistPlans: async (req, res) => {
    try {
      const deleted = await ToplistPlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói toplist để xóa!"
        });
      }

      await logAction(req.auth._id, "Gói DV Toplist", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói toplist thành công."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói toplist.",
        error: err.message
      });
    }
  }
};

module.exports = toplistPlansController;
