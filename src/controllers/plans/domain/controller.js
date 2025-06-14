const DomainPlan = require("../../../models/plans/domain/model");
const DomainServices = require("../../../models/services/domain/model");
const EmailServices = require("../../../models/services/email/model");
const HostingServices = require("../../../models/services/hosting/model");
const WebsiteServices = require("../../../models/services/website/model");
const SslServices = require("../../../models/services/ssl/model");
const MaintenanceServices = require("../../../models/services/maintenance/model");
const DomainITVT = require("../../../models/itvt/domain/model");
const SslITVT = require("../../../models/itvt/ssl/model");
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
      const { id } = req.params;

      // Kiểm tra xem gói tên miền có tồn tại không
      const plan = await DomainPlan.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy gói tên miền để xóa."
        });
      }

      // Kiểm tra xem gói tên miền có đang được sử dụng không
      const [
        domainServicesCount,
        emailServicesCount,
        hostingServicesCount,
        websiteServicesCount,
        sslServicesCount,
        maintenanceServicesCount,
        domainITVTCount,
        sslITVTCount
      ] = await Promise.all([
        DomainServices.countDocuments({ domainPlan: id }),
        EmailServices.countDocuments({ domain_plan_id: id }),
        HostingServices.countDocuments({ domain_plan_id: id }),
        WebsiteServices.countDocuments({ domain_plan_id: id }),
        SslServices.countDocuments({ domain_plan_id: id }),
        MaintenanceServices.countDocuments({ domain_plan_id: id }),
        DomainITVT.countDocuments({ domain_plan_id: id }),
        SslITVT.countDocuments({ domain_plan_id: id })
      ]);

      const totalUsage = domainServicesCount + emailServicesCount + hostingServicesCount + 
                        websiteServicesCount + sslServicesCount + maintenanceServicesCount + 
                        domainITVTCount + sslITVTCount;

      if (totalUsage > 0) {
        return res.status(400).json({
          success: false,
          message: `Không thể xóa gói tên miền "${plan.name}" vì đang được sử dụng bởi ${totalUsage} dịch vụ. Vui lòng xóa tất cả dịch vụ liên quan trước khi xóa gói tên miền.`,
          usageDetails: {
            domainServices: domainServicesCount,
            emailServices: emailServicesCount,
            hostingServices: hostingServicesCount,
            websiteServices: websiteServicesCount,
            sslServices: sslServicesCount,
            maintenanceServices: maintenanceServicesCount,
            domainITVT: domainITVTCount,
            sslITVT: sslITVTCount
          }
        });
      }

      const deleted = await DomainPlan.findByIdAndDelete(id);

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
