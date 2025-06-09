const NetworkSupplier = require("../../../models/suppliers/network/model");
const logAction = require("../../../middleware/actionLogs");
const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");

const networkController = {
  getNetwork: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [networkSuppliers, total] = await Promise.all([
        NetworkSupplier.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        NetworkSupplier.countDocuments(),
      ]);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách nhà cung cấp dịch vụ mạng thành công.",
        data: networkSuppliers,
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

  addNetwork: async (req, res) => {
    try {
      const { name, company, taxCode, address, supportName } = req.body;

      if (!name || !company || !taxCode) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin bắt buộc!"
        });
      }

      const duplicateField = await NetworkSupplier.findOne({
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

      const newNetworkSupplier = new NetworkSupplier(req.body);
      const savedNetworkSupplier = await newNetworkSupplier.save();

      await logAction(req.auth._id, "Nhà cung cấp dịch vụ mạng", "Thêm mới");

      return res.status(201).json({
        success: true,
        message: "Thêm nhà cung cấp dịch vụ mạng thành công!",
        data: savedNetworkSupplier
      });

    } catch (error) {
      console.error("Add network supplier error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi thêm nhà cung cấp dịch vụ mạng!"
      });
    }
  },

  getDetailNetwork: async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "ID không hợp lệ!" });
      }
  
      const networkSupplier = await NetworkSupplier.findById(id);
  
      if (!networkSupplier) {
        return res.status(404).json({
          success: false,
          message: "Nhà cung cấp không tồn tại!",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết nhà cung cấp thành công.",
        data: networkSupplier,
      });
    } catch (err) {
      console.error("Lỗi getDetailNetwork:", err);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy chi tiết nhà cung cấp.",
      });
    }
  },

  updateNetwork: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, company, supportName, address } = req.body;
  
      const networkSupplier = await NetworkSupplier.findById(id);
      if (!networkSupplier) {
        return res.status(404).json({ success: false, message: "Nhà cung cấp không tồn tại!" });
      }

      if (name && name !== networkSupplier.name) {
        const existName = await NetworkSupplier.findOne({ name });
        if (existName) {
          return res.status(400).json({ success: false, message: "Tên nhà cung cấp đã tồn tại!" });
        }
      }

      if (company && company !== networkSupplier.company) {
        const existCompany = await NetworkSupplier.findOne({ company });
        if (existCompany) {
          return res.status(400).json({ success: false, message: "Tên công ty đã tồn tại!" });
        }
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      const fieldsToCheck = [name, company, supportName, address];
      const hasSpecialChars = fieldsToCheck.some(field => field && specialCharRegex.test(field));
      if (hasSpecialChars) {
        return res.status(400).json({ success: false, message: "Thông tin không được chứa ký tự đặc biệt!" });
      }
  
      await networkSupplier.updateOne({ $set: req.body });
      const updatedNetworkSupplier = await NetworkSupplier.findById(id);
  
      await logAction(req.auth._id, "Nhà cung cấp dịch vụ mạng", "Cập nhật", `/ncc/mang/${id}`);
  
      return res.status(200).json({
        success: true,
        message: "Cập nhật nhà cung cấp dịch vụ mạng thành công!",
        data: updatedNetworkSupplier,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },  

  deleteNetwork: async (req, res) => {
    try {
      const networkSupplierId = req.params.id;

      await NetworkSupplier.findByIdAndDelete(networkSupplierId);
      await logAction(req.auth._id, "Nhà cung cấp dịch vụ mạng", "Xóa");

      return res.status(200).json({
        success: true,
        message: "Xóa nhà cung cấp dịch vụ mạng thành công.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = networkController;
