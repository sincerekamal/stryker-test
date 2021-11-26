const { NotFoundError } = require("@errors");
const { Meals } = require("@models");

const getHandler = async (context, payload) => {
  const meal = await Meals.findOne({
    where: {
      id: payload.id,
      ...(!context.isAdmin && { user_id: context.user.id }),
    },
  });

  if (!meal) {
    throw new NotFoundError(
      `Requested data not found or you don't have enough access`
    );
  }

  return {
    data: meal,
    message: "Meal data fetched successfully",
  };
};

module.exports = getHandler;
