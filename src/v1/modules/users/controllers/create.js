const { TokenError } = require("@errors");
const { Users } = require("@models");

const createHandler = async (context, payload) => {
  const { role_id } = payload;

  if (context.user.role_id === 1 || (context.user.role_id === 2 && role_id > 1)) {
    throw new TokenError().noAccess();
  }

  const { id } = await Users.createUser(payload);

  return {
    data: { id },
    message: "User created successfully",
  };
};

module.exports = createHandler;
