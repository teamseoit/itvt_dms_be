const Customer = require("../../models/customers/model");
const logAction = require("../../middleware/actionLogs");
const { ObjectId } = require("mongoose").Types;
const fs = require("fs-extra");
const path = require("path");
const validator = require("validator");
const DomainServices = require("../../models/services/domain/model");
const HostingServices = require("../../models/services/hosting/model");
const EmailServices = require("../../models/services/email/model");
const SslServices = require("../../models/services/ssl/model");
const WebsiteServices = require("../../models/services/website/model");
const ContentServices = require("../../models/services/content/model");
const ToplistServices = require("../../models/services/toplist/model");
const MaintenanceServices = require("../../models/services/maintenance/model");
const MobileNetworkServices = require("../../models/services/mobile-network/model");
const Contracts = require("../../models/contracts/model");
const DomainITVT = require("../../models/itvt/domain/model");
const SslITVT = require("../../models/itvt/ssl/model");

const checkServicesLinked = async (customerId) => {
  const services = [
    DomainServices, HostingServices, EmailServices, SslServices,
    WebsiteServices, ContentServices, ToplistServices,
    MaintenanceServices, MobileNetworkServices
  ];
  
  for (const svc of services) {
    const hasCustomerId = await svc.exists({ customer_id: customerId });
    const hasCustomer = await svc.exists({ customer: customerId });
    
    if (hasCustomerId || hasCustomer) {
      return true;
    }
  }
  
  // Kiểm tra Contracts
  const hasContract = await Contracts.exists({ customer: customerId });
  if (hasContract) {
    return true;
  }
  
  // Kiểm tra các dịch vụ ITVT
  const itvtServices = [DomainITVT, SslITVT];
  for (const svc of itvtServices) {
    const hasITVTService = await svc.exists({ customer_id: customerId });
    if (hasITVTService) {
      return true;
    }
  }
  
  return false;
};

const customerController = {
  getCustomer: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const { keyword, typeCustomer } = req.query;

      const filter = {};

      if (keyword) {
        filter.$or = [
          { fullName: { $regex: keyword, $options: 'i' } },
          { phoneNumber: keyword }
        ];
      }

      if (typeCustomer !== undefined) {
        if (typeCustomer === 'true') filter.typeCustomer = true;
        else if (typeCustomer === 'false') filter.typeCustomer = false;
      }

      const [customers, total] = await Promise.all([
        Customer.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Customer.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách khách hàng thành công.",
        data: customers,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch (err) {
      console.error('Error getting customers:', err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách khách hàng."
      });
    }
  },

  addCustomer: async (req, res) => {
    try {
      const data = req.body;
      const { email, identityNumber, phoneNumber } = data;

      if (!identityNumber) {
        return res.status(400).json({
          success: false,
          message: 'CCCD là trường bắt buộc!'
        });
      }

      if (email && !validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email không hợp lệ!'
        });
      }
  
      const duplicateQuery = [];
      
      if (email) {
        duplicateQuery.push({ email });
      }
      
      if (identityNumber) {
        duplicateQuery.push({ identityNumber });
      }
      
      if (phoneNumber) {
        duplicateQuery.push({ phoneNumber });
      }

      if (duplicateQuery.length > 0) {
        const exists = await Customer.findOne({
          $or: duplicateQuery
        });

        if (exists) {
          const conflictField = exists.email === email ? 'Email' :
            exists.identityNumber === identityNumber ? 'CCCD' : 
            'Số điện thoại';

          return res.status(400).json({
            success: false,
            message: `${conflictField} đã tồn tại!`
          });
        }
      }

      const customer = new Customer({
        ...data,
        identityCardFrontImage: req.files?.identityCardFrontImage?.[0]?.path || '',
        identityCardBackImage: req.files?.identityCardBackImage?.[0]?.path || ''
      });

      const savedCustomer = await customer.save();
      await logAction(req.auth._id, 'Khách hàng', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: 'Thêm khách hàng thành công.',
        data: savedCustomer
      });

    } catch (err) {
      console.error('Error adding customer:', err);
      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const fieldName = field === 'email' ? 'Email' : 
                         field === 'identityNumber' ? 'CCCD' : 
                         field === 'phoneNumber' ? 'Số điện thoại' : field;
        
        return res.status(400).json({
          success: false,
          message: `${fieldName} đã tồn tại trong hệ thống!`
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Lỗi máy chủ, vui lòng thử lại!'
      });
    }
  },

  getDetailCustomer: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id).lean();

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khách hàng!"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy thông tin khách hàng thành công.",
        data: customer
      });

    } catch (err) {
      console.error('Error getting customer details:', err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy thông tin khách hàng."
      });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (req.files?.identityCardFrontImage) {
        updateData.identityCardFrontImage = req.files.identityCardFrontImage[0].path;
      }
      if (req.files?.identityCardBackImage) {
        updateData.identityCardBackImage = req.files.identityCardBackImage[0].path; 
      }

      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khách hàng!"
        });
      }

      const updated = await Customer.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      await logAction(
        req.auth._id,
        'Khách hàng',
        'Cập nhật',
        `/khach-hang/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật thành công!",
        data: updated
      });

    } catch (err) {
      console.error('Error updating customer:', err);
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ!",
          errors: Object.values(err.errors).map(e => e.message)
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ, vui lòng thử lại!"
      });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khách hàng!"
        });
      }
  
      const hasLinkedServices = await checkServicesLinked(customer._id);
      if (hasLinkedServices) {
        return res.status(400).json({
          success: false,
          message: "Không thể xóa khách hàng khi đang sử dụng dịch vụ!"
        });
      }
  
      const deleteFiles = async (paths) => {
        if (!paths) return;
        const files = Array.isArray(paths) ? paths : [paths];
        await Promise.all(files.map(file => fs.remove(path.resolve(file))));
      };
  
      await Promise.all([
        deleteFiles(customer.identityCardFrontImage),
        deleteFiles(customer.identityCardBackImage),
        Customer.findByIdAndDelete(id),
        logAction(req.auth._id, 'Khách hàng', 'Xóa')
      ]);
  
      return res.status(200).json({
        success: true,
        message: "Xóa thành công!"
      });
  
    } catch (error) {
      console.error('Error deleting customer:', error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ, vui lòng thử lại!"
      });
    }
  }  
};

module.exports = customerController;
