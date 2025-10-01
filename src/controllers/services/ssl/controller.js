const dayjs = require('dayjs');
const SslPlans = require("../../../models/plans/ssl/model");
const SslServices = require("../../../models/services/ssl/model");
const Contracts = require("../../../models/contracts/model");
const logAction = require("../../../middleware/actionLogs");
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText
} = require("../../../utils/serviceUtils");

const sslServicesController = {
  getSslServices: async(req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const keyword = req.query.keyword || '';
      const status = req.query.status ? parseInt(req.query.status) : undefined;

      const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

      if (!Number.isNaN(status) && [1, 2, 3].includes(status)) {
        const now = new Date();
        const soon = dayjs().add(30, 'day').toDate();
        if (status === 1) {
          filter.expiredAt = { $gt: soon };
        } else if (status === 2) {
          filter.expiredAt = { $gte: now, $lte: soon };
        } else if (status === 3) {
          filter.expiredAt = { $lt: now };
        }
      }

      const [sslServices, total] = await Promise.all([
        SslServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainServiceId', 'name')
          .populate('sslPlanId', 'name')
          .populate('customerId', 'fullName phoneNumber')
          .lean(),
        SslServices.countDocuments(filter)
      ]);

      const updatedSslServices = sslServices.map(ssl => {
        const daysUntilExpiry = calculateDaysUntilExpiry(ssl.expiredAt);
        const computedStatus = determineStatus(daysUntilExpiry);
        const statusText = getStatusText(computedStatus, daysUntilExpiry);
        return { ...ssl, status: computedStatus, daysUntilExpiry, statusText };
      });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ ssl thành công.",
        data: updatedSslServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch(err) {
      console.error("Error getting ssl services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ ssl."
      });
    }
  },

  addSslServices: async(req, res) => {
    try {
      const { domainServiceId, sslPlanId, customerId, periodValue, periodUnit, vatIncluded, registeredAt } = req.body;

      const exists = await SslServices.findOne({ domainServiceId });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền đã được đăng ký! Vui lòng chọn tên miền khác!"
        });
      }

      const plan = await SslPlans.findById(sslPlanId);
      let totalPrice = 0;
      let vatPrice = 0;

      if (sslPlanId && plan) {
        totalPrice = plan.retailPrice * periodValue;
        vatPrice = vatIncluded ? plan.totalRetailPriceWithVAT * periodValue : plan.retailPrice * periodValue;
      }

      const expiredAt = dayjs(registeredAt).add(periodValue, 'year').toDate();
      const daysUntilExpiry = calculateDaysUntilExpiry(expiredAt);
      const status = determineStatus(daysUntilExpiry);

      const newSslServices = new SslServices({
        ...req.body,
        totalPrice,
        vatPrice,
        registeredAt,
        expiredAt,
        daysUntilExpiry,
        status
      });

      await newSslServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(newSslServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ SSL', 'Thêm mới');
      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ ssl thành công.",
        data: {
          ...newSslServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error creating ssl service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ ssl."
      });
    }
  },

  getDetailSslServices: async(req, res) => {
    try {
      const sslServices = await SslServices.findById(req.params.id);
      if (!sslServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ ssl."
        });
      }
      const daysUntilExpiry = calculateDaysUntilExpiry(sslServices.expiredAt);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ ssl thành công.",
        data: {
          ...sslServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(sslServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error getting ssl service detail:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ ssl."
      });
    }
  },

  updateSslServices: async(req, res) => {
    try {
      const sslServices = await SslServices.findById(req.params.id);
      if (!sslServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ ssl."
        });
      }

      if (req.body.periodValue) {
        if (req.body.expiredAt) {
          sslServices.expiredAt = dayjs(new Date(req.body.expiredAt))
            .add(req.body.periodValue, 'year')
            .toDate();
        } else {
          const startDate = sslServices.expiredAt && sslServices.status !== 3
            ? sslServices.expiredAt
            : new Date();
          sslServices.expiredAt = dayjs(startDate)
            .add(req.body.periodValue, 'year')
            .toDate();
        }
        sslServices.periodValue = req.body.periodValue;

        const plan = await SslPlans.findById(sslServices.sslPlanId);
        sslServices.totalPrice = plan.retailPrice * req.body.periodValue;

        if (req.body.vatIncluded) {
          sslServices.vatPrice = plan.totalRetailPriceWithVAT * req.body.periodValue;
        } else {
          sslServices.vatPrice = plan.retailPrice * req.body.periodValue;
        }
      }

      Object.keys(req.body).forEach(key => {
        if (key !== 'periodValue' && key !== 'expiredAt') {
          sslServices[key] = req.body[key];
        }
      });

      const daysUntilExpiry = calculateDaysUntilExpiry(sslServices.expiredAt);
      sslServices.status = determineStatus(daysUntilExpiry);
      await sslServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(sslServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ SSL', 'Cập nhật', `/dich-vu/ssl/${req.params.id}`);
      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ ssl thành công.",
        data: {
          ...sslServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(sslServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error updating ssl service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ ssl."
      });
    }
  },

  deleteSslServices: async(req, res) => {
    try {
      const deleted = await SslServices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ ssl."
        });
      }

      await logAction(req.auth._id, 'Dịch vụ SSL', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ ssl thành công."
      });
    } catch(err) {
      console.error("Error deleting ssl service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ ssl."
      });
    }
  },
}

module.exports = sslServicesController;