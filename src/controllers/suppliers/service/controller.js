const ServiceSupplier = require("../../../models/suppliers/service/model");
const logAction = require("../../../middleware/actionLogs");
const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");

const serviceController = {
  getService: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [suppliers, total] = await Promise.all([
        ServiceSupplier.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        ServiceSupplier.countDocuments(),
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách nhà cung cấp dịch vụ thành công.",
        data: suppliers,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  addService: async (req, res) => {
    try {
      const { name, company, taxCode, address, supportName } = req.body;

      if (!name || !company || !taxCode) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin bắt buộc!"
        });
      }

      const duplicateField = await ServiceSupplier.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${name}$`, 'i') } },
          { company: { $regex: new RegExp(`^${company}$`, 'i') } },
          { taxCode }
        ]
      });

      if (duplicateField) {
        const fieldMap = {
          name: "Tên nhà cung cấp",
          company: "Tên công ty", 
          taxCode: "Mã số thuế"
        };

        const duplicateKey = Object.keys(fieldMap).find(key => 
          duplicateField[key]?.toLowerCase() === req.body[key]?.toLowerCase()
        );

        return res.status(400).json({
          success: false,
          message: `${fieldMap[duplicateKey]} đã tồn tại trong hệ thống!`
        });
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>?/|\\]/;
      const fieldsToCheck = { name, company, supportName, address };
      
      for (const [field, value] of Object.entries(fieldsToCheck)) {
        if (value && specialCharRegex.test(value)) {
          return res.status(400).json({
            success: false,
            message: `${field} không được chứa ký tự đặc biệt!`
          });
        }
      }

      const newSupplier = new ServiceSupplier(req.body);
      const savedSupplier = await newSupplier.save();

      await logAction(req.auth._id, "Nhà cung cấp dịch vụ", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm nhà cung cấp dịch vụ thành công!",
        data: savedSupplier
      });

    } catch (error) {
      console.error("Add service supplier error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm nhà cung cấp dịch vụ!"
      });
    }
  },

  getDetailService: async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "ID không hợp lệ!" });
      }
  
      const supplier = await ServiceSupplier.findById(id);
  
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Nhà cung cấp không tồn tại!",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết nhà cung cấp thành công.",
        data: supplier,
      });
    } catch (err) {
      console.error("Lỗi getDetailService:", err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết nhà cung cấp.",
      });
    }
  },

  updateService: async (req, res) => {
    try {
      const supplier = await ServiceSupplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ success: false, message: "Nhà cung cấp không tồn tại!" });
      }

      const { name, company, supportName, address } = req.body;

      if (name && name !== supplier.name) {
        const existName = await ServiceSupplier.findOne({ name });
        if (existName) {
          return res.status(400).json({ success: false, message: "Tên nhà cung cấp đã tồn tại!" });
        }
      }

      if (company && company !== supplier.company) {
        const existCompany = await ServiceSupplier.findOne({ company });
        if (existCompany) {
          return res.status(400).json({ success: false, message: "Tên công ty đã tồn tại!" });
        }
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if ([name, company, supportName, address].some(v => specialCharRegex.test(v))) {
        return res.status(400).json({ success: false, message: "Thông tin không được chứa ký tự đặc biệt!" });
      }

      await supplier.updateOne({ $set: req.body });
      await logAction(req.auth._id, "Nhà cung cấp", "Cập nhật", `/ncc/dich-vu/${req.params.id}`);

      return res.status(200).json({ success: true, message: "Cập nhật nhà cung cấp thành công!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  deleteService: async (req, res) => {
    try {
      const supplierId = req.params.id;

      await ServiceSupplier.findByIdAndDelete(supplierId);
      await logAction(req.auth._id, "Nhà cung cấp", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa nhà cung cấp thành công.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = serviceController;
