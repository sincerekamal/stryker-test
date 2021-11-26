const Joi = require("joi");
const { email, password } = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  email: email.required(),
  password: password.required(),
});
