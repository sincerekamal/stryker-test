const { Users } = require("@models");
const { generateToken } = require("@middlewares/auth");

const createTokenHandler = async (context, payload) => {
  const { email, password } = payload;

  // returns data only if matching user found
  const data = await Users.getDataForToken({
    email,
    password,
  });

  const tokenRes = await generateToken({
    data,
  });

  return {
    data: {
      ...tokenRes,
    },
    message: "Token created successfully",
  };
};

module.exports = createTokenHandler;
