/* eslint-disable no-undef */
require("dotenv").config();

const config = {
  baseUrl: process.env.BASE_URL,
  rateLimitConfig: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  },
  whitelist: [null, undefined, "null"].includes(process.env.WHITE_LIST)
    ? null
    : process.env.WHITE_LIST.split(","),
  corsOptions: {
    exposedHeaders: "authorization, x-refresh-token, x-token-expiry-time",
    origin: (origin, callback) => {
      if (!origin) {
        //for bypassing postman req with  no origin
        return callback(null, true);
      }
      if (!whitelist || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  },
  env: process.env.NODE_ENV,

  port: process.env.PORT,
  website: process.env.WEBSITE,


};

module.exports = config;
