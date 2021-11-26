const { NotFoundError } = require("@errors");
const { Users } = require("@models");

const getHandler = async (context, payload) => {
  const user = await Users.scope(context.dataScope).findOne({
    where: { id: payload.id },
  });

  if (!user) {
    throw new NotFoundError(`Requested data not found or you don't have enough access`);
  }

  return {
    data: user,
    message: "User data fetched successfully",
  };
};

module.exports = getHandler;
