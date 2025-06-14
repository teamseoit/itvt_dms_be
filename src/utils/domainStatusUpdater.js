const dayjs = require('dayjs');
const DomainServices = require('../models/services/domain/model');
const { 
  sendExpiringDomainsNotification, 
  sendExpiredDomainsNotification, 
  sendDomainStatusSummary 
} = require('./domainEmailNotifier');

/**
 * Cập nhật trạng thái tất cả domain services dựa trên ngày hết hạn
 */
const updateDomainServicesStatus = async (sendNotifications = true) => {
  try {
    const currentDate = dayjs();
    
    // Lấy tất cả domain services có expiredAt
    const allDomains = await DomainServices.find({ expiredAt: { $exists: true } });
    
    let updatedCount = 0;
    let expiredCount = 0;
    let expiringCount = 0;
    let activeCount = 0;

    for (const domain of allDomains) {
      const expiryDate = dayjs(domain.expiredAt);
      const daysUntilExpiry = expiryDate.diff(currentDate, 'day');
      
      let newStatus = domain.status;
      
      if (daysUntilExpiry < 0) {
        newStatus = 3; // Hết hạn
        expiredCount++;
      } else if (daysUntilExpiry <= 30) {
        newStatus = 2; // Sắp hết hạn
        expiringCount++;
      } else {
        newStatus = 1; // Hoạt động
        activeCount++;
      }

      // Chỉ cập nhật nếu status thay đổi
      if (domain.status !== newStatus || domain.daysUntilExpiry !== daysUntilExpiry) {
        await DomainServices.findByIdAndUpdate(domain._id, {
          status: newStatus,
          daysUntilExpiry: daysUntilExpiry
        });
        updatedCount++;
      }
    }

    console.log(`[${new Date().toISOString()}] Domain status update completed:`, {
      totalDomains: allDomains.length,
      updatedCount,
      statusBreakdown: {
        active: activeCount,
        expiring: expiringCount,
        expired: expiredCount
      }
    });

    // Gửi email thông báo nếu được yêu cầu
    if (sendNotifications) {
      await sendDomainNotifications();
    }

    return {
      totalDomains: allDomains.length,
      updatedCount,
      statusBreakdown: {
        active: activeCount,
        expiring: expiringCount,
        expired: expiredCount
      }
    };
  } catch (error) {
    console.error('Error updating domain services status:', error);
    throw error;
  }
};

/**
 * Gửi tất cả thông báo email về domain
 */
const sendDomainNotifications = async () => {
  try {
    // Lấy domain sắp hết hạn
    const expiringDomains = await getExpiringDomains(30);
    
    // Lấy domain đã hết hạn
    const expiredDomains = await getExpiredDomains();

    // Gửi email thông báo domain sắp hết hạn
    if (expiringDomains.length > 0) {
      await sendExpiringDomainsNotification(expiringDomains, 30);
      console.log(`Sent expiring domains notification for ${expiringDomains.length} domains`);
    }

    // Gửi email thông báo domain đã hết hạn
    if (expiredDomains.length > 0) {
      await sendExpiredDomainsNotification(expiredDomains);
      console.log(`Sent expired domains notification for ${expiredDomains.length} domains`);
    }

    // Gửi email tổng hợp nếu có domain cần thông báo
    if (expiringDomains.length > 0 || expiredDomains.length > 0) {
      await sendDomainStatusSummary(expiringDomains, expiredDomains);
      console.log('Sent domain status summary email');
    }

    return {
      expiringNotification: expiringDomains.length > 0,
      expiredNotification: expiredDomains.length > 0,
      summaryNotification: (expiringDomains.length > 0 || expiredDomains.length > 0)
    };
  } catch (error) {
    console.error('Error sending domain notifications:', error);
    throw error;
  }
};

/**
 * Lấy danh sách domain sắp hết hạn để gửi thông báo
 */
const getExpiringDomains = async (daysThreshold = 30) => {
  try {
    const currentDate = dayjs();
    const thresholdDate = currentDate.add(daysThreshold, 'day').endOf('day');
    
    const expiringDomains = await DomainServices.find({
      expiredAt: {
        $gt: currentDate.toDate(),
        $lte: thresholdDate.toDate()
      },
      status: { $in: [1, 2] } // Chỉ lấy những domain đang hoạt động hoặc sắp hết hạn
    })
    .populate('customer', 'fullName phoneNumber email')
    .populate('domainPlan', 'name extension')
    .lean();

    return expiringDomains.map(domain => {
      const expiryDate = dayjs(domain.expiredAt);
      const daysUntilExpiry = expiryDate.diff(currentDate, 'day');
      
      return {
        ...domain,
        daysUntilExpiry,
        statusText: getStatusText(domain.status, daysUntilExpiry)
      };
    });
  } catch (error) {
    console.error('Error getting expiring domains:', error);
    throw error;
  }
};

/**
 * Lấy danh sách domain đã hết hạn
 */
const getExpiredDomains = async () => {
  try {
    const currentDate = dayjs();
    
    const expiredDomains = await DomainServices.find({
      expiredAt: { $lte: currentDate.toDate() },
      status: { $in: [1, 2] } // Chỉ lấy những domain đang hoạt động hoặc sắp hết hạn
    })
    .populate('customer', 'fullName phoneNumber email')
    .populate('domainPlan', 'name extension')
    .lean();

    return expiredDomains.map(domain => {
      const expiryDate = dayjs(domain.expiredAt);
      const daysUntilExpiry = expiryDate.diff(currentDate, 'day');
      
      return {
        ...domain,
        daysUntilExpiry,
        statusText: getStatusText(domain.status, daysUntilExpiry)
      };
    });
  } catch (error) {
    console.error('Error getting expired domains:', error);
    throw error;
  }
};

// Helper function để tạo status text
function getStatusText(status, daysUntilExpiry = null) {
  switch (status) {
    case -1:
      return "Không hoạt động";
    case 0:
      return "Tạm dừng";
    case 1:
      return "Hoạt động";
    case 2:
      if (daysUntilExpiry !== null && daysUntilExpiry > 0) {
        return `Sắp hết hạn (còn ${daysUntilExpiry} ngày)`;
      }
      return "Sắp hết hạn";
    case 3:
      if (daysUntilExpiry !== null && daysUntilExpiry < 0) {
        return `Đã hết hạn (${Math.abs(daysUntilExpiry)} ngày trước)`;
      }
      return "Đã hết hạn";
    default:
      return "Không xác định";
  }
}

module.exports = {
  updateDomainServicesStatus,
  getExpiringDomains,
  getExpiredDomains,
  sendDomainNotifications
}; 