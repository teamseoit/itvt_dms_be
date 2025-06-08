const ActionLogs = require('../../models/action-logs/model');

const actionLogsController = {
  getActionLogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 30;
      const skip = (page - 1) * limit;

      const [action_logs, total] = await Promise.all([
        ActionLogs.find()
          .populate('user_id')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ActionLogs.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách nhật ký thành công.",
        data: action_logs,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages
        }
      });
    } catch (error) {
      console.error("Error fetching action logs:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách nhật ký."
      });
    }
  },
}

module.exports = actionLogsController;