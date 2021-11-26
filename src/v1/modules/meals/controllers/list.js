const { Op } = require("sequelize");
const { Meals, sequelize } = require("@models");
const { replaceOps } = require("@utils/helpers");

const listHandler = async (context, payload) => {
  const { query, limit, offset } = payload;
  
  const { rows, count } = await Meals.findAndCountAll({
    where: {
      [Op.and]: [
        sequelize.literal(`${replaceOps(query)}`),
        ...(!context.isAdmin ? [{ user_id: context.user.id }] : []),
      ],
    },
    limit,
    offset,
  });

  return {
    data: rows,
    message: rows.length
      ? "Meal(s) data fetched successfully"
      : "No matching records",
    extraResult: {
      limit,
      offset,
      totalCount: count,
    },
  };
};

module.exports = listHandler;
