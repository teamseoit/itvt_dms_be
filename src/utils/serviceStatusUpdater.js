const dayjs = require('dayjs');
const DomainServices = require('../models/services/domain/model');
const EmailServices = require('../models/services/email/model');
const HostingServices = require('../models/services/hosting/model');
const SslServices = require('../models/services/ssl/model');
const Customers = require('../models/customers/model');
const sendEmail = require('./sendEmail');
const config = require('../config/env');
const {
  calculateDaysUntilExpiry,
  determineStatus,
  getStatusText,
} = require('./serviceUtils');

async function bulkUpdateStatuses(Model, select = 'expiredAt status daysUntilExpiry') {
  const all = await Model.find({}).select(select).lean();
  const bulkOps = [];
  const expiringSoonIds = [];
  const expiredIds = [];

  for (const item of all) {
    const daysUntilExpiry = calculateDaysUntilExpiry(item.expiredAt);
    const status = determineStatus(daysUntilExpiry);

    if (status === 2) expiringSoonIds.push(item._id);
    if (status === 3) expiredIds.push(item._id);

    if (item.status !== status || item.daysUntilExpiry !== daysUntilExpiry) {
      bulkOps.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { status, daysUntilExpiry } }
        }
      });
    }
  }

  if (bulkOps.length > 0) {
    await Model.bulkWrite(bulkOps);
  }

  return {
    updatedCount: bulkOps.length,
    expiringSoonIds,
    expiredIds
  };
}

function formatRow(item, extra = {}) {
  const daysUntilExpiry = calculateDaysUntilExpiry(item.expiredAt);
  const status = determineStatus(daysUntilExpiry);
  const statusText = getStatusText(status, daysUntilExpiry);
  return {
    id: String(item._id),
    name: item.name,
    expiredAt: item.expiredAt,
    daysUntilExpiry,
    status,
    statusText,
    ...extra
  };
}

async function fetchExpiringAndExpired() {
  const now = new Date();
  const soon = dayjs().add(30, 'day').toDate();

  // Domains
  const domainsExpiring = await DomainServices.find({ expiredAt: { $gte: now, $lte: soon } })
    .populate({ path: 'customerId', select: 'fullName email' })
    .lean();
  const domainsExpired = await DomainServices.find({ expiredAt: { $lt: now } })
    .populate({ path: 'customerId', select: 'fullName email' })
    .lean();

  // Services with domain linkage
  const basePopulate = [
    { path: 'domainServiceId', select: 'name customerId', populate: { path: 'customerId', select: 'fullName email' } }
  ];

  const [
    emailExpiring, emailExpired,
    hostingExpiring, hostingExpired,
    sslExpiring, sslExpired
  ] = await Promise.all([
    EmailServices.find({ expiredAt: { $gte: now, $lte: soon } }).populate(basePopulate).lean(),
    EmailServices.find({ expiredAt: { $lt: now } }).populate(basePopulate).lean(),
    HostingServices.find({ expiredAt: { $gte: now, $lte: soon } }).populate(basePopulate).lean(),
    HostingServices.find({ expiredAt: { $lt: now } }).populate(basePopulate).lean(),
    SslServices.find({ expiredAt: { $gte: now, $lte: soon } }).populate(basePopulate).lean(),
    SslServices.find({ expiredAt: { $lt: now } }).populate(basePopulate).lean(),
  ]);

  return {
    domains: { expiring: domainsExpiring.map(d => ({ ...formatRow(d), customer: d.customerId })), expired: domainsExpired.map(d => ({ ...formatRow(d), customer: d.customerId })) },
    email: {
      expiring: emailExpiring.map(s => ({ ...formatRow(s), domain: s.domainServiceId, customer: s.domainServiceId?.customerId })),
      expired: emailExpired.map(s => ({ ...formatRow(s), domain: s.domainServiceId, customer: s.domainServiceId?.customerId })),
    },
    hosting: {
      expiring: hostingExpiring.map(s => ({ ...formatRow(s), domain: s.domainServiceId, customer: s.domainServiceId?.customerId })),
      expired: hostingExpired.map(s => ({ ...formatRow(s), domain: s.domainServiceId, customer: s.domainServiceId?.customerId })),
    },
    ssl: {
      expiring: sslExpiring.map(s => ({ ...formatRow(s), domain: s.domainServiceId, customer: s.domainServiceId?.customerId })),
      expired: sslExpired.map(s => ({ ...formatRow(s), domain: s.domainServiceId, customer: s.domainServiceId?.customerId })),
    }
  };
}

function buildConsolidatedHtml(payload) {
  const sections = [];
  const addSection = (title, items, renderRow) => {
    if (!items || items.length === 0) return;
    sections.push(`<h3>${title}</h3>`);
    sections.push('<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">');
    sections.push('<thead><tr><th>Tên</th><th>Khách hàng</th><th>Ngày hết hạn</th><th>Trạng thái</th></tr></thead>');
    sections.push('<tbody>');
    for (const r of items) sections.push(renderRow(r));
    sections.push('</tbody></table>');
  };

  const render = (item, name) => {
    const customerName = item.customer?.fullName || 'Không rõ';
    const statusText = getStatusText(item.status, item.daysUntilExpiry);
    const expiredAtStr = item.expiredAt ? dayjs(item.expiredAt).format('DD/MM/YYYY') : '';
    return `<tr><td>${name}</td><td>${customerName}</td><td>${expiredAtStr}</td><td>${statusText}</td></tr>`;
  };

  addSection('Tên miền sắp hết hạn (30 ngày)', payload.domains.expiring, (d) => render(d, d.name));
  addSection('Tên miền đã hết hạn', payload.domains.expired, (d) => render(d, d.name));

  const renderSvc = (s, svcName) => render(s, `${svcName} (${s.domain?.name || 'N/A'})`);
  addSection('Email sắp hết hạn (30 ngày)', payload.email.expiring, (s) => renderSvc(s, 'Email'));
  addSection('Email đã hết hạn', payload.email.expired, (s) => renderSvc(s, 'Email'));
  addSection('Hosting sắp hết hạn (30 ngày)', payload.hosting.expiring, (s) => renderSvc(s, 'Hosting'));
  addSection('Hosting đã hết hạn', payload.hosting.expired, (s) => renderSvc(s, 'Hosting'));
  addSection('SSL sắp hết hạn (30 ngày)', payload.ssl.expiring, (s) => renderSvc(s, 'SSL'));
  addSection('SSL đã hết hạn', payload.ssl.expired, (s) => renderSvc(s, 'SSL'));

  if (sections.length === 0) return '';
  return sections.join('<br/>' );
}

async function sendConsolidatedNotifications() {
  const payload = await fetchExpiringAndExpired();

  const totalItems = payload.domains.expiring.length + payload.domains.expired.length
    + payload.email.expiring.length + payload.email.expired.length
    + payload.hosting.expiring.length + payload.hosting.expired.length
    + payload.ssl.expiring.length + payload.ssl.expired.length;

  if (totalItems === 0) {
    return { sent: false, reason: 'No items to notify' };
  }

  const recipientsEnv = config.DOMAIN_ALERT_RECIPIENTS || config.EMAIL_TO || '';
  const recipients = recipientsEnv.split(',').map(s => s.trim()).filter(Boolean);
  if (recipients.length === 0) {
    return { sent: false, reason: 'No recipients configured' };
  }

  const subject = '[DMS] Cảnh báo sắp hết hạn / đã hết hạn (Tên miền + Dịch vụ)';
  const html = buildConsolidatedHtml(payload);
  await sendEmail(recipients.join(','), subject, html);

  return { sent: true, to: recipients, counts: {
    domains: { expiring: payload.domains.expiring.length, expired: payload.domains.expired.length },
    email: { expiring: payload.email.expiring.length, expired: payload.email.expired.length },
    hosting: { expiring: payload.hosting.expiring.length, expired: payload.hosting.expired.length },
    ssl: { expiring: payload.ssl.expiring.length, expired: payload.ssl.expired.length },
  } };
}

async function updateAllServiceStatuses(sendNotifications = false) {
  const [d, e, h, s] = await Promise.all([
    bulkUpdateStatuses(DomainServices, 'expiredAt status daysUntilExpiry'),
    bulkUpdateStatuses(EmailServices, 'expiredAt status daysUntilExpiry'),
    bulkUpdateStatuses(HostingServices, 'expiredAt status daysUntilExpiry'),
    bulkUpdateStatuses(SslServices, 'expiredAt status daysUntilExpiry'),
  ]);

  let notify = null;
  if (sendNotifications) {
    notify = await sendConsolidatedNotifications();
  }

  return {
    domains: d,
    email: e,
    hosting: h,
    ssl: s,
    notifications: notify
  };
}

module.exports = {
  updateAllServiceStatuses,
  sendConsolidatedNotifications
};


