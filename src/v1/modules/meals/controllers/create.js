const { TokenError } = require("@errors");
const { Meals } = require("@models");
const { getCalories } = require("@services/nutrition");

const createHandler = async (context, payload) => {
  const { user_id, num_of_calories, description } = payload;

  if (!context.isAdmin && user_id !== context.user.id) {
    throw new TokenError().noAccess();
  }

  if (!num_of_calories) {
    payload.num_of_calories = await getCalories(description);
  }

  const { id } = await Meals.addMeal(payload);

  return {
    data: { id },
    message: "Meal added successfully",
  };
};

module.exports = createHandler;
