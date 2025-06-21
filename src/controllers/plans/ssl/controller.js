const SSLPlans = require("../../../models/plans/ssl/model");
const logAction = require("../../../middleware/actionLogs");

const calculateWithVAT = (price, vat) => {
  if (!vat || vat <= 0) return price;
  return price + price * (vat / 100);
};

const sslPlansController = {
  getSslPlans: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [plans, totalDocs] = await Promise.all([
        SSLPlans.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("supplierId", "name company"),
        SSLPlans.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách gói SSL thành công!",
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
        message: "Đã xảy ra lỗi khi lấy danh sách gói SSL.",
        error: err.message
      });
    }
  },

  addSslPlans: async (req, res) => {
    try {
      const { name, purchasePrice, retailPrice, vat } = req.body;

      const exists = await SSLPlans.findOne({ name });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên gói SSL đã tồn tại! Vui lòng nhập tên khác!"
        });
      }

      const newPlan = new SSLPlans({
        ...req.body,
        totalPurchasePriceWithVAT: calculateWithVAT(purchasePrice, vat),
        totalRetailPriceWithVAT: calculateWithVAT(retailPrice, vat)
      });

      const savedPlan = await newPlan.save();

      await logAction(req.auth._id, "Gói DV SSL", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Tạo gói SSL thành công!",
        data: savedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi tạo gói SSL.",
        error: err.message
      });
    }
  },

  getDetailSslPlans: async (req, res) => {
    try {
      const plan = await SSLPlans.findById(req.params.id).populate("supplierId", "name company");
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói SSL!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy thông tin gói SSL thành công!",
        data: plan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết gói SSL.",
        error: err.message
      });
    }
  },

  updateSslPlans: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, purchasePrice, retailPrice, vat } = req.body;

      const plan = await SSLPlans.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Gói SSL không tồn tại!"
        });
      }

      if (name && name !== plan.name) {
        const nameExists = await SSLPlans.findOne({ name });
        if (nameExists && nameExists._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Tên gói SSL đã tồn tại! Vui lòng nhập tên khác!"
          });
        }
      }

      const updatedData = {
        ...req.body,
        totalPurchasePriceWithVAT: calculateWithVAT(purchasePrice ?? plan.purchasePrice, vat ?? plan.vat),
        totalRetailPriceWithVAT: calculateWithVAT(retailPrice ?? plan.retailPrice, vat ?? plan.vat)
      };

      const updatedPlan = await SSLPlans.findByIdAndUpdate(id, { $set: updatedData }, { new: true })
        .populate("supplierId", "name company");

      await logAction(req.auth._id, "Gói DV SSL", "Cập nhật", `/goi-dich-vu/ssl/${id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật gói SSL thành công!",
        data: updatedPlan
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật gói SSL.",
        error: err.message
      });
    }
  },

  deleteSslPlans: async (req, res) => {
    try {
      const deleted = await SSLPlans.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói SSL để xóa."
        });
      }

      await logAction(req.auth._id, "Gói DV SSL", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa gói SSL thành công!"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa gói SSL.",
        error: err.message
      });
    }
  }
};

module.exports = sslPlansController;
