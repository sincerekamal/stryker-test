"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const { db: config } = require("@config");
const logger = require("@logger")("DBLogger");
const { DatabaseError } = require("@errors");
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: (...args) => {
      logger.info(args[0]);
    },
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.query = async function () {
  // proxy this call
  // since `query` is a promise, we can just use promise functions instead of try-catch
  return Sequelize.prototype.query.apply(this, arguments).catch(function (err) {
    logger.log(err);

    // rethrow error
    throw new DatabaseError(err);
  });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.withScope = (scopeName, ...args) => {
  return {
    method: [scopeName, ...args],
  };
};

module.exports = db;
