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
const { updateDomainServicesStatus, sendDomainNotifications } = require('./src/utils/domainStatusUpdater');

const app = express();

app.set("trust proxy", true);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const startServer = async () => {
  try {
    await connectDB();
    await initAll();

    loadRoutes(app, verifyAccessToken);

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

      // Cron: chạy mỗi ngày lúc 00:00
      // Thứ tự: cập nhật status -> nếu có domain cần gửi thì gửi email
      cron.schedule('0 0 * * *', async () => {
        try {
          console.log('[CRON] Start domain status update at 00:00');
          const result = await updateDomainServicesStatus(false);
          console.log('[CRON] Updated domains:', result);

          const notify = await sendDomainNotifications();
          console.log('[CRON] Notification result:', notify);
        } catch (err) {
          console.error('[CRON] Error running domain status cron:', err);
        }
      }, { timezone: 'Asia/Ho_Chi_Minh' });
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
