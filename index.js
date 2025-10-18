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
const { updateAllServiceStatuses, sendConsolidatedNotifications } = require('./src/utils/serviceStatusUpdater');
const mongoose = require('mongoose');

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
      // Thứ tự: cập nhật status -> nếu có dịch vụ cần gửi thì gửi email (gộp theo tên miền)
      cron.schedule('0 0 * * *', async () => {
        const startTime = new Date();
        console.log(`[CRON] ===== Starting service status update at ${startTime.toISOString()} =====`);
        
        try {
          // Kiểm tra kết nối database trước khi chạy
          if (!mongoose.connection.readyState) {
            throw new Error('Database connection not ready');
          }
          
          console.log('[CRON] Database connection verified');
          
          // Cập nhật status tất cả dịch vụ
          console.log('[CRON] Updating service statuses...');
          const result = await updateAllServiceStatuses(false);
          console.log('[CRON] Updated services:', JSON.stringify(result, null, 2));

          // Gửi thông báo email
          console.log('[CRON] Sending notifications...');
          const notify = await sendConsolidatedNotifications();
          console.log('[CRON] Notification result:', JSON.stringify(notify, null, 2));
          
          const endTime = new Date();
          const duration = endTime - startTime;
          console.log(`[CRON] ===== Completed in ${duration}ms at ${endTime.toISOString()} =====`);
          
        } catch (err) {
          console.error('[CRON] Error running domain status cron:', err);
          console.error('[CRON] Error stack:', err.stack);
          
          // Gửi email báo lỗi cho admin
          try {
            const sendEmail = require('./src/utils/sendEmail');
            await sendEmail(
              config.EMAIL_TO || config.DOMAIN_ALERT_RECIPIENTS,
              '[DMS ERROR] Cronjob Failed',
              `<h2>Cronjob Error Report</h2>
               <p><strong>Time:</strong> ${new Date().toISOString()}</p>
               <p><strong>Error:</strong> ${err.message}</p>
               <pre>${err.stack}</pre>`
            );
            console.log('[CRON] Error notification email sent');
          } catch (emailErr) {
            console.error('[CRON] Failed to send error notification email:', emailErr);
          }
        }
      }, { timezone: 'Asia/Ho_Chi_Minh' });
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
