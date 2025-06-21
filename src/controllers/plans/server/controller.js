const ServerPlans = require("../../../models/plans/server/model");
const logAction = require("../../../middleware/actionLogs");

const ServerPlansController = {
  getServerPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        ServerPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("supplierId", "name company"),
        ServerPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói server thành công.",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói server.",
        error: err.message
      });
    }
  },

  addServerPlans: async (req, res) => {
    try {
      const { name } = req.body;

      const existingPlan = await ServerPlans.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Tên gói server đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new ServerPlans(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Server", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm gói server thành công.",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm gói server.",
        error: err.message
      });
    }
  },

  getDetailServerPlans: async (req, res) => {
    try {
      const plan = await ServerPlans.findById(req.params.id).populate(
        "supplierId",
        "name company"
      );

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói server!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết gói server thành công.",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói server.",
        error: err.message
      });
    }
  },

  updateServerPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const plan = await ServerPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói server không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const exists = await ServerPlans.findOne({ name });
        if (exists && exists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói server đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await ServerPlans.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      await logAction(req.auth._id, "Gói DV Server", "Cập nhật", `/goi-dich-vu/server/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói server thành công.",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói server.",
        error: err.message
      });
    }
  },

  deleteServerPlans: async (req, res) => {
    try {
      const deleted = await ServerPlans.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói server để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV Server", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói server thành công."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói server.",
        error: err.message
      });
    }
  }
};

module.exports = ServerPlansController;
