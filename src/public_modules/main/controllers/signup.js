const { Users } = require("@models");

const signupHandler = async (context, payload) => {
  const user = await Users.createUser(payload);

  return {
    data: {
      id: user.id,
    },
    message: "User created successfully",
  };
};

module.exports = signupHandler;
