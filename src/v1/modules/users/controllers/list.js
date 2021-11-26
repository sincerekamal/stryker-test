const { Users, sequelize } = require("@models");
const { replaceOps } = require("@utils/helpers");

const listHandler = async (context, payload) => {
  const { query, limit, offset } = payload;
  const { rows, count } = await Users.scope(context.dataScope).findAndCountAll({
    where: sequelize.literal(`${replaceOps(query)}`),
    limit,
    offset,
  });

  return {
    data: rows,
    message: rows.length
      ? "User(s) data fetched successfully"
      : "No matching records",
    extraResult: {
      limit,
      offset,
      totalCount: count,
    },
  };
};

module.exports = listHandler;
