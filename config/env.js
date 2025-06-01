require("dotenv").config();

const APP_ENV = process.env.APP_ENV || "local";

const envConfig = {
  local: {
    DB_NAME: process.env.DB_NAME_LOCAL,
    PORT: process.env.PORT_LOCAL,
    CORS_ORIGIN: process.env.CORS_ORIGIN_LOCAL,
  },
  test: {
    DB_NAME: process.env.DB_NAME_TEST,
    PORT: process.env.PORT_TEST,
    CORS_ORIGIN: process.env.CORS_ORIGIN_TEST,
  },
  prod: {
    DB_NAME: process.env.DB_NAME_PROD,
    PORT: process.env.PORT_PROD,
    CORS_ORIGIN: process.env.CORS_ORIGIN_PROD,
  },
};

const current = envConfig[APP_ENV];

module.exports = {
  APP_ENV,
  ...current,
  MONGO_URL: process.env.MONGO_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};
