const dayjs = require('dayjs');
const EmailPlans = require("../../../models/plans/email/model");
const EmailServices = require("../../../models/services/email/model");
const Contracts = require("../../../models/contracts/model");
const logAction = require("../../../middleware/actionLogs");
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText
} = require("../../../utils/serviceUtils");

const emailServicesController = {
  getEmailServices: async(req, res) => {
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

      const [emailServices, total] = await Promise.all([
        EmailServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainServiceId', 'name')
          .populate('emailPlanId', 'name')
          .populate('customerId', 'fullName phoneNumber')
          .lean(),
        EmailServices.countDocuments(filter)
      ]);

      const updatedEmailServices = emailServices.map(email => {
        const daysUntilExpiry = calculateDaysUntilExpiry(email.expiredAt);
        const computedStatus = determineStatus(daysUntilExpiry);
        const statusText = getStatusText(computedStatus, daysUntilExpiry);
        return { ...email, status: computedStatus, daysUntilExpiry, statusText };
      });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ email thành công.",
        data: updatedEmailServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch(err) {
      console.error("Error getting email services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ email."
      });
    }
  },

  addEmailServices: async(req, res) => {
    try {
      const { domainServiceId, emailPlanId, customerId, periodValue, periodUnit, vatIncluded, registeredAt } = req.body;

      const exists = await EmailServices.findOne({ domainServiceId });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền đã được đăng ký! Vui lòng chọn tên miền khác!"
        });
      }

      const plan = await EmailPlans.findById(emailPlanId);
      let totalPrice = 0;
      let vatPrice = 0;

      if (emailPlanId && plan) {
        totalPrice = (plan.retailPrice * 12) * periodValue;
        vatPrice = vatIncluded ? (plan.totalRetailWithVAT * 12) * periodValue : (plan.purchasePrice * 12) * periodValue;
      }

      const expiredAt = dayjs(registeredAt).add(periodValue, 'year').toDate();
      const daysUntilExpiry = calculateDaysUntilExpiry(expiredAt);
      const status = determineStatus(daysUntilExpiry);

      const newEmailServices = new EmailServices({
        ...req.body,
        totalPrice,
        vatPrice,
        registeredAt,
        expiredAt,
        daysUntilExpiry,
        status
      });

      await newEmailServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(newEmailServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ Email', 'Thêm mới');
      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ email thành công.",
        data: {
          ...newEmailServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error creating email service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ email."
      });
    }
  },

  getDetailEmailServices: async(req, res) => {
    try {
      const emailServices = await EmailServices.findById(req.params.id);
      if (!emailServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ email."
        });
      }
      const daysUntilExpiry = calculateDaysUntilExpiry(emailServices.expiredAt);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ email thành công.",
        data: {
          ...emailServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(emailServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error getting email service detail:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ email."
      });
    }
  },

  updateEmailServices: async(req, res) => {
    try {
      const emailServices = await EmailServices.findById(req.params.id);
      if (!emailServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ email để cập nhật."
        });
      }

      if (req.body.periodValue) {
        if (req.body.expiredAt) {
          emailServices.expiredAt = dayjs(new Date(req.body.expiredAt))
            .add(req.body.periodValue, 'year')
            .toDate();
        } else {
          const startDate = emailServices.expiredAt && emailServices.status !== 3
            ? emailServices.expiredAt
            : new Date();
          emailServices.expiredAt = dayjs(startDate)
            .add(req.body.periodValue, 'year')
            .toDate();
        }
        emailServices.periodValue = req.body.periodValue;

        const plan = await EmailPlans.findById(emailServices.emailPlanId);
        emailServices.totalPrice = (plan.retailPrice * 12) * req.body.periodValue;

        if (req.body.vatIncluded) {
          emailServices.vatPrice = (plan.totalRetailWithVAT * 12) * req.body.periodValue;
        } else {
          emailServices.vatPrice = (plan.purchasePrice * 12) * req.body.periodValue;
        }
      }

      Object.keys(req.body).forEach(key => {
        if (key !== 'periodValue' && key !== 'expiredAt') {
          emailServices[key] = req.body[key];
        }
      });

      const daysUntilExpiry = calculateDaysUntilExpiry(emailServices.expiredAt);
      emailServices.status = determineStatus(daysUntilExpiry);
      await emailServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(emailServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ Email', 'Cập nhật', `/dich-vu/email/${req.params.id}`);
      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ email thành công.",
        data: {
          ...emailServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(emailServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error updating email service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ email."
      });
    }
  },

  deleteEmailServices: async(req, res) => {
    try {
      const deleted = await EmailServices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ email để xóa."
        });
      }

      await logAction(req.auth._id, 'Dịch vụ Email', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ email thành công."
      });
    } catch(err) {
      console.error("Error deleting email service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ email."
      });
    }
  },
}

module.exports = emailServicesController;