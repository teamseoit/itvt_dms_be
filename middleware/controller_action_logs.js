const ActionLogs = require('../models/action-logs/model');

const actionLogsController = {
  getActionLogs: async (req, res) => {
    try {
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const skip = (page - 1) * limit;

      const action_logs = await ActionLogs.find()
        .populate('user_id')
        .sort({ "createdAt": -1 })
        .skip(skip)
        .limit(limit);

      const totalRecords = await ActionLogs.countDocuments();
      const totalPages = Math.ceil(totalRecords / limit);

      return res.status(200).json({
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        data: action_logs
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
}

module.exports = actionLogsController;