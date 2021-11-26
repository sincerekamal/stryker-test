const Joi = require("joi");
const { uuidv5 } = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  id: uuidv5.required(),
});
