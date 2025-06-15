const IpWhitelists = require("../../models/ip-whitelist/model");
const logAction = require("../../middleware/actionLogs");

const findExistingIp = async (ip) => {
  return await IpWhitelists.findOne({ ip });
};

const ipWhiteListController = {
  getIpWhitelist: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [ipWhitelists, total] = await Promise.all([
        IpWhitelists.find()
          .populate('createdBy', 'display_name username email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        IpWhitelists.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách IP whitelist thành công.",
        data: ipWhitelists,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách IP whitelist."
      });
    }
  },

  addIpWhitelist: async (req, res) => {
    try {
      const { ip } = req.body;

      const existingIp = await findExistingIp(ip);
      if (existingIp) {
        return res.status(400).json({
          success: false,
          message: 'IP đã tồn tại! Vui lòng nhập IP khác!'
        });
      }

      const ipWhitelistData = {
        ...req.body,
        createdBy: req.auth._id
      };

      const newIpWhitelist = await IpWhitelists.create(ipWhitelistData);
      await logAction(req.auth._id, 'IP Whitelist', 'Thêm mới');

      return res.status(201).json({
        success: true,
        message: "Thêm IP whitelist thành công.",
        data: newIpWhitelist
      });
    } catch (err) {
      console.error("Error creating IP whitelist:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thêm IP whitelist."
      });
    }
  },

  updateIpWhitelist: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedIpWhitelist = await IpWhitelists.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedIpWhitelist) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy IP whitelist để cập nhật."
        });
      }

      await logAction(
        req.auth._id,
        'IP Whitelist',
        'Cập nhật',
        `/ip-whitelist/${id}`
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật IP whitelist thành công.",
        data: updatedIpWhitelist
      });

    } catch (error) {
      console.error("Error updating IP whitelist:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật IP whitelist."
      });
    }
  },

  deleteIpWhitelist: async (req, res) => {
    try {
      const { id } = req.params;
      const ipWhitelist = await IpWhitelists.findByIdAndDelete(id);

      if (!ipWhitelist) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy IP whitelist để xóa."
        });
      }

      await logAction(req.auth._id, 'IP Whitelist', 'Xóa');

      return res.status(200).json({
        success: true,
        message: "Xóa IP whitelist thành công."
      });

    } catch (error) {
      console.error("Error deleting IP whitelist:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa IP whitelist."
      });
    }
  },

  isValidIp: async (req, res) => {
    try {
      const clientIp = req.ip;
      const ipFound = await IpWhitelists.findOne({ ip: clientIp });

      if (ipFound) {
        return res.status(200).json({
          success: true,
          message: 'IP được chấp nhận',
          data: {
            ip: clientIp,
            isValid: true
          }
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'IP không nằm trong whitelist',
          data: {
            ip: clientIp,
            isValid: false
          }
        });
      }
    } catch (err) {
      console.error("Error validating IP:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi kiểm tra IP."
      });
    }
  }
};

module.exports = ipWhiteListController;