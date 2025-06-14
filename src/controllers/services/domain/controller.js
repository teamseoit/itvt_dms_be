const dayjs = require('dayjs');
const DomainServices = require("../../../models/services/domain/model");
const logAction = require("../../../middleware/actionLogs");
const { updateDomainServicesStatus, getExpiringDomains, getExpiredDomains, sendDomainNotifications } = require("../../../utils/domainStatusUpdater");

const domainServicesController = {
  getDomainServices: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const { keyword } = req.query;

      const filter = {};

      if (keyword) {
        filter.name = { $regex: keyword, $options: 'i' };
      }

      const [domainServices, total] = await Promise.all([
        DomainServices.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('domainPlan', 'name extension purchasePrice retailPrice renewalPrice')
          .populate('serverPlan', 'name ipAddress')
          .populate('customer', 'fullName phoneNumber')
          .lean(),
        DomainServices.countDocuments(filter)
      ]);

      // Cập nhật daysUntilExpiry cho mỗi domain service
      const updatedDomainServices = domainServices.map(domain => {
        if (domain.expiredAt) {
          const currentDate = dayjs();
          const expiryDate = dayjs(domain.expiredAt);
          const daysUntilExpiry = expiryDate.diff(currentDate, 'day');
          
          return {
            ...domain,
            daysUntilExpiry,
            statusText: getStatusText(domain.status, daysUntilExpiry)
          };
        }
        return {
          ...domain,
          statusText: getStatusText(domain.status)
        };
      });

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ tên miền thành công.",
        data: updatedDomainServices,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch (err) {
      console.error('Error getting domain services:', err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách dịch vụ tên miền."
      });
    }
  },

  addDomainServices: async (req, res) => {
    try {
      const { name } = req.body;
      const existing = await DomainServices.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Tên miền đăng ký đã tồn tại! Vui lòng nhập tên miền khác!',
        });
      }

      const newDomain = await DomainServices.create(req.body);
      
      // Cập nhật status và daysUntilExpiry sau khi tạo
      if (newDomain.expiredAt) {
        const currentDate = dayjs();
        const expiryDate = dayjs(newDomain.expiredAt);
        const daysUntilExpiry = expiryDate.diff(currentDate, 'day');
        
        newDomain.daysUntilExpiry = daysUntilExpiry;
        
        if (daysUntilExpiry < 0) {
          newDomain.status = 3;
        } else if (daysUntilExpiry <= 30) {
          newDomain.status = 2;
        } else {
          newDomain.status = 1;
        }
        
        await newDomain.save();
      }

      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ tên miền thành công.",
        data: {
          ...newDomain.toObject(),
          statusText: getStatusText(newDomain.status, newDomain.daysUntilExpiry)
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
      const { id } = req.params;
      const domain = await DomainServices.findById(id);

      if (!domain) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ tên miền."
        });
      }

      // Cập nhật daysUntilExpiry
      let daysUntilExpiry = null;
      if (domain.expiredAt) {
        const currentDate = dayjs();
        const expiryDate = dayjs(domain.expiredAt);
        daysUntilExpiry = expiryDate.diff(currentDate, 'day');
      }

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
      const { id } = req.params;
      const updatedDomain = await DomainServices.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedDomain) {
        return res.status(404).json({ 
          success: false, 
          message: "Không tìm thấy dịch vụ tên miền để cập nhật." 
        });
      }

      // Cập nhật status và daysUntilExpiry sau khi update
      if (updatedDomain.expiredAt) {
        const currentDate = dayjs();
        const expiryDate = dayjs(updatedDomain.expiredAt);
        const daysUntilExpiry = expiryDate.diff(currentDate, 'day');
        
        updatedDomain.daysUntilExpiry = daysUntilExpiry;
        
        if (daysUntilExpiry < 0) {
          updatedDomain.status = 3;
        } else if (daysUntilExpiry <= 30) {
          updatedDomain.status = 2;
        } else {
          updatedDomain.status = 1;
        }
        
        await updatedDomain.save();
      }

      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-ten-mien/${id}`);

      return res.status(200).json({ 
        success: true, 
        message: "Cập nhật dịch vụ tên miền thành công.",
        data: {
          ...updatedDomain.toObject(),
          statusText: getStatusText(updatedDomain.status, updatedDomain.daysUntilExpiry)
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
      const { id } = req.params;
      const domain = await DomainServices.findByIdAndDelete(id);

      if (!domain) {
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
  },

  getDomainServicesStatusAutoUpdate: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const currentDate = dayjs();

      // Update expired domains
      const expiredFilter = { expiredAt: { $lte: currentDate.toDate() } };
      const expired = await DomainServices.updateMany(
        expiredFilter,
        { 
          $set: { 
            status: 3,
            daysUntilExpiry: { $subtract: [{ $toDate: "$expiredAt" }, new Date()] }
          } 
        }
      );

      // Update expiring domains
      const expiringFilter = {
        expiredAt: {
          $gt: currentDate.toDate(),
          $lte: currentDate.add(30, 'day').endOf('day').toDate()
        }
      };
      const expiring = await DomainServices.updateMany(
        expiringFilter,
        { 
          $set: { 
            status: 2,
            daysUntilExpiry: { $subtract: [{ $toDate: "$expiredAt" }, new Date()] }
          } 
        }
      );

      // Get paginated results with status text
      const [expiredDomains, expiringDomains, totalExpired, totalExpiring] = await Promise.all([
        DomainServices.find(expiredFilter).skip(skip).limit(limit).lean(),
        DomainServices.find(expiringFilter).skip(skip).limit(limit).lean(),
        DomainServices.countDocuments(expiredFilter),
        DomainServices.countDocuments(expiringFilter)
      ]);

      // Thêm statusText cho kết quả
      const processedExpiredDomains = expiredDomains.map(domain => ({
        ...domain,
        statusText: getStatusText(domain.status, domain.daysUntilExpiry)
      }));

      const processedExpiringDomains = expiringDomains.map(domain => ({
        ...domain,
        statusText: getStatusText(domain.status, domain.daysUntilExpiry)
      }));

      const totalPages = Math.ceil((totalExpired + totalExpiring) / limit);

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái tên miền hết hạn và sắp hết hạn thành công.",
        data: {
          expired: {
            count: expired.modifiedCount,
            domains: processedExpiredDomains
          },
          expiring: {
            count: expiring.modifiedCount,
            domains: processedExpiringDomains
          }
        },
        meta: {
          page,
          limit,
          totalDocs: totalExpired + totalExpiring,
          totalPages
        }
      });
    } catch (err) {
      console.error("Error updating domain service status:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi máy chủ khi cập nhật trạng thái dịch vụ tên miền." 
      });
    }
  },

  updateAllDomainServicesStatus: async (req, res) => {
    try {
      const result = await updateDomainServicesStatus();

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái tất cả dịch vụ tên miền thành công.",
        data: result
      });
    } catch (err) {
      console.error("Error updating all domain services status:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi máy chủ khi cập nhật trạng thái tất cả dịch vụ tên miền." 
      });
    }
  },

  getExpiringDomains: async (req, res) => {
    try {
      const daysThreshold = parseInt(req.query.days) || 30;
      const expiringDomains = await getExpiringDomains(daysThreshold);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách tên miền sắp hết hạn thành công.",
        data: expiringDomains,
        meta: {
          totalCount: expiringDomains.length,
          daysThreshold
        }
      });
    } catch (err) {
      console.error("Error getting expiring domains:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi máy chủ khi lấy danh sách tên miền sắp hết hạn." 
      });
    }
  },

  getExpiredDomains: async (req, res) => {
    try {
      const expiredDomains = await getExpiredDomains();

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách tên miền đã hết hạn thành công.",
        data: expiredDomains,
        meta: {
          totalCount: expiredDomains.length
        }
      });
    } catch (err) {
      console.error("Error getting expired domains:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi máy chủ khi lấy danh sách tên miền đã hết hạn." 
      });
    }
  },

  sendDomainNotifications: async (req, res) => {
    try {
      const result = await sendDomainNotifications();

      return res.status(200).json({
        success: true,
        message: "Gửi thông báo email thành công.",
        data: result
      });
    } catch (err) {
      console.error("Error sending domain notifications:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi máy chủ khi gửi thông báo email." 
      });
    }
  },

  updateDomainStatusWithNotifications: async (req, res) => {
    try {
      const { sendNotifications = true } = req.body;
      const result = await updateDomainServicesStatus(sendNotifications);

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái tất cả dịch vụ tên miền thành công.",
        data: result
      });
    } catch (err) {
      console.error("Error updating domain status with notifications:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi máy chủ khi cập nhật trạng thái dịch vụ tên miền." 
      });
    }
  },
};

// Helper function để tạo status text
function getStatusText(status, daysUntilExpiry = null) {
  switch (status) {
    case -1:
      return "Không hoạt động";
    case 0:
      return "Tạm dừng";
    case 1:
      return "Hoạt động";
    case 2:
      if (daysUntilExpiry !== null && daysUntilExpiry > 0) {
        return `Sắp hết hạn (còn ${daysUntilExpiry} ngày)`;
      }
      return "Sắp hết hạn";
    case 3:
      if (daysUntilExpiry !== null && daysUntilExpiry < 0) {
        return `Đã hết hạn (${Math.abs(daysUntilExpiry)} ngày trước)`;
      }
      return "Đã hết hạn";
    default:
      return "Không xác định";
  }
}

module.exports = domainServicesController;
