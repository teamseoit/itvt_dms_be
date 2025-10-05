const dayjs = require('dayjs');
const WebsiteServices = require("../../../models/services/website/model");
const DomainServices = require("../../../models/services/domain/model");
const DomainPlans = require("../../../models/plans/domain/model");
const Contracts = require("../../../models/contracts/model");
const logAction = require("../../../middleware/actionLogs");

const websiteServicesController = {
  getWebsiteServices: async(req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const keyword = req.query.keyword || '';
      const status = req.query.status ? parseInt(req.query.status) : undefined;

      // Tạo pipeline aggregation
      const pipeline = [
        {
          $lookup: {
            from: 'domainservices',
            localField: 'domainServiceId',
            foreignField: '_id',
            as: 'domainService'
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $lookup: {
            from: 'domainplans',
            localField: 'domainPlanId',
            foreignField: '_id',
            as: 'domainPlan'
          }
        },
        {
          $lookup: {
            from: 'suppliers',
            localField: 'domainSupplierId',
            foreignField: '_id',
            as: 'domainSupplier'
          }
        },
        {
          $addFields: {
            domainServiceName: { $arrayElemAt: ['$domainService.name', 0] },
            customerFullName: { $arrayElemAt: ['$customer.fullName', 0] },
            customerPhoneNumber: { $arrayElemAt: ['$customer.phoneNumber', 0] }
          }
        }
      ];

      // Thêm filter cho keyword nếu có
      if (keyword) {
        pipeline.push({
          $match: {
            $or: [
              { domainServiceName: { $regex: keyword, $options: 'i' } },
              { customerFullName: { $regex: keyword, $options: 'i' } },
              { customerPhoneNumber: { $regex: keyword, $options: 'i' } }
            ]
          }
        });
      }

      // Thêm filter cho status nếu có
      if (!Number.isNaN(status) && [1, 2].includes(status)) {
        const now = new Date();
        if (status === 1) {
          pipeline.push({ $match: { endDate: { $gte: now } } });  // Hoạt động (chưa hết hạn)
        } else if (status === 2) {
          pipeline.push({ $match: { endDate: { $lt: now } } });  // Đã hết hạn
        }
      }

      // Thêm sort, skip, limit và project
      pipeline.push(
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            name: 1,
            domainServiceId: 1,
            customerId: 1,
            price: 1,
            status: 1,
            endDate: 1,
            createdAt: 1,
            updatedAt: 1,
            domainPlanId: 1,
            domainSupplierId: 1,
            domainServiceId: {
              _id: '$domainServiceId',
              name: { $arrayElemAt: ['$domainService.name', 0] }
            },
            domainPlanId: {
              _id: '$domainPlanId',
              extension: { $arrayElemAt: ['$domainPlan.extension', 0] },
              purchasePrice: { $arrayElemAt: ['$domainPlan.purchasePrice', 0] },
              retailPrice: { $arrayElemAt: ['$domainPlan.retailPrice', 0] }
            },
            domainSupplierId: {
              _id: '$domainSupplierId',
              name: { $arrayElemAt: ['$domainSupplier.name', 0] },
              company: { $arrayElemAt: ['$domainSupplier.company', 0] }
            },
            customerId: {
              _id: '$customerId',
              fullName: { $arrayElemAt: ['$customer.fullName', 0] },
              phoneNumber: { $arrayElemAt: ['$customer.phoneNumber', 0] }
            }
          }
        }
      );

      // Pipeline để đếm tổng số documents
      const countPipeline = pipeline.slice(0, -3); // Bỏ sort, skip, limit
      countPipeline.push({ $count: 'total' });

      const [websiteServices, countResult] = await Promise.all([
        WebsiteServices.aggregate(pipeline),
        WebsiteServices.aggregate(countPipeline)
      ]);

      const total = countResult.length > 0 ? countResult[0].total : 0;

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ website thành công.",
        data: websiteServices,
        meta: {
          page, limit, totalDocs: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch(err) {
      console.error("Error getting website services:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ website."
      });
    }
  },

  addWebsiteServices: async(req, res) => {
    try {
      const { domainServiceId, customerId, price, status } = req.body;

      const exists = await WebsiteServices.findOne({ domainServiceId });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Tên miền đã được đăng ký! Vui lòng chọn tên miền khác!"
        });
      }

      // Lấy domainPlanId và supplierId từ domainServiceId
      const domainService = await DomainServices.findById(domainServiceId);
      if (!domainService) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ domain!"
        });
      }

      const domainPlan = await DomainPlans.findById(domainService.domainPlanId);
      if (!domainPlan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói domain!"
        });
      }

      // Xử lý endDate dựa trên status
      let endDate = null;
      if (status === 1) {
        // Status = 1 (Hoạt động): endDate = null
        endDate = null;
      } else if (status === 2) {
        // Status = 2 (Đã hết hạn): endDate = ngày hiện tại
        endDate = new Date();
      }

      const newWebsiteServices = new WebsiteServices({
        ...req.body,
        domainPlanId: domainService.domainPlanId,
        domainSupplierId: domainPlan.supplierId,
        endDate: endDate
      });

      await newWebsiteServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(newWebsiteServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ Website', 'Thêm mới');
      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ website thành công.",
        data: newWebsiteServices
      });
    } catch(err) {
      console.error("Error creating website service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm dịch vụ website."
      });
    }
  },

  getDetailWebsiteServices: async(req, res) => {
    try {
      const websiteServices = await WebsiteServices.findById(req.params.id)
        .populate('domainServiceId', 'name')
        .populate('domainPlanId', 'extension purchasePrice retailPrice')
        .populate('domainSupplierId', 'name company')
        .populate('customerId', 'fullName phoneNumber');
        
      if (!websiteServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ website."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ website thành công.",
        data: websiteServices
      });
    } catch(err) {
      console.error("Error getting website service detail:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết dịch vụ website."
      });
    }
  },

  updateWebsiteServices: async(req, res) => {
    try {
      const websiteServices = await WebsiteServices.findById(req.params.id);
      if (!websiteServices) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ website."
        });
      }

      Object.keys(req.body).forEach(key => {
        websiteServices[key] = req.body[key];
      });

      // Nếu domainServiceId thay đổi, cập nhật lại domainPlanId và domainSupplierId
      if (req.body.domainServiceId && req.body.domainServiceId !== websiteServices.domainServiceId.toString()) {
        const domainService = await DomainServices.findById(req.body.domainServiceId);
        if (domainService) {
          const domainPlan = await DomainPlans.findById(domainService.domainPlanId);
          if (domainPlan) {
            websiteServices.domainPlanId = domainService.domainPlanId;
            websiteServices.domainSupplierId = domainPlan.supplierId;
          }
        }
      }

      // Xử lý endDate dựa trên status
      if (req.body.status === 1) {
        // Status = 1 (Hoạt động): Reset endDate về null
        websiteServices.endDate = null;
      } else if (req.body.status === 2) {
        // Status = 2 (Đã hết hạn): Set endDate = ngày hiện tại
        websiteServices.endDate = new Date();
      }

      await websiteServices.save();

      // Cập nhật lại thông tin tài chính của contract
      await Contracts.recalculateFinancials(websiteServices.customerId);

      await logAction(req.auth._id, 'Dịch vụ Website', 'Cập nhật', `/dich-vu/website/${req.params.id}`);
      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ website thành công.",
        data: websiteServices
      });
    } catch(err) {
      console.error("Error updating website service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật dịch vụ website."
      });
    }
  },

  deleteWebsiteServices: async(req, res) => {
    try {
      const deleted = await WebsiteServices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ website."
        });
      }

      await logAction(req.auth._id, 'Dịch vụ Website', 'Xóa');
      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ website thành công."
      });
    } catch(err) {
      console.error("Error deleting website service:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa dịch vụ website."
      });
    }
  },
}

module.exports = websiteServicesController;