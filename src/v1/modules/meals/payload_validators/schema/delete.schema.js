const Joi = require("joi");
const { uuidv4 } = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  id: uuidv4.required(),
});
