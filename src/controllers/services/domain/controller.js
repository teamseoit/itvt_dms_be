const dayjs = require('dayjs');
const DomainServices = require("../../../models/services/domain/model");
const logAction = require("../../../middleware/actionLogs");

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
          .populate('domainPlan')
          .populate('serverPlan')
          .populate('customer', 'fullName phoneNumber')
          .lean(),
        DomainServices.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ tên miền thành công.",
        data: domainServices,
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
      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm dịch vụ tên miền thành công.",
        data: newDomain
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

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết dịch vụ tên miền thành công.",
        data: domain
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

      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-ten-mien/${id}`);

      return res.status(200).json({ 
        success: true, 
        message: "Cập nhật dịch vụ tên miền thành công.",
        data: updatedDomain
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
        { $set: { status: 3 } }
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
        { $set: { status: 2 } }
      );

      // Get paginated results
      const [expiredDomains, expiringDomains, totalExpired, totalExpiring] = await Promise.all([
        DomainServices.find(expiredFilter).skip(skip).limit(limit),
        DomainServices.find(expiringFilter).skip(skip).limit(limit),
        DomainServices.countDocuments(expiredFilter),
        DomainServices.countDocuments(expiringFilter)
      ]);

      const totalPages = Math.ceil((totalExpired + totalExpiring) / limit);

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái tên miền hết hạn và sắp hết hạn thành công.",
        data: {
          expired: {
            count: expired.modifiedCount,
            domains: expiredDomains
          },
          expiring: {
            count: expiring.modifiedCount,
            domains: expiringDomains
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
};

module.exports = domainServicesController;
