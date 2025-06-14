require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const cron = require("node-cron");

const corsOptions = require("./src/config/corsOptions");
const config = require("./src/config/env");
const connectDB = require("./src/config/connectDB");
const verifyAccessToken = require("./src/middleware/verifyAccessToken");
const initAll = require("./src/init");
const loadRoutes = require("./src/utils/loadRoutes");
const { updateDomainServicesStatus } = require("./src/utils/domainStatusUpdater");

const app = express();

app.set("trust proxy", true);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cron job để cập nhật domain status và gửi email thông báo hàng ngày lúc 08:00
const setupDomainStatusCron = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running daily domain status update and notifications...');
      const result = await updateDomainServicesStatus(true); // Gửi email thông báo
      console.log('Daily domain status update and notifications completed:', result);
    } catch (error) {
      console.error('Error in daily domain status update and notifications:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });
  
  console.log('Domain status cron job scheduled (daily at 08:00 with email notifications)');
};

// Cron job để gửi email thông báo domain sắp hết hạn hàng tuần (Thứ 2 lúc 09:00)
const setupWeeklyDomainNotificationCron = () => {
  cron.schedule('0 9 * * 1', async () => {
    try {
      console.log('Running weekly domain notification...');
      const { sendDomainNotifications } = require('./src/utils/domainStatusUpdater');
      const result = await sendDomainNotifications();
      console.log('Weekly domain notification completed:', result);
    } catch (error) {
      console.error('Error in weekly domain notification:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });
  
  console.log('Weekly domain notification cron job scheduled (Monday at 09:00)');
};

const startServer = async () => {
  try {
    await connectDB();
    await initAll();

    loadRoutes(app, verifyAccessToken);

    // Thiết lập cron jobs
    setupDomainStatusCron();
    setupWeeklyDomainNotificationCron();

    const port = config.PORT;
    const baseUrl = `http://localhost:${port}`;
    const environment = config.APP_ENV.toUpperCase();
    const domain = config.CORS_ORIGIN;

    app.listen(port, () => {
      console.log("========================================================");
      console.log(`Server is running`);
      console.log(`URL: ${baseUrl}`);
      console.log(`Port: ${port}`);
      console.log(`Environment: ${environment}`);
      console.log(`Domain: ${domain}`);
      console.log("========================================================");
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
