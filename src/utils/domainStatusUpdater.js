const dayjs = require('dayjs');
const DomainServices = require('../models/services/domain/model');
const Customers = require('../models/customers/model');
const sendEmail = require('./sendEmail');
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText,
} = require('./serviceUtils');

function formatDomainRow(domain) {
  const customerName = domain.customer?.fullName || 'Không rõ';
  const customerEmail = domain.customer?.email || '';
  const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiredAt);
  const status = determineStatus(daysUntilExpiry);
  const statusText = getStatusText(status, daysUntilExpiry);
  return {
    id: String(domain._id),
    name: domain.name,
    expiredAt: domain.expiredAt,
    daysUntilExpiry,
    status,
    statusText,
    customerName,
    customerEmail
  };
}

async function updateDomainServicesStatus(sendNotifications = false) {
  const all = await DomainServices.find({}).select(
    'name expiredAt status daysUntilExpiry customerId'
  ).lean();

  const bulkOps = [];
  const expiringSoon = [];
  const expired = [];

  const now = dayjs();

  for (const d of all) {
    const daysUntilExpiry = calculateDaysUntilExpiry(d.expiredAt);
    const status = determineStatus(daysUntilExpiry);

    if (status === 2) expiringSoon.push(d._id);
    if (status === 3) expired.push(d._id);

    if (d.status !== status || d.daysUntilExpiry !== daysUntilExpiry) {
      bulkOps.push({
        updateOne: {
          filter: { _id: d._id },
          update: { $set: { status, daysUntilExpiry } }
        }
      });
    }
  }

  if (bulkOps.length > 0) {
    await DomainServices.bulkWrite(bulkOps);
  }

  let notifyResult = null;
  if (sendNotifications) {
    notifyResult = await sendDomainNotifications();
  }

  return {
    updatedCount: bulkOps.length,
    expiringSoonCount: expiringSoon.length,
    expiredCount: expired.length,
    notifications: notifyResult
  };
}

async function getExpiringDomains(days = 30) {
  const now = new Date();
  const soon = dayjs().add(days, 'day').toDate();
  const items = await DomainServices.find({
    expiredAt: { $gte: now, $lte: soon }
  })
    .populate({ path: 'customerId', select: 'fullName email' })
    .lean();

  return items.map(d => {
    const row = formatDomainRow({ ...d, customer: d.customerId });
    return row;
  });
}

async function getExpiredDomains() {
  const now = new Date();
  const items = await DomainServices.find({
    expiredAt: { $lt: now }
  })
    .populate({ path: 'customerId', select: 'fullName email' })
    .lean();

  return items.map(d => {
    const row = formatDomainRow({ ...d, customer: d.customerId });
    return row;
  });
}

function buildEmailHtml({ expiring, expired }) {
  const sections = [];

  if (expiring.length > 0) {
    const rows = expiring.map(x => `
      <tr>
        <td>${x.name}</td>
        <td>${x.customerName}</td>
        <td>${x.customerEmail}</td>
        <td>${dayjs(x.expiredAt).format('DD/MM/YYYY')}</td>
        <td>${x.statusText}</td>
      </tr>
    `).join('');

    sections.push(`
      <h3>Danh sách tên miền sắp hết hạn</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <thead>
          <tr>
            <th>Tên miền</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>Ngày hết hạn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `);
  }

  if (expired.length > 0) {
    const rows = expired.map(x => `
      <tr>
        <td>${x.name}</td>
        <td>${x.customerName}</td>
        <td>${x.customerEmail}</td>
        <td>${dayjs(x.expiredAt).format('DD/MM/YYYY')}</td>
        <td>${x.statusText}</td>
      </tr>
    `).join('');

    sections.push(`
      <h3>Danh sách tên miền đã hết hạn</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <thead>
          <tr>
            <th>Tên miền</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>Ngày hết hạn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `);
  }

  return sections.join('<br/>' );
}

async function sendDomainNotifications() {
  const expiring = await getExpiringDomains(30);
  const expired = await getExpiredDomains();

  if (expiring.length === 0 && expired.length === 0) {
    return { sent: false, reason: 'No domains to notify' };
  }

  const recipientsEnv = process.env.DOMAIN_ALERT_RECIPIENTS || process.env.EMAIL_TO || '';
  const recipients = recipientsEnv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return { sent: false, reason: 'No recipients configured' };
  }

  const subject = '[DMS] Cảnh báo tên miền sắp hết hạn / đã hết hạn';
  const html = buildEmailHtml({ expiring, expired });

  // Gửi 1 email tới nhóm
  await sendEmail(recipients.join(','), subject, html);

  return { sent: true, to: recipients, expiring: expiring.length, expired: expired.length };
}

module.exports = {
  updateDomainServicesStatus,
  getExpiringDomains,
  getExpiredDomains,
  sendDomainNotifications
};


