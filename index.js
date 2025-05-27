const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');
var morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require('./connectDB');

const cron = require('./controllers/services/domain/cron/index')
const { check_token_api } = require('./middleware/middleware_role')

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

// login
const loginRoutes = require("./routes/login/login");

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

dotenv.config();

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

  /* dms */
  // origin: 'https://webdms.itvungtau.com.vn',
  // credentials: true,
  // optionsSuccessStatus: 200,
};

app.set('trust proxy', true);

app.use(cors(corsOptions));

app.use(morgan("common"));
app.use('/uploads', express.static('uploads'));

// các gói dịch vụ
app.use("/v1/plans/domain", check_token_api, domainPlansRoutes);
app.use("/v1/plans/email", check_token_api, emailPlansRoutes);
app.use("/v1/plans/hosting", check_token_api, hostingPlansRoutes);
app.use("/v1/plans/ssl", check_token_api, sslPlansRoutes);
app.use("/v1/plans/content", check_token_api, contentPlansRoutes);
app.use("/v1/plans/content", check_token_api, contentPlansRoutes);
app.use("/v1/plans/maintenance", check_token_api, maintenancePlansRoutes);
app.use("/v1/plans/mobile-network", check_token_api, mobileNetworkPlansRoutes);
app.use("/v1/plans/server", check_token_api, serverPlansRoutes);

// khách hàng
app.use("/v1/customer", check_token_api, customerRoutes);

// nhà cung cấp
app.use("/v1/supplier", check_token_api, supplierRoutes);
app.use("/v1/mobile-network", check_token_api, mobileNetworkRoutes);
app.use("/v1/server", check_token_api, serverRoutes);

// dịch vụ
app.use("/v1/services/domain", check_token_api, domainServicesRoutes);
app.use("/v1/services/hosting", check_token_api, hostingServicesRoutes);
app.use("/v1/services/email", check_token_api, emailServicesRoutes);
app.use("/v1/services/ssl", check_token_api, sslServicesRoutes);
app.use("/v1/services/content", check_token_api, contentServicesRoutes);
app.use("/v1/services/website", check_token_api, websiteServicesRoutes);
app.use("/v1/services/toplist", check_token_api, toplistServicesRoutes);
app.use("/v1/services/maintenance", check_token_api, maintenanceServicesRoutes);
app.use("/v1/services/mobile-network", check_token_api, mobileNetworkServicesRoutes);

// hợp đồng
app.use("/v1/contracts", check_token_api, contractRoutes);

// users
app.use("/v1/users", check_token_api, userRoutes);
app.use("/v1/group-user", check_token_api, groupUserRoutes);

// login
app.use("/v1/login", loginRoutes);

// functions
app.use("/v1/functions", check_token_api, functionRoutes);

// action logs 
app.use("/v1/action-logs", check_token_api, actionLogsRoutes);

// itvt
app.use("/v1/itvt/domain", check_token_api, itvtDomainRoutes);
app.use("/v1/itvt/ssl", check_token_api, itvtSSLRoutes);

// statistics
app.use("/v1/statistics", check_token_api, statisticsRoutes);

// backups
app.use("/v1/backups", check_token_api, backupsRoutes);

// ip whitelist
app.use("/v1/ip-whitelist", check_token_api, ipWhitelistRoutes);
app.use("/v1/valid", ipWhitelistRoutes);

const PORT = process.env.PORT || 3123;
app.listen(PORT, () => {console.log(`Server đang chạy... ${PORT}`);});
