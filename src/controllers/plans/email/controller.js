const EmailPlans = require("../../../models/plans/email/model");
const logAction = require("../../../middleware/actionLogs");

const calculateYearlyTotal = (price, vat = 0) => {
  const yearly = price * 12;
  return vat > 0 ? (price + (price * vat / 100)) * 12 : yearly;
};

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
          .populate("supplierId", "name company"),
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
    } catch (error) {
      console.error("GET /email-plans error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy danh sách gói email.",
        error: error.message
      });
    }
  },

  addEmailPlans: async (req, res) => {
    try {
      const { name, purchasePrice, retailPrice, vat } = req.body;

      const existing = await EmailPlans.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Tên gói email đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new EmailPlans({
        ...req.body,
        totalPurchaseWithoutVAT: purchasePrice * 12,
        totalPurchaseWithVAT: calculateYearlyTotal(purchasePrice, vat),
        totalRetailWithoutVAT: retailPrice * 12,
        totalRetailWithVAT: calculateYearlyTotal(retailPrice, vat)
      });

      const savedPlan = await newPlan.save();
      await logAction(req.auth._id, "Gói DV Email", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Tạo gói email thành công!",
        data: savedPlan
      });
    } catch (error) {
      console.error("POST /email-plans error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi tạo gói email.",
        error: error.message
      });
    }
  },

  getDetailEmailPlans: async (req, res) => {
    try {
      const plan = await EmailPlans.findById(req.params.id).populate("supplierId", "name company");

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
    } catch (error) {
      console.error("GET /email-plans/:id error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói email.",
        error: error.message
      });
    }
  },

  updateEmailPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, purchasePrice, retailPrice, vat } = req.body;

      const plan = await EmailPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói email không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const existed = await EmailPlans.findOne({ name });
        if (existed && existed._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói email đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updateData = {
        ...req.body,
        ...(purchasePrice !== undefined && retailPrice !== undefined && {
          totalPurchaseWithoutVAT: purchasePrice * 12,
          totalPurchaseWithVAT: calculateYearlyTotal(purchasePrice, vat),
          totalRetailWithoutVAT: retailPrice * 12,
          totalRetailWithVAT: calculateYearlyTotal(retailPrice, vat)
        })
      };

      const updatedPlan = await EmailPlans.findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .populate("supplierId", "name company");

      await logAction(req.auth._id, "Gói DV Email", "Cập nhật", `/goi-dich-vu/email/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói email thành công!",
        data: updatedPlan
      });
    } catch (error) {
      console.error("PUT /email-plans/:id error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói email.",
        error: error.message
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
    } catch (error) {
      console.error("DELETE /email-plans/:id error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói email.",
        error: error.message
      });
    }
  }
};

module.exports = emailPlansController;
