const dayjs = require('dayjs');
const DomainPlans = require("../../../models/plans/domain/model");
const DomainServices = require("../../../models/services/domain/model");
const Contracts = require("../../../models/contracts/model");
const logAction = require("../../../middleware/actionLogs");
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText
} = require("../../../utils/serviceUtils");

const domainServicesController = {
  getDomainServices: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const keyword = req.query.keyword || '';

      const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

      const [domainServices, total] = await Promise.all([
        DomainServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainPlanId', 'name extension')
          .populate('serverPlanId', 'name ipAddress')
          .populate('customerId', 'fullName phoneNumber')
          .lean(),
        DomainServices.countDocuments(filter)
      ]);

      const updatedDomainServices = domainServices.map(domain => {
        const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);
        const statusText = getStatusText(domain.status, daysUntilExpiry);
        return { ...domain, daysUntilExpiry, statusText };
      });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ tên miền thành công.",
        data: updatedDomainServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Error getting domain services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ tên miền."
      });
    }
  },

  addDomainServices: async (req, res) => {
    try {
      const { name, registeredAt, periodValue, domainPlanId, vatIncluded } = req.body;

      const exists = await DomainServices.findOne({ name });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền đăng ký đã tồn tại! Vui lòng nhập tên miền khác!"
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

      const newDomain = await DomainServices.create({
        ...req.body,
        expiredAt,
        status,
        totalPrice,
        vatPrice
      });

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(newDomain.customerId);

      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ tên miền thành công.",
        data: {
          ...newDomain.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(status, daysUntilExpiry)
        }
      });
    } catch (err) {
      console.error("Error creating domain service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ tên miền."
      });
    }
  },

  getDetailDomainServices: async (req, res) => {
    try {
      const domain = await DomainServices.findById(req.params.id);
      if (!domain) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền."
        });
      }

      const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ tên miền thành công.",
        data: {
          ...domain.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(domain.status, daysUntilExpiry)
        }
      });
    } catch (err) {
      console.error("Error fetching domain service details:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ tên miền."
      });
    }
  },

  updateDomainServices: async (req, res) => {
    try {
      const domain = await DomainServices.findById(req.params.id);
      if (!domain) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền để cập nhật."
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
      }

      Object.keys(req.body).forEach(key => {
        if (key !== 'periodValue' && key !== 'expiredAt') {
          domain[key] = req.body[key];
        }
      });

      const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);
      domain.status = determineStatus(daysUntilExpiry);
      await domain.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(domain.customerId);

      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Cập nhật', `/dich-vu/ten-mien/${req.params.id}`);

      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ tên miền thành công.",
        data: {
          ...domain.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(domain.status, daysUntilExpiry)
        }
      });
    } catch (err) {
      console.error("Error updating domain service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ tên miền."
      });
    }
  },

  deleteDomainServices: async (req, res) => {
    try {
      const deleted = await DomainServices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền để xóa."
        });
      }

      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ tên miền thành công."
      });
    } catch (err) {
      console.error("Error deleting domain service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ tên miền."
      });
    }
  }
};

module.exports = domainServicesController;
