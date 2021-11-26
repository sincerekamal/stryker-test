const { QueryTypes, Op } = require("sequelize");
const { createHash } = require("crypto");
const { v5 } = require("uuid");
const { ValidationError } = require("@errors");
const appEvents = require("@utils/AppEvents");
const { DEFAULT_USER_ROLE_ID, NAMESPACE } =
  require("@utils/appConstants").constants;

const donotExposeAttributes = {
  exclude: ["password"],
};

const getHash = (pwd) => {
  return createHash("sha256").update(pwd).digest("base64");
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
      },
      target_per_day_calories: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      target_is_weight_loss: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        field: "deleted_at",
        defaultValue: null,
      },
    },
    {
      defaultScope: {
        attributes: donotExposeAttributes,
      },
      scopes: {
        own(id) {
          // can RUD self record only
          return {
            attributes: donotExposeAttributes,
            where: {
              [Op.and]: [{ id }], // this way it will not be overwritten by `id` in user's where
            },
          };
        },
        manager(userId) {
          // can RUD default users or self records
          return {
            attributes: donotExposeAttributes,
            where: {
              [Op.or]: [
                {
                  role_id: DEFAULT_USER_ROLE_ID,
                },
                {
                  id: userId,
                },
              ],
            },
          };
        },
        admin: {
          // can do RUD on any record, so no "where"
          attributes: donotExposeAttributes,
        },
      },
    }
  );

  User.addHook("afterSave", (user) => {
    appEvents.emit("userInfoUpdate", { user_id: user.id });
  });

  User.createUser = async (params) => {
    const { email } = params;
    // check if email exists already
    const existingRecord = await User.findOne({
      where: {
        email,
      },
    });

    if (existingRecord) {
      throw new ValidationError(`User already exists with given email`);
    }

    const user = await User.create({
      role_id: DEFAULT_USER_ROLE_ID,
      ...params,
      password: getHash(params.password),
      id: v5(params.email, NAMESPACE),
      status: "active",
    });
    return user;
  };

  User.getDataForToken = async ({ email, password }) => {
    const user = await sequelize.query(
      `SELECT u.id, u.email, u.role_id FROM Users u WHERE 
      email = :email AND password = :password AND deleted_at IS NULL and status = "active" LIMIT 1`,
      {
        replacements: { email, password: getHash(password) },
        type: QueryTypes.SELECT,
      }
    );

    if (user.length) {
      return user[0];
    }

    throw new ValidationError(`No active user exist with given credentials`);
  };

  return User;
};
