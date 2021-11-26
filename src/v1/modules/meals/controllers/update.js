const getHandler = require("./get");
const { getCalories } = require("@services/nutrition");

const updateHandler = async (context, payload) => {
  // access will be checked in getHandler itself, so no need to check again
  const { data: existingMeal } = await getHandler(context, payload);

  let { id, description, num_of_calories, date, time } = payload;

  if (!num_of_calories && description) {
    num_of_calories = await getCalories(description);
  }

  await existingMeal.update(
    {
      ...(description && { description }),
      ...(num_of_calories && { num_of_calories }),
      ...(date && { date }),
      ...(time && { time }),
    },
    {
      where: {
        id,
      },
    }
  );

  return {
    data: { id },
    message: "Meal updated successfully",
  };
};

module.exports = updateHandler;
