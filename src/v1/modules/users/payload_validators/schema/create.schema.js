const Joi = require("joi");
const {
  email,
  password,
  first_name,
  last_name,
  role_id,
  target_per_day_calories,
  target_is_weight_loss,
} = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  email: email.required(),
  password: password.required(),
  first_name: first_name.required(),
  role_id,
  last_name,
  target_per_day_calories,
  target_is_weight_loss,
});
