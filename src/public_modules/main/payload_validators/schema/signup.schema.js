const Joi = require("joi");
const {
  email,
  password,
  first_name,
  last_name,
} = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  email: email.required(),
  password: password.required(),
  first_name: first_name.required(),
  last_name,
});
