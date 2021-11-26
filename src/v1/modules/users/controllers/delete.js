const getHandler = require("./get");

const deleteHandler = async (context, payload) => {
  const { data: user } = await getHandler(context, payload);

  const { id } = payload;

  await user.update(
    {
      status: "inactive",
      deleted_at: Date.now(),
    },
    {
      where: {
        id,
      },
    }
  );

  return {
    data: { id },
    message: "User deleted successfully",
  };
};

module.exports = deleteHandler;
