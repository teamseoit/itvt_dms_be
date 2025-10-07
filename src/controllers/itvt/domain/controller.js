const dayjs = require('dayjs');
const DomainPlans = require("../../../models/plans/domain/model");
const ItvtDomainServices = require("../../../models/itvt/domain/model");
const ItvtEmailServices = require("../../../models/itvt/email/model");
const ItvtHostingServices = require("../../../models/itvt/hosting/model");
const ItvtSslServices = require("../../../models/itvt/ssl/model");
const logAction = require("../../../middleware/actionLogs");
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText
} = require("../../../utils/serviceUtils");

const itvtDomainServicesController = {
  getItvtDomainServices: async (req, res) => {
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

      const [domainServices, total] = await Promise.all([
        ItvtDomainServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainPlanId', 'name extension')
          .populate('serverPlanId', 'name ipAddress')
          .populate('customerId', 'fullName phoneNumber')
          .lean(),
        ItvtDomainServices.countDocuments(filter)
      ]);

      const updatedDomainServices = domainServices.map(domain => {
        const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);
        const computedStatus = determineStatus(daysUntilExpiry);
        const statusText = getStatusText(computedStatus, daysUntilExpiry);
        return { ...domain, status: computedStatus, daysUntilExpiry, statusText };
      });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ tên miền ITVT thành công.",
        data: updatedDomainServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Error getting ITVT domain services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ tên miền ITVT."
      });
    }
  },

  addItvtDomainServices: async (req, res) => {
    try {
      const { name, registeredAt, periodValue, domainPlanId, vatIncluded } = req.body;

      const exists = await ItvtDomainServices.findOne({ name });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền ITVT đăng ký đã tồn tại! Vui lòng nhập tên miền khác!"
        });
      }

      const plan = await DomainPlans.findById(domainPlanId);
      let retailPrice = 0;
      let vatPrice = 0;

      if (domainPlanId && plan) {
        retailPrice = plan.retailPrice;
        vatPrice = vatIncluded ? plan.vatPrice : plan.purchasePrice;
      }

      const totalPrice = retailPrice * periodValue;
      vatPrice = vatPrice * periodValue;

      const expiredAt = dayjs(registeredAt).add(periodValue, 'year').toDate();
      const daysUntilExpiry = calculateDaysUntilExpiry(expiredAt);
      const status = determineStatus(daysUntilExpiry);

      const newDomain = await ItvtDomainServices.create({
        ...req.body,
        expiredAt,
        status,
        totalPrice,
        vatPrice
      });

      await logAction(req.auth._id, 'Dịch vụ Tên miền ITVT', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ tên miền ITVT thành công.",
        data: {
          ...newDomain.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(status, daysUntilExpiry)
        }
      });
    } catch (err) {
      console.error("Error creating ITVT domain service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ tên miền ITVT."
      });
    }
  },

  getDetailItvtDomainServices: async (req, res) => {
    try {
      const domain = await ItvtDomainServices.findById(req.params.id);
      if (!domain) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền ITVT."
        });
      }

      const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ tên miền ITVT thành công.",
        data: {
          ...domain.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(domain.status, daysUntilExpiry)
        }
      });
    } catch (err) {
      console.error("Error fetching ITVT domain service details:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ tên miền ITVT."
      });
    }
  },

  updateItvtDomainServices: async (req, res) => {
    try {
      const domain = await ItvtDomainServices.findById(req.params.id);
      if (!domain) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền ITVT để cập nhật."
        });
      }

      if (req.body.periodValue) {
        if (req.body.expiredAt) {
          domain.expiredAt = dayjs(new Date(req.body.expiredAt))
            .add(req.body.periodValue, 'year')
            .toDate();
        } else {
          const startDate = domain.expiredAt && domain.status !== 3
            ? domain.expiredAt
            : new Date();
          
          domain.expiredAt = dayjs(startDate)
            .add(req.body.periodValue, domain.periodUnit.toLowerCase())
            .toDate();
        }
        domain.periodValue = req.body.periodValue;
        const plan = await DomainPlans.findById(domain.domainPlanId);
        domain.totalPrice = plan.retailPrice * req.body.periodValue;
        if (req.body.vatIncluded) {
          domain.vatPrice = plan.vatPrice * req.body.periodValue;
        } else {
          domain.vatPrice = plan.purchasePrice * req.body.periodValue;
        }
      }

      Object.keys(req.body).forEach(key => {
        if (key !== 'periodValue' && key !== 'expiredAt') {
          domain[key] = req.body[key];
        }
      });

      const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);
      domain.status = determineStatus(daysUntilExpiry);
      await domain.save();

      await logAction(req.auth._id, 'Dịch vụ Tên miền ITVT', 'Cập nhật', `/itvt/dich-vu/ten-mien/${req.params.id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ tên miền ITVT thành công.",
        data: {
          ...domain.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(domain.status, daysUntilExpiry)
        }
      });
    } catch (err) {
      console.error("Error updating ITVT domain service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ tên miền ITVT."
      });
    }
  },

  deleteItvtDomainServices: async (req, res) => {
    try {
      const domainId = req.params.id;
      
      // Kiểm tra xem domain có tồn tại không
      const domain = await ItvtDomainServices.findById(domainId);
      if (!domain) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền ITVT để xóa."
        });
      }

      // Kiểm tra xem domain có đang được sử dụng trong các service khác không
      const [emailServices, hostingServices, sslServices] = await Promise.all([
        ItvtEmailServices.findOne({ domainServiceId: domainId }),
        ItvtHostingServices.findOne({ domainServiceId: domainId }),
        ItvtSslServices.findOne({ domainServiceId: domainId })
      ]);

      if (emailServices || hostingServices || sslServices) {
        const usedInServices = [];
        if (emailServices) usedInServices.push('Email');
        if (hostingServices) usedInServices.push('Hosting');
        if (sslServices) usedInServices.push('SSL');
        
        return res.status(400).json({
          success: false,
          message: `Không thể xóa tên miền này vì đang được sử dụng trong dịch vụ: ${usedInServices.join(', ')}.`
        });
      }

      // Nếu không có service nào sử dụng domain này, tiến hành xóa
      const deleted = await ItvtDomainServices.findByIdAndDelete(domainId);

      await logAction(req.auth._id, 'Dịch vụ Tên miền ITVT', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ tên miền ITVT thành công."
      });
    } catch (err) {
      console.error("Error deleting ITVT domain service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ tên miền ITVT."
      });
    }
  }
};

module.exports = itvtDomainServicesController;
