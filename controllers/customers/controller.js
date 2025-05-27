const fs = require('fs-extra');
const path = require('path');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

const Customer = require("../../models/customers/model");
const logAction = require("../../middleware/action_logs");

const DomainServices = require("../../models/services/domain/model");
const HostingServices = require("../../models/services/hosting/model");
const EmailServices = require("../../models/services/email/model");
const SslServices = require("../../models/services/ssl/model");
const WebsiteServices = require("../../models/services/website/model");
const ContentServices = require("../../models/services/content/model");
const ToplistServices = require("../../models/services/toplist/model");
const MaintenanceServices = require("../../models/services/maintenance/model");
const MobileNetworkServices = require("../../models/services/mobile-network/model");

const customerController = {
  addCustomer: async(req, res) => {
    try {
      const {
        fullname,
        email,
        gender,
        idNumber,
        phone,
        address,
        company,
        tax_code,
        address_company,
        representative,
        representative_hotline,
        mail_vat,
        type_customer,
      } = req.body;

      if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email không hợp lệ! Vui lòng nhập email đúng định dạng!' });
      }

      const existingCustomer = await Customer.findOne({ $or: [{email}, {idNumber}, {phone}] });
      if (existingCustomer) {
        let errorMessage = '';
        if (existingCustomer.email === email) {
          errorMessage = 'Email đã tồn tại! Vui lòng nhập email khác!';
        } else if (existingCustomer.idNumber === idNumber) {
          errorMessage = 'CCCD đã tồn tại! Vui lòng nhập CCCD khác!';
        } else if (existingCustomer.phone === phone) {
          errorMessage = 'Số điện thoại đã tồn tại! Vui lòng nhập số khác!';
        }
        return res.status(400).json({message: errorMessage});
      }

      const newCustomer = new Customer({
        fullname,
        email,
        gender,
        idNumber,
        phone,
        address,
        company,
        tax_code,
        address_company,
        representative,
        representative_hotline: representative_hotline,
        mail_vat: mail_vat,
        image_front_view: req.files['image_front_view'] ? req.files['image_front_view'].map(file => file.path) : [],
        image_back_view: req.files['image_back_view'] ? req.files['image_back_view'].map(file => file.path) : [],
        type_customer
      });

      const saveCustomer = await newCustomer.save();
      await logAction(req.auth._id, 'Khách hàng', 'Thêm mới');
      return res.status(200).json(saveCustomer);
    } catch(err) {
      console.error('Lỗi máy chủ:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  },

  getCustomer: async(req, res) => {
    try {
      const { keyword } = req.query;

      let filter = {};
      if (keyword) {
        filter = {
          $or: [
            { fullname: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } }
          ]
        };
      }

      const customers = await Customer.find(filter).sort({"createdAt": -1});
      return res.status(200).json(customers);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailCustomer: async(req, res) => {
    try {
      const customers = await Customer.findById(req.params.id).populate('data_service').exec();
      return res.status(200).json(customers);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteCustomer: async(req, res) => {
    try {
      // const customer = await Customer.findByIdAndDelete(req.params.id);
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).send('Không tìm thấy khách hàng!');
      }

      const customerId = req.params.id;
      const domainServicesExists = await DomainServices.findOne({ customer_id: customerId });
      const hostingServicesExists = await HostingServices.findOne({ customer_id: customerId });
      const emailServicesExists = await EmailServices.findOne({ customer_id: customerId });
      const sslServicesExists = await SslServices.findOne({ customer_id: customerId });
      const websiteServicesExists = await WebsiteServices.findOne({ customer_id: customerId });
      const contentServicesExists = await ContentServices.findOne({ customer_id: customerId });
      const toplistServicesExists = await ToplistServices.findOne({ customer_id: customerId });
      const maintenanceSericesExists = await MaintenanceServices.findOne({ customer_id: customerId });
      const mobileNetworkServicesExists = await MobileNetworkServices.findOne({ customer_id: customerId });

      if (domainServicesExists || hostingServicesExists || emailServicesExists || sslServicesExists || websiteServicesExists || contentServicesExists || toplistServicesExists || maintenanceSericesExists || mobileNetworkServicesExists) {
        return res.status(400).json({ message: "Không thể xóa khách hàng khi đang được sử dụng!" });
      }

      const deleteFiles = async (filePaths) => {
        for (const filePath of filePaths) {
          try {
            await fs.remove(path.resolve(filePath));
          } catch (err) {
            console.error(`Lỗi xóa tập tin: ${filePath}`, err);
          }
        }
      };
  
      await deleteFiles(customer.image_front_view);
      await deleteFiles(customer.image_back_view);
  
      await Customer.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Khách hàng', 'Xóa');
      return res.status(200).send('Xóa thành công!');
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);    }
  },

  updateCustomer: async(req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);

      if (!customer) {
        return res.status(404).send('Không tìm thấy khách hàng!');
      }

      const updateData = { ...req.body };

      if (req.files['image_front_view']) {
        updateData.image_front_view = req.files['image_front_view'].map(file => file.path);
      }

      if (req.files['image_back_view']) {
        updateData.image_back_view = req.files['image_back_view'].map(file => file.path);
      }

      await Customer.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
      await logAction(req.auth._id, 'Khách hàng', 'Cập nhật', `/trang-chu/khach-hang/cap-nhat-khach-hang/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getGuestsCustomer: async(req, res) => {
    try {
      var guests_customer = await Customer.find(
        {
          type_customer: false
        }
      ).sort({"createdAt": -1});
      return res.status(200).json(guests_customer);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getCompanyCustomer: async(req, res) => {
    try {
      var company_customer = await Customer.find(
        {
          type_customer: true
        }
      ).sort({"createdAt": -1});
      return res.status(200).json(company_customer);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
}

module.exports = customerController;