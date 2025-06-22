const dayjs = require('dayjs');

function calculateDaysUntilExpiry(expiredAt) {
  if (!expiredAt) return null;
  return dayjs(expiredAt).diff(dayjs(), 'day');
}

function determineStatus(daysUntilExpiry) {
  if (daysUntilExpiry < 0) return 3;
  if (daysUntilExpiry <= 30) return 2;
  return 1;
}

function getStatusText(status, daysUntilExpiry = null) {
  switch (status) {
    case 1: return "Hoạt động";
    case 2:
      return daysUntilExpiry > 0
        ? `Còn ${daysUntilExpiry} ngày hết hạn`
        : "Sắp hết hạn";
    case 3:
      return daysUntilExpiry < 0
        ? `Đã hết hạn ${Math.abs(daysUntilExpiry)} ngày trước`
        : "Đã hết hạn";
    default: return "Không xác định";
  }
}

module.exports = {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText,
};
