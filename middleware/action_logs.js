const ActionLogs = require('../models/action-logs/model');

const logAction = async (userId, object, action, link) => {
  try {
    const newLog = new ActionLogs({
      user_id: userId,
      object: object,
      action: action,
      link: link,
    });
    await newLog.save();
  } catch (err) {
    console.error('Error logging action:', err);
  }
};

module.exports = logAction;