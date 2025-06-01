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

const checkServicesLinked = async (customerId) => {
  const services = [
    DomainServices, HostingServices, EmailServices, SslServices,
    WebsiteServices, ContentServices, ToplistServices,
    MaintenanceServices, MobileNetworkServices
  ];
  for (const svc of services) if (await svc.exists({ customer_id: customerId })) return true;
  return false;
};

const customerController = {
  addCustomer: async (req, res) => {
    try {
      const data = req.body;
      const { email, idNumber, phone } = data;

      if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email không hợp lệ!' });
      }

      const exists = await Customer.findOne({ $or: [{ email }, { idNumber }, { phone }] });
      if (exists) {
        const conflictField = exists.email === email ? 'Email' :
                              exists.idNumber === +idNumber ? 'CCCD' : 'Số điện thoại';
        return res.status(400).json({ message: `${conflictField} đã tồn tại!` });
      }

      const customer = new Customer({
        ...data,
        image_front_view: req.files?.image_front_view?.map(f => f.path) || [],
        image_back_view: req.files?.image_back_view?.map(f => f.path) || []
      });

      const saved = await customer.save();
      await logAction(req.auth._id, 'Khách hàng', 'Thêm mới');
      return res.status(200).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại!' });
    }
  },

  getCustomer: async (req, res) => {
    try {
      const { keyword } = req.query;
      const filter = keyword ? {
        $or: [
          { fullname: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } }
        ]
      } : {};

      const customers = await Customer.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(customers);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getDetailCustomer: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id).populate('data_service');
      if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng!" });
      return res.status(200).json(customer);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (req.files?.image_front_view) updateData.image_front_view = req.files.image_front_view.map(f => f.path);
      if (req.files?.image_back_view) updateData.image_back_view = req.files.image_back_view.map(f => f.path);

      const updated = await Customer.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      if (!updated) return res.status(404).json({ message: "Không tìm thấy khách hàng!" });

      await logAction(req.auth._id, 'Khách hàng', 'Cập nhật', `/trang-chu/khach-hang/cap-nhat-khach-hang/${id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng!" });

      if (await checkServicesLinked(customer._id)) {
        return res.status(400).json({ message: "Không thể xóa khách hàng khi đang được sử dụng!" });
      }

      const deleteFiles = async (paths) => {
        for (const file of paths) await fs.remove(path.resolve(file));
      };

      await deleteFiles(customer.image_front_view);
      await deleteFiles(customer.image_back_view);

      await Customer.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Khách hàng', 'Xóa');
      return res.status(200).send("Xóa thành công!");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getGuestsCustomer: async (req, res) => {
    try {
      const guests = await Customer.find({ type_customer: false }).sort({ createdAt: -1 });
      return res.status(200).json(guests);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getCompanyCustomer: async (req, res) => {
    try {
      const companies = await Customer.find({ type_customer: true }).sort({ createdAt: -1 });
      return res.status(200).json(companies);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
};

module.exports = customerController;
