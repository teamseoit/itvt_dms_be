const sendEmail = require('./sendEmail');
const dayjs = require('dayjs');

/**
 * Tạo template email cho domain sắp hết hạn
 */
const createExpiringDomainsEmailTemplate = (domains, daysThreshold) => {
  const currentDate = dayjs().format('DD/MM/YYYY');
  
  let domainsList = '';
  domains.forEach((domain, index) => {
    domainsList += `
      <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
        <td style="padding: 12px; border: 1px solid #dee2e6;">${index + 1}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.name}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.customer?.fullName || 'N/A'}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.customer?.phoneNumber || 'N/A'}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.customer?.email || 'N/A'}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6; color: #dc3545; font-weight: bold;">${domain.daysUntilExpiry} ngày</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${dayjs(domain.expiredAt).format('DD/MM/YYYY')}</td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thông báo tên miền sắp hết hạn</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #dc3545; margin: 0;">⚠️ Thông báo tên miền sắp hết hạn</h2>
          <p style="margin: 10px 0 0 0; color: #666;">
            Ngày gửi: ${currentDate}
          </p>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;">
            <strong>Lưu ý:</strong> Có <strong>${domains.length}</strong> tên miền sẽ hết hạn trong vòng <strong>${daysThreshold}</strong> ngày tới. 
            Vui lòng liên hệ khách hàng để gia hạn dịch vụ.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #007bff; color: white;">
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">STT</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Tên miền</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Khách hàng</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Số điện thoại</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Email</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Còn lại</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Ngày hết hạn</th>
            </tr>
          </thead>
          <tbody>
            ${domainsList}
          </tbody>
        </table>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Email này được gửi tự động từ hệ thống quản lý DMS. 
            Vui lòng không trả lời email này.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Tạo template email cho domain đã hết hạn
 */
const createExpiredDomainsEmailTemplate = (domains) => {
  const currentDate = dayjs().format('DD/MM/YYYY');
  
  let domainsList = '';
  domains.forEach((domain, index) => {
    domainsList += `
      <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
        <td style="padding: 12px; border: 1px solid #dee2e6;">${index + 1}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.name}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.customer?.fullName || 'N/A'}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.customer?.phoneNumber || 'N/A'}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${domain.customer?.email || 'N/A'}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6; color: #dc3545; font-weight: bold;">${Math.abs(domain.daysUntilExpiry)} ngày trước</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${dayjs(domain.expiredAt).format('DD/MM/YYYY')}</td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thông báo tên miền đã hết hạn</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #dc3545; margin: 0;">🚨 Thông báo tên miền đã hết hạn</h2>
          <p style="margin: 10px 0 0 0; color: #666;">
            Ngày gửi: ${currentDate}
          </p>
        </div>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0; color: #721c24;">
            <strong>Khẩn cấp:</strong> Có <strong>${domains.length}</strong> tên miền đã hết hạn. 
            Vui lòng liên hệ khách hàng ngay lập tức để gia hạn dịch vụ.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #dc3545; color: white;">
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">STT</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Tên miền</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Khách hàng</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Số điện thoại</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Email</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Hết hạn</th>
              <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Ngày hết hạn</th>
            </tr>
          </thead>
          <tbody>
            ${domainsList}
          </tbody>
        </table>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Email này được gửi tự động từ hệ thống quản lý DMS. 
            Vui lòng không trả lời email này.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Gửi email thông báo domain sắp hết hạn
 */
const sendExpiringDomainsNotification = async (domains, daysThreshold = 30) => {
  try {
    if (!domains || domains.length === 0) {
      console.log('No expiring domains to notify');
      return;
    }

    const adminEmails = process.env.ADMIN_EMAILS ? 
      process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : 
      [process.env.EMAIL_USER];

    if (!adminEmails || adminEmails.length === 0) {
      console.error('No admin emails configured');
      return;
    }

    const subject = `[DMS] Thông báo: ${domains.length} tên miền sắp hết hạn trong ${daysThreshold} ngày`;
    const html = createExpiringDomainsEmailTemplate(domains, daysThreshold);

    for (const email of adminEmails) {
      await sendEmail(email, subject, html);
      console.log(`Expiring domains notification sent to: ${email}`);
    }

    return {
      success: true,
      sentTo: adminEmails,
      domainsCount: domains.length
    };
  } catch (error) {
    console.error('Error sending expiring domains notification:', error);
    throw error;
  }
};

/**
 * Gửi email thông báo domain đã hết hạn
 */
const sendExpiredDomainsNotification = async (domains) => {
  try {
    if (!domains || domains.length === 0) {
      console.log('No expired domains to notify');
      return;
    }

    const adminEmails = process.env.ADMIN_EMAILS ? 
      process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : 
      [process.env.EMAIL_USER];

    if (!adminEmails || adminEmails.length === 0) {
      console.error('No admin emails configured');
      return;
    }

    const subject = `[DMS] KHẨN CẤP: ${domains.length} tên miền đã hết hạn`;
    const html = createExpiredDomainsEmailTemplate(domains);

    for (const email of adminEmails) {
      await sendEmail(email, subject, html);
      console.log(`Expired domains notification sent to: ${email}`);
    }

    return {
      success: true,
      sentTo: adminEmails,
      domainsCount: domains.length
    };
  } catch (error) {
    console.error('Error sending expired domains notification:', error);
    throw error;
  }
};

/**
 * Gửi email thông báo tổng hợp về domain status
 */
const sendDomainStatusSummary = async (expiringDomains, expiredDomains) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? 
      process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : 
      [process.env.EMAIL_USER];

    if (!adminEmails || adminEmails.length === 0) {
      console.error('No admin emails configured');
      return;
    }

    const currentDate = dayjs().format('DD/MM/YYYY');
    const totalExpiring = expiringDomains.length;
    const totalExpired = expiredDomains.length;

    let summaryHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Báo cáo tình trạng tên miền</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #007bff; margin: 0;">📊 Báo cáo tình trạng tên miền</h2>
            <p style="margin: 10px 0 0 0; color: #666;">
              Ngày báo cáo: ${currentDate}
            </p>
          </div>
          
          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 1; background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ Sắp hết hạn</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #856404;">${totalExpiring}</p>
              <p style="margin: 5px 0 0 0; color: #856404;">tên miền</p>
            </div>
            <div style="flex: 1; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: #721c24;">🚨 Đã hết hạn</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #721c24;">${totalExpired}</p>
              <p style="margin: 5px 0 0 0; color: #721c24;">tên miền</p>
            </div>
          </div>
    `;

    if (totalExpiring > 0) {
      summaryHtml += `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #856404;">Tên miền sắp hết hạn (trong 30 ngày):</h3>
          <ul style="color: #856404;">
      `;
      expiringDomains.forEach(domain => {
        summaryHtml += `<li><strong>${domain.name}</strong> - ${domain.customer?.fullName || 'N/A'} (còn ${domain.daysUntilExpiry} ngày)</li>`;
      });
      summaryHtml += `</ul></div>`;
    }

    if (totalExpired > 0) {
      summaryHtml += `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #721c24;">Tên miền đã hết hạn:</h3>
          <ul style="color: #721c24;">
      `;
      expiredDomains.forEach(domain => {
        summaryHtml += `<li><strong>${domain.name}</strong> - ${domain.customer?.fullName || 'N/A'} (${Math.abs(domain.daysUntilExpiry)} ngày trước)</li>`;
      });
      summaryHtml += `</ul></div>`;
    }

    summaryHtml += `
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Email này được gửi tự động từ hệ thống quản lý DMS. 
              Vui lòng không trả lời email này.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const subject = `[DMS] Báo cáo tình trạng tên miền - ${currentDate}`;

    for (const email of adminEmails) {
      await sendEmail(email, subject, summaryHtml);
      console.log(`Domain status summary sent to: ${email}`);
    }

    return {
      success: true,
      sentTo: adminEmails,
      summary: {
        expiring: totalExpiring,
        expired: totalExpired
      }
    };
  } catch (error) {
    console.error('Error sending domain status summary:', error);
    throw error;
  }
};

module.exports = {
  sendExpiringDomainsNotification,
  sendExpiredDomainsNotification,
  sendDomainStatusSummary
}; 