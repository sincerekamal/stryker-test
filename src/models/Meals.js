const { QueryTypes, Op } = require("sequelize");
const { v4 } = require("uuid");
const appEvents = require("@utils/AppEvents");

module.exports = (sequelize, DataTypes) => {
  const User = require("./User")(sequelize, DataTypes);
  const Meals = sequelize.define("Meals", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_of_calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    as_per_goal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  const updateGoalViolation = async ({ user_id }) => {
    const user = await User.findOne({
      where: {
        id: user_id,
      },
    });

    const { target_per_day_calories, target_is_weight_loss } = user;
    const records = await sequelize.query(
      `select date, sum(num_of_calories) as total from fitness.meals where user_id = :user_id group by date, user_id `,
      {
        replacements: { user_id },
        type: QueryTypes.SELECT,
      }
    );

    if (!records || !records.length) return; // nothing to do, so return

    for (let record of records) {
      const { total, date } = record;

      await Meals.update(
        {
          as_per_goal: target_per_day_calories
            ? target_is_weight_loss
              ? total < target_per_day_calories // weight loss goal, so shouldn't eat more
              : total > target_per_day_calories // weight gain goal, so should eat at least set value
            : true, // no goal
        },
        {
          where: {
            user_id,
            date,
          },
        }
      );
    }
  };

  Meals.addHook("afterSave", updateGoalViolation);
  Meals.addHook("afterDestroy", updateGoalViolation);

  appEvents.on("userInfoUpdate", ({ user_id }) => {
    updateGoalViolation({ user_id });
  });

  Meals.addMeal = async (params) => {
    const user = await Meals.create({
      ...params,
      id: v4(),
    });
    return user;
  };

  return Meals;
};
