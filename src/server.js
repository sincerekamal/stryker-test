const express = require("express");
const fs = require("fs");
const path = require("path");
const { port } = require("@config");
const logger = require("@logger")("server");

const auth = require("@middlewares/auth");
const requestInitializer = require("@middlewares/requestInitializer");
const responseHandler = require("@middlewares/responseHandler");
const routeNotFoundHandler = require("@middlewares/routeNotFoundHandler");
const errorHandler = require("@errors/errorHandler");
const db = require("@models");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("*", requestInitializer);

// publically accessible endpoints
const publicModules = fs.readdirSync(path.resolve(__dirname, "public_modules"));
publicModules.forEach((m) => {
  const modulePath = path.resolve(__dirname, "public_modules", m, "route");
  app.use("/", require(modulePath)());
  logger.info(`${m} - public module loaded`);
});

// protected endpoints
app.use("/v1/*", auth.validate);

const modules = fs.readdirSync(path.resolve(__dirname, "v1", "modules"));
modules.forEach((m) => {
  const modulePath = path.resolve(__dirname, "v1", "modules", m, "route");
  app.use("/v1/", require(modulePath)());
  logger.info(`${m} - module loaded`);
});

// middleware to check if the requested resource is registered
app.use(routeNotFoundHandler);

// error handler
app.use(errorHandler);

app.use(responseHandler);

db.sequelize.sync({}).then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.debug(`App started running on PORT: ${port}`);
    }
  });
});

// Uncaught exception handling
process.on("uncaughtException", (err) => {
  logger.setMeta({ alert: "uncaughtException" }).error(err);
});

module.exports = app;
