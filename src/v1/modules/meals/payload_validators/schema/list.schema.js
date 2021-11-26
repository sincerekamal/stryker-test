const Joi = require("joi");
const { query, limit, offset } = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  query,
  limit,
  offset,
});
