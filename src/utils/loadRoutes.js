module.exports = function loadRoutes(app, verifyAccessToken) {
  // login
  const authRoutes = require("../routes/auth/login");

  // các chức năng
  const roleRoutes = require("../routes/roles/roles");
  const permissionRoutes = require("../routes/permissions/permissions");

  // lịch sử thao tác
  const actionLogsRoutes = require("../routes/action-logs/actionLogs");

  // ip whitelist
  const ipWhitelistRoutes = require("../routes/ip-whitelist/ipWhitelist");

  // thống kê
  const statisticsRoutes = require("../routes/statistics/statistics");

  // tài khoản và nhóm phân quyền
  const userRoutes = require("../routes/users/user");
  const groupUserRoutes = require("../routes/group-user/groupUser");

  // khách hàng
  const customerRoutes = require("../routes/customers/customer");

  // nhà cung cấp
  const supplierServiceRoutes = require("../routes/suppliers/service");
  const supplierNetworkRoutes = require("../routes/suppliers/network");
  const supplierServerRoutes = require("../routes/suppliers/server");

  // gói dịch vụ
  const domainPlansRoutes = require("../routes/plans/domain/domain");
  const emailPlansRoutes = require("../routes/plans/email/email");
  const hostingPlansRoutes = require("../routes/plans/hosting/hosting");
  const sslPlansRoutes = require("../routes/plans/ssl/ssl");
  const contentPlansRoutes = require("../routes/plans/content/content");
  const maintenancePlansRoutes = require("../routes/plans/maintenance/maintenance");
  const mobileNetworkPlansRoutes = require("../routes/plans/mobile-network/mobileNetwork");
  const serverPlansRoutes = require("../routes/plans/server/server");

  // dịch vụ itvt
  const itvtDomainRoutes = require("../routes/itvt/domain/domain");
  const itvtSSLRoutes = require("../routes/itvt/ssl/ssl");

  // dịch vụ
  const domainServicesRoutes = require("../routes/services/domain/domain");
  const hostingServicesRoutes = require("../routes/services/hosting/hosting");
  const emailServicesRoutes = require("../routes/services/email/email");
  const sslServicesRoutes = require("../routes/services/ssl/ssl");
  const contentServicesRoutes = require("../routes/services/content/content");
  const websiteServicesRoutes = require("../routes/services/website/website");
  const toplistServicesRoutes = require("../routes/services/toplist/toplist");
  const maintenanceServicesRoutes = require("../routes/services/maintenance/maintenance");
  const mobileNetworkServicesRoutes = require("../routes/services/mobile-network/mobileNetwork");

  // hợp đồng
  const contractRoutes = require("../routes/contracts/contracts");

  // backup data
  const backupsRoutes = require("../routes/backups/backups");

  const routes = [
    // login
    { path: "/api/auth", handler: authRoutes },

    // các chức năng
    { path: "/api/roles", handler: roleRoutes, protected: true },
    { path: "/api/permissions", handler: permissionRoutes, protected: true },

    // lịch sử thao tác
    { path: "/api/action-logs", handler: actionLogsRoutes, protected: true },

    // ip whitelist
    { path: "/api/ip-whitelist", handler: ipWhitelistRoutes, protected: true },
    { path: "/api/valid", handler: ipWhitelistRoutes },

    // thống kê
    { path: "/api/statistics", handler: statisticsRoutes, protected: true },

    // tài khoản và nhóm phân quyền
    { path: "/api/users", handler: userRoutes, protected: true },
    { path: "/api/group-user", handler: groupUserRoutes, protected: true },

    // khách hàng
    { path: "/api/customer", handler: customerRoutes, protected: true },

    // nhà cung cấp
    { path: "/api/supplier/service", handler: supplierServiceRoutes, protected: true },
    { path: "/api/supplier/network", handler: supplierNetworkRoutes, protected: true },
    { path: "/api/supplier/server", handler: supplierServerRoutes, protected: true },

    // gói dịch vụ
    { path: "/api/plans/domain", handler: domainPlansRoutes, protected: true },
    { path: "/api/plans/email", handler: emailPlansRoutes, protected: true },
    { path: "/api/plans/hosting", handler: hostingPlansRoutes, protected: true },
    { path: "/api/plans/ssl", handler: sslPlansRoutes, protected: true },
    { path: "/api/plans/content", handler: contentPlansRoutes, protected: true },
    { path: "/api/plans/maintenance", handler: maintenancePlansRoutes, protected: true },
    { path: "/api/plans/mobile-network", handler: mobileNetworkPlansRoutes, protected: true },
    { path: "/api/plans/server", handler: serverPlansRoutes, protected: true },

    // dich vu itvt
    { path: "/api/itvt/domain", handler: itvtDomainRoutes, protected: true },
    { path: "/api/itvt/ssl", handler: itvtSSLRoutes, protected: true },

    // dịch vụ
    { path: "/api/services/domain", handler: domainServicesRoutes, protected: true },
    { path: "/api/services/hosting", handler: hostingServicesRoutes, protected: true },
    { path: "/api/services/email", handler: emailServicesRoutes, protected: true },
    { path: "/api/services/ssl", handler: sslServicesRoutes, protected: true },
    { path: "/api/services/content", handler: contentServicesRoutes, protected: true },
    { path: "/api/services/website", handler: websiteServicesRoutes, protected: true },
    { path: "/api/services/toplist", handler: toplistServicesRoutes, protected: true },
    { path: "/api/services/maintenance", handler: maintenanceServicesRoutes, protected: true },
    { path: "/api/services/mobile-network", handler: mobileNetworkServicesRoutes, protected: true },

    // hợp đồng
    { path: "/api/contracts", handler: contractRoutes, protected: true },

    // backup data
    { path: "/api/backups", handler: backupsRoutes, protected: true },
  ];

  routes.forEach(({ path, handler, protected: isProtected }) => {
    if (isProtected) {
      app.use(path, verifyAccessToken, handler);
    } else {
      app.use(path, handler);
    }
  });
};
