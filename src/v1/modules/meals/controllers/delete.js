const getHandler = require("./get");

const deleteHandler = async (context, payload) => {
  // access will be checked in getHandler itself, so no need to check again
  const { data: existingMeal } = await getHandler(context, payload);

  await existingMeal.destroy();

  return {
    data: { id: existingMeal.id },
    message: "Meal deleted successfully",
  };
};

module.exports = deleteHandler;
