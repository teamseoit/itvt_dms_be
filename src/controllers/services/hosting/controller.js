const dayjs = require('dayjs');
const HostingPlans = require("../../../models/plans/hosting/model");
const HostingServices = require("../../../models/services/hosting/model");
const Contracts = require("../../../models/contracts/model");
const logAction = require("../../../middleware/actionLogs");
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText
} = require("../../../utils/serviceUtils");

const hostingServicesController = {
  getHostingServices: async(req, res) => {
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

      const [hostingServices, total] = await Promise.all([
        HostingServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainServiceId', 'name')
          .populate('hostingPlanId', 'name')
          .populate('customerId', 'fullName phoneNumber')
          .lean(),
        HostingServices.countDocuments(filter)
      ]);

      const updatedHostingServices = hostingServices.map(hosting => {
        const daysUntilExpiry = calculateDaysUntilExpiry(hosting.expiredAt);
        const computedStatus = determineStatus(daysUntilExpiry);
        const statusText = getStatusText(computedStatus, daysUntilExpiry);
        return { ...hosting, status: computedStatus, daysUntilExpiry, statusText };
      });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ hosting thành công.",
        data: updatedHostingServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch(err) {
      console.error("Error getting hosting services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ hosting."
      });
    }
  },

  addHostingServices: async(req, res) => {
    try {
      const { domainServiceId, hostingPlanId, customerId, periodValue, periodUnit, vatIncluded, registeredAt } = req.body;

      const exists = await HostingServices.findOne({ domainServiceId });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền đã được đăng ký! Vui lòng chọn tên miền khác!"
        });
      }

      const plan = await HostingPlans.findById(hostingPlanId);
      let totalPrice = 0;
      let vatPrice = 0;

      if (hostingPlanId && plan) {
        totalPrice = plan.totalPrice * periodValue;
        vatPrice = vatIncluded ? plan.vatPrice * periodValue : plan.purchasePrice * periodValue;
      }

      const expiredAt = dayjs(registeredAt).add(periodValue, 'year').toDate();
      const daysUntilExpiry = calculateDaysUntilExpiry(expiredAt);
      const status = determineStatus(daysUntilExpiry);

      const newHostingServices = new HostingServices({
        ...req.body,
        totalPrice,
        vatPrice,
        registeredAt,
        expiredAt,
        daysUntilExpiry,
        status
      });

      await newHostingServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(newHostingServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ Hosting', 'Thêm mới');
      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ hosting thành công.",
        data: {
          ...newHostingServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error creating hosting service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ hosting."
      });
    }
  },

  getDetailHostingServices: async(req, res) => {
    try {
      const hostingServices = await HostingServices.findById(req.params.id);
      if (!hostingServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ hosting."
        });
      }
      const daysUntilExpiry = calculateDaysUntilExpiry(hostingServices.expiredAt);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ hosting thành công.",
        data: {
          ...hostingServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(hostingServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error getting hosting service detail:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ hosting."
      });
    }
  },

  updateHostingServices: async(req, res) => {
    try {
      const hostingServices = await HostingServices.findById(req.params.id);
      if (!hostingServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ hosting để cập nhật."
        });
      }

      if (req.body.periodValue) {
        if (req.body.expiredAt) {
          hostingServices.expiredAt = dayjs(new Date(req.body.expiredAt))
            .add(req.body.periodValue, 'year')
            .toDate();
        } else {
          const startDate = hostingServices.expiredAt && hostingServices.status !== 3
            ? hostingServices.expiredAt
            : new Date();
          hostingServices.expiredAt = dayjs(startDate)
            .add(req.body.periodValue, 'year')
            .toDate();
        }
        hostingServices.periodValue = req.body.periodValue;

        const plan = await HostingPlans.findById(hostingServices.hostingPlanId);
        hostingServices.totalPrice = plan.totalPrice * req.body.periodValue;

        if (req.body.vatIncluded) {
          hostingServices.vatPrice = plan.vatPrice * req.body.periodValue;
        } else {
          hostingServices.vatPrice = plan.purchasePrice * req.body.periodValue;
        }
      }

      Object.keys(req.body).forEach(key => {
        if (key !== 'periodValue' && key !== 'expiredAt') {
          hostingServices[key] = req.body[key];
        }
      });

      const daysUntilExpiry = calculateDaysUntilExpiry(hostingServices.expiredAt);
      hostingServices.status = determineStatus(daysUntilExpiry);
      await hostingServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(hostingServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ Hosting', 'Cập nhật', `/dich-vu/hosting/${req.params.id}`);
      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ hosting thành công.",
        data: {
          ...hostingServices.toObject(),
          daysUntilExpiry,
          statusText: getStatusText(hostingServices.status, daysUntilExpiry)
        }
      });
    } catch(err) {
      console.error("Error updating hosting service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ hosting."
      });
    }
  },

  deleteHostingServices: async(req, res) => {
    try {
      const deleted = await HostingServices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ hosting để xóa."
        });
      }

      await logAction(req.auth._id, 'Dịch vụ Hosting', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ hosting thành công."
      });
    } catch(err) {
      console.error("Error deleting hosting service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ hosting."
      });
    }
  },
}

module.exports = hostingServicesController;