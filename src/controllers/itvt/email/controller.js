const dayjs = require('dayjs');
const EmailPlans = require("../../../models/plans/email/model");
const ItvtEmailServices = require("../../../models/itvt/email/model");
const logAction = require("../../../middleware/actionLogs");
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText
} = require("../../../utils/serviceUtils");

const itvtEmailServicesController = {
  getItvtEmailServices: async(req, res) => {
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
        ItvtEmailServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainServiceId', 'name')
          .populate('emailPlanId', 'name')
          .populate('customerId', 'fullName phoneNumber')
          .lean(),
        ItvtEmailServices.countDocuments(filter)
      ]);

      const updatedEmailServices = emailServices.map(email => {
        const daysUntilExpiry = calculateDaysUntilExpiry(email.expiredAt);
        const computedStatus = determineStatus(daysUntilExpiry);
        const statusText = getStatusText(computedStatus, daysUntilExpiry);
        return { ...email, status: computedStatus, daysUntilExpiry, statusText };
      });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ Email ITVT thành công.",
        data: updatedEmailServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch(err) {
      console.error("Error getting ITVT Email services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ Email ITVT."
      });
    }
  },

  addItvtEmailServices: async(req, res) => {
    try {
      const { domainServiceId, emailPlanId, customerId, periodValue, periodUnit, vatIncluded, registeredAt } = req.body;

      const exists = await ItvtEmailServices.findOne({ domainServiceId });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền ITVT đã được đăng ký Email! Vui lòng chọn tên miền khác!"
        });
      }

      const plan = await EmailPlans.findById(emailPlanId);
      let totalPrice = 0;
      let vatPrice = 0;

      if (emailPlanId && plan) {
        totalPrice = plan.retailPrice * periodValue;
        vatPrice = vatIncluded ? plan.totalRetailWithVAT * periodValue : plan.purchasePrice * periodValue;
      }

      const expiredAt = dayjs(registeredAt).add(periodValue, 'year').toDate();
      const daysUntilExpiry = calculateDaysUntilExpiry(expiredAt);
      const status = determineStatus(daysUntilExpiry);

      const newEmailServices = new ItvtEmailServices({
        ...req.body,
        totalPrice,
        vatPrice,
        registeredAt,
        expiredAt,
        daysUntilExpiry,
        status
      });

      await newEmailServices.save();

      await logAction(req.auth._id, 'Dịch vụ Email ITVT', 'Thêm mới');
      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ Email ITVT thành công.",
        data: {
          ...newEmailServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error creating ITVT Email service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ Email ITVT."
      });
    }
  },

  getDetailItvtEmailServices: async(req, res) => {
    try {
      const emailServices = await ItvtEmailServices.findById(req.params.id);
      if (!emailServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ Email ITVT."
        });
      }
      const daysUntilExpiry = calculateDaysUntilExpiry(emailServices.expiredAt);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ Email ITVT thành công.",
        data: {
          ...emailServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(emailServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error getting ITVT Email service detail:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ Email ITVT."
      });
    }
  },

  updateItvtEmailServices: async(req, res) => {
    try {
      const emailServices = await ItvtEmailServices.findById(req.params.id);
      if (!emailServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ Email ITVT để cập nhật."
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
        emailServices.totalPrice = plan.retailPrice * req.body.periodValue;

        if (req.body.vatIncluded) {
          emailServices.vatPrice = plan.totalRetailWithVAT * req.body.periodValue;
        } else {
          emailServices.vatPrice = plan.purchasePrice * req.body.periodValue;
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

      await logAction(req.auth._id, 'Dịch vụ Email ITVT', 'Cập nhật', `/itvt/dich-vu/email/${req.params.id}`);
      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ Email ITVT thành công.",
        data: {
          ...emailServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(emailServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error updating ITVT Email service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ Email ITVT."
      });
    }
  },

  deleteItvtEmailServices: async(req, res) => {
    try {
      const deleted = await ItvtEmailServices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ Email ITVT để xóa."
        });
      }

      await logAction(req.auth._id, 'Dịch vụ Email ITVT', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ Email ITVT thành công."
      });
    } catch(err) {
      console.error("Error deleting ITVT Email service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ Email ITVT."
      });
    }
  },
}

module.exports = itvtEmailServicesController;
