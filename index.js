const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');
var morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require('./connectDB');
const verifyAccessToken = require('./middleware/verifyAccessToken');

dotenv.config();

app.set('trust proxy', true);
app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({extended:true, limit:'500mb'})); 

const corsOptions = {
  /* dms localhost */
	origin: 'http://localhost:3066',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
	optionsSuccessStatus: 200,

  /* dms test */
  // origin: 'https://dmstest.thietkewebvungtau.com',
  // credentials: true,
  // optionsSuccessStatus: 200,

  /* dms web */
  // origin: 'https://webdms.itvungtau.com.vn',
  // credentials: true,
  // optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(morgan("common"));
app.use('/uploads', express.static('uploads'));

/***** import route *****/
// gói dịch vụ
const domainPlansRoutes = require("./routes/plans/domain/domain");
const emailPlansRoutes = require("./routes/plans/email/email");
const hostingPlansRoutes = require("./routes/plans/hosting/hosting");
const sslPlansRoutes = require("./routes/plans/ssl/ssl");
const contentPlansRoutes = require("./routes/plans/content/content");
const maintenancePlansRoutes = require("./routes/plans/maintenance/maintenance");
const mobileNetworkPlansRoutes = require("./routes/plans/mobile-network/mobileNetwork");
const serverPlansRoutes = require("./routes/plans/server/server");

// khách hàng
const customerRoutes = require("./routes/customers/customer");

// nhà cung cấp
const supplierRoutes = require("./routes/suppliers/supplier");
const mobileNetworkRoutes = require("./routes/suppliers/mobile-network");
const serverRoutes = require("./routes/suppliers/server");

// dịch vụ
const domainServicesRoutes = require("./routes/services/domain/domain");
const hostingServicesRoutes = require("./routes/services/hosting/hosting");
const emailServicesRoutes = require("./routes/services/email/email");
const sslServicesRoutes = require("./routes/services/ssl/ssl");
const contentServicesRoutes = require("./routes/services/content/content");
const websiteServicesRoutes = require("./routes/services/website/website");
const toplistServicesRoutes = require("./routes/services/toplist/toplist");
const maintenanceServicesRoutes = require("./routes/services/maintenance/maintenance");
const mobileNetworkServicesRoutes = require("./routes/services/mobile-network/mobileNetwork");

// hợp đồng
const contractRoutes = require("./routes/contracts/contracts");

// user
const userRoutes = require("./routes/users/user");
const groupUserRoutes = require("./routes/group-user/group-user");

// auth
const authRoutes = require("./routes/auth/login");

// functions
const functionRoutes = require("./routes/roles/functions");

// logs action
const actionLogsRoutes = require("./routes/action-logs/action_logs");

// itvt
const itvtDomainRoutes = require("./routes/itvt/domain/domain");
const itvtSSLRoutes = require("./routes/itvt/ssl/ssl");

// statistics
const statisticsRoutes = require("./routes/statistics/statistics");

// backups
const backupsRoutes = require("./routes/backups/backups");

// ip whitelist
const ipWhitelistRoutes = require("./routes/ip-whitelist/ip-whitelist");


/***** api *****/
// auth
app.use("/api/auth", authRoutes);

// functions
app.use("/api/functions", verifyAccessToken, functionRoutes);

// action logs 
app.use("/api/action-logs", verifyAccessToken, actionLogsRoutes);

// ip whitelist
app.use("/api/ip-whitelist", verifyAccessToken, ipWhitelistRoutes);
app.use("/api/valid", ipWhitelistRoutes);

// statistics
app.use("/api/statistics", verifyAccessToken, statisticsRoutes);

// users
app.use("/api/users", verifyAccessToken, userRoutes);
app.use("/api/group-user", verifyAccessToken, groupUserRoutes);

// nhà cung cấp
app.use("/api/supplier", verifyAccessToken, supplierRoutes);
app.use("/api/mobile-network", verifyAccessToken, mobileNetworkRoutes);
app.use("/api/server", verifyAccessToken, serverRoutes);

// các gói dịch vụ
app.use("/api/plans/domain", verifyAccessToken, domainPlansRoutes);
app.use("/api/plans/email", verifyAccessToken, emailPlansRoutes);
app.use("/api/plans/hosting", verifyAccessToken, hostingPlansRoutes);
app.use("/api/plans/ssl", verifyAccessToken, sslPlansRoutes);
app.use("/api/plans/content", verifyAccessToken, contentPlansRoutes);
app.use("/api/plans/content", verifyAccessToken, contentPlansRoutes);
app.use("/api/plans/maintenance", verifyAccessToken, maintenancePlansRoutes);
app.use("/api/plans/mobile-network", verifyAccessToken, mobileNetworkPlansRoutes);
app.use("/api/plans/server", verifyAccessToken, serverPlansRoutes);

// khách hàng
app.use("/api/customer", verifyAccessToken, customerRoutes);

// dịch vụ
app.use("/api/services/domain", verifyAccessToken, domainServicesRoutes);
app.use("/api/services/hosting", verifyAccessToken, hostingServicesRoutes);
app.use("/api/services/email", verifyAccessToken, emailServicesRoutes);
app.use("/api/services/ssl", verifyAccessToken, sslServicesRoutes);
app.use("/api/services/content", verifyAccessToken, contentServicesRoutes);
app.use("/api/services/website", verifyAccessToken, websiteServicesRoutes);
app.use("/api/services/toplist", verifyAccessToken, toplistServicesRoutes);
app.use("/api/services/maintenance", verifyAccessToken, maintenanceServicesRoutes);
app.use("/api/services/mobile-network", verifyAccessToken, mobileNetworkServicesRoutes);

// hợp đồng
app.use("/api/contracts", verifyAccessToken, contractRoutes);

// itvt
app.use("/api/itvt/domain", verifyAccessToken, itvtDomainRoutes);
app.use("/api/itvt/ssl", verifyAccessToken, itvtSSLRoutes);

// backups
app.use("/api/backups", verifyAccessToken, backupsRoutes);

const PORT = process.env.PORT || 3123;
app.listen(PORT, () => {console.log(`Server đang chạy... ${PORT}`);});
