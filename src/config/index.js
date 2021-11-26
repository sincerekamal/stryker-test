"use strict";

const { version } = require("@root/package.json");

const { env } = process;

const getDefaultIfNotNumber = (value, defaultValue) => {
  return value == +value ? +value : defaultValue;
};

module.exports = {
  port: getDefaultIfNotNumber(env.SERVER_PORT, 3000),
  env: env.ENV_NAME || "dev",

  apiVersion: version,

  logging: {
    level: env.LOG_LEVEL || "debug",
  },

  db: {
    dialect: "mysql",
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mariadb",
    logging: env.ENABLE_QUERY_LOGS !== "false",
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  jwt: {
    secret: env.JWT_SECRET,
    algorithm: env.JWT_ALGORITHM,
    expiresIn: parseInt(env.JWT_EXPIRES_IN_SECONDS),
  },

  nutritionService: {
    url: env.NUTRITION_SVC_URL,
    appId: env.NUTRITION_SVC_APP_ID,
    appKey: env.NUTRITION_SVC_APP_KEY,
  },
};
