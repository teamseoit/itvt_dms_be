const config = require("./env");

const corsOptions = {
  origin: config.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
