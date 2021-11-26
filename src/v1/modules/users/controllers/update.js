const getHandler = require("./get");
const { TokenError } = require("@errors");

const updateHandler = async (context, payload) => {
  const { data: user } = await getHandler(context, payload);

  const {
    id,
    role_id,
    first_name,
    last_name,
    password,
    target_per_day_calories,
    target_is_weight_loss,
  } = payload;

  if (!context.isAdmin && context.user.role_id <= role_id) {
    throw new TokenError().noAccess();
  }

  await user.update(
    {
      ...(role_id && { role_id }),
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...(password && { password }),
      ...(target_per_day_calories && { target_per_day_calories }),
      ...(typeof target_is_weight_loss != "undefined" && {
        target_is_weight_loss,
      }),
    },
    {
      where: {
        id,
      },
    }
  );

  return {
    data: { id },
    message: "User updated successfully",
  };
};

module.exports = updateHandler;
