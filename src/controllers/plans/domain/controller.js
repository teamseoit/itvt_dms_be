const DomainPlan = require("../../../models/plans/domain/model");
const logAction = require("../../../middleware/actionLogs");

const domainPlansController = {
  getDomainPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [domainPlans, totalDocs] = await Promise.all([
        DomainPlan.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("supplier", "name company"),
        DomainPlan.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói tên miền thành công.",
        data: domainPlans,
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói tên miền.",
        error: err.message
      });
    }
  },

  addDomainPlan: async (req, res) => {
    try {
      const { name, extension } = req.body;

      const existingPlan = await DomainPlan.findOne({ name, extension });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Tên miền đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new DomainPlan(req.body);
      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV Tên miền", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm gói tên miền thành công.",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm gói tên miền.",
        error: err.message
      });
    }
  },

  getDetailDomainPlan: async (req, res) => {
    try {
      const plan = await DomainPlan.findById(req.params.id).populate("supplier", "name company");

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói tên miền!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết gói tên miền thành công.",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói tên miền.",
        error: err.message
      });
    }
  },

  updateDomainPlan: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, extension } = req.body;

      const plan = await DomainPlan.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Tên miền không tồn tại!"
        });
      }

      if ((name && name !== plan.name) || (extension && extension !== plan.extension)) {
        const exists = await DomainPlan.findOne({ name, extension });
        if (exists && exists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên miền đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedPlan = await DomainPlan.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      ).populate("supplier", "name company");

      await logAction(req.auth._id, "Gói DV Tên miền", "Cập nhật", `/goi-dich-vu/ten-mien/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói tên miền thành công.",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói tên miền.",
        error: err.message
      });
    }
  },

  deleteDomainPlan: async (req, res) => {
    try {
      const deleted = await DomainPlan.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói tên miền để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV Tên miền", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói tên miền thành công."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói tên miền.",
        error: err.message
      });
    }
  }
};

module.exports = domainPlansController;
