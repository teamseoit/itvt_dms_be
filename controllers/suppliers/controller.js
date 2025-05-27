const Supplier = require("../../models/suppliers/model");
const DomainPlans = require("../../models/plans/domain/model");
const EmailPlans = require("../../models/plans/email/model");
const HostingPlans = require("../../models/plans/hosting/model");
const SslPlans = require("../../models/plans/ssl/model");

const logAction = require("../../middleware/action_logs");

const { ObjectId } = require('mongoose').Types;

const supplierController = {
  addSupplier: async(req, res) => {
    try {
      const { name, company, tax_code, address, name_support } = req.body;
      const existingSupplier = await Supplier.findOne({ $or: [{ name }, {company}, { tax_code }] });
      if (existingSupplier) {
        let errorMessage = '';
        if (existingSupplier.name === name) {
          errorMessage = 'Tên nhà cung cấp đã tồn tại! Vui lòng nhập tên khác!';
        } else if (existingSupplier.company === company) {
          errorMessage = 'Tên công ty đã tồn tại! Vui lòng nhập tên công ty khác!';
        } else if (existingSupplier.tax_code === tax_code) {
          errorMessage = 'MST đã tồn tại! Vui lòng nhập MST khác!';
        }
        return res.status(400).json({ message: errorMessage });
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên nhà cung cấp không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(company)) {
        return res.status(400).json({ message: "Tên công ty không được chứa ký tự đặc biệt!" });
      }
  
      if (specialCharRegex.test(name_support)) {
        return res.status(400).json({ message: "Tên hỗ trợ viên không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(address)) {
        return res.status(400).json({ message: "Địa chỉ không được chứa ký tự đặc biệt!" });
      }

      const newSupplier = new Supplier(req.body);
      const saveSupplier = await newSupplier.save();
      await logAction(req.auth._id, 'Nhà cung cấp', 'Thêm mới');
      return res.status(200).json(saveSupplier);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSupplier: async(req, res) => {
    try {
      const suppliers = await Supplier.find().sort({"createdAt": -1});
      return res.status(200).json(suppliers);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailSupplier: async(req, res) => {
    try {
      const supplier = await Supplier.aggregate([
        {
          $match: {
            _id: new ObjectId(req.params.id),
          },
        },

        // domainplans
        {
          $lookup: {
            from: "domainplans",
            localField: "_id",
            foreignField: "supplier_id",
            as: "domainPlans"
          }
        },
        {
          $unwind: { path: "$domainPlans", preserveNullAndEmptyArrays: true },
        },
        {
          $sort: {
            'domainPlans.createdAt': -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            company: { $first: "$company" },
            tax_code: { $first: "$tax_code" },
            phone: { $first: "$phone" },
            name_support: { $first: "$name_support" },
            phone_support: { $first: "$phone_support" },
            address: { $first: "$address" },
            createdAt: { $first: "$createdAt" },
            __v: { $first: "$__v" },
            domainPlans: { $push: "$domainPlans" },
          },
        },

        // emailplans
        {
          $lookup: {
            from: "emailplans",
            localField: "_id",
            foreignField: "supplier_id",
            as: "emailPlans"
          }
        },
        {
          $unwind: { path: "$emailPlans", preserveNullAndEmptyArrays: true },
        },
        {
          $sort: {
            'emailPlans.createdAt': -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            company: { $first: "$company" },
            tax_code: { $first: "$tax_code" },
            phone: { $first: "$phone" },
            name_support: { $first: "$name_support" },
            phone_support: { $first: "$phone_support" },
            address: { $first: "$address" },
            createdAt: { $first: "$createdAt" },
            __v: { $first: "$__v" },
            domainPlans: { $first: "$domainPlans" },
            emailPlans: { $push: "$emailPlans" },
          },
        },

        // hostingPlans
        {
          $lookup: {
            from: "hostingplans",
            localField: "_id",
            foreignField: "supplier_id",
            as: "hostingPlans"
          }
        },
        {
          $unwind: { path: "$hostingPlans", preserveNullAndEmptyArrays: true },
        },
        {
          $sort: {
            'hostingPlans.createdAt': -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            company: { $first: "$company" },
            tax_code: { $first: "$tax_code" },
            phone: { $first: "$phone" },
            name_support: { $first: "$name_support" },
            phone_support: { $first: "$phone_support" },
            address: { $first: "$address" },
            createdAt: { $first: "$createdAt" },
            __v: { $first: "$__v" },
            domainPlans: { $first: "$domainPlans" },
            emailPlans: { $first: "$emailPlans" },
            hostingPlans: { $push: "$hostingPlans" },
          },
        },

        // sslPlans
        {
          $lookup: {
            from: "sslplans",
            localField: "_id",
            foreignField: "supplier_id",
            as: "sslPlans"
          }
        },
        {
          $unwind: { path: "$sslPlans", preserveNullAndEmptyArrays: true },
        },
        {
          $sort: {
            'sslPlans.createdAt': -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            company: { $first: "$company" },
            tax_code: { $first: "$tax_code" },
            phone: { $first: "$phone" },
            name_support: { $first: "$name_support" },
            phone_support: { $first: "$phone_support" },
            address: { $first: "$address" },
            createdAt: { $first: "$createdAt" },
            __v: { $first: "$__v" },
            domainPlans: { $first: "$domainPlans" },
            emailPlans: { $first: "$emailPlans" },
            hostingPlans: { $first: "$hostingPlans" },
            sslPlans: { $push: "$sslPlans" },
          },
        },
      ]);
      
      return res.status(200).json(supplier);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteSupplier: async(req, res) => {
    try {
      const supplierId = req.params.id;
      const domainPlanExists = await DomainPlans.findOne({ supplier_id: supplierId });
      const hostingPlansExists = await HostingPlans.findOne({ supplier_id: supplierId });
      const emailPlansExists = await EmailPlans.findOne({ supplier_id: supplierId });
      const sslPlansExists = await SslPlans.findOne({ supplier_id: supplierId });

      if (domainPlanExists || hostingPlansExists || emailPlansExists || sslPlansExists) {
        return res.status(400).json({ message: "Không thể xóa nhà cung cấp khi đang được sử dụng!" });
      }

      await DomainPlans.updateMany({supplier_id: req.params.id}, {supplier_id: null});
      await EmailPlans.updateMany({supplier_id: req.params.id}, {supplier_id: null});
      await HostingPlans.updateMany({supplier_id: req.params.id}, {supplier_id: null});
      await SslPlans.updateMany({supplier_id: req.params.id}, {supplier_id: null});
      await Supplier.findByIdAndDelete(req.params.id);
      
      await logAction(req.auth._id, 'Nhà cung cấp', 'Xóa');
      return res.status(200).json("Deleted successfully");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateSupplier: async(req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Nhà cung cấp không tồn tại!" });
      }

      const { name, company, name_support, address } = req.body;
      if (name && name !== supplier.name) {
        const existingSupplierName = await Supplier.findOne({ name });
        if (existingSupplierName) {
          return res.status(400).json({ message: "Tên nhà cung cấp đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      if (company && company !== supplier.company) {
        const existingSupplierCompany = await Supplier.findOne({ company });
        if (existingSupplierCompany) {
          return res.status(400).json({ message: "Tên công ty đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên nhà cung cấp không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(company)) {
        return res.status(400).json({ message: "Tên công ty không được chứa ký tự đặc biệt!" });
      }
  
      if (specialCharRegex.test(name_support)) {
        return res.status(400).json({ message: "Tên hỗ trợ viên không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(address)) {
        return res.status(400).json({ message: "Địa chỉ không được chứa ký tự đặc biệt!" });
      }

      await supplier.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Nhà cung cấp', 'Cập nhật', `/trang-chu/nha-cung-cap/cap-nhat-nha-cung-cap/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = supplierController;