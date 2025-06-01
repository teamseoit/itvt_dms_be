require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const corsOptions = require("./config/corsOptions");
const config = require("./config/env");
const connectDB = require("./config/connectDB");
const verifyAccessToken = require("./middleware/verifyAccessToken");
const initDefaultUser = require("./init/initUser");
const loadRoutes = require("./utils/loadRoutes");

const app = express();

app.set("trust proxy", true);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use("/uploads", express.static("uploads"));

const startServer = async () => {
  try {
    await connectDB();

    await initDefaultUser();

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
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
