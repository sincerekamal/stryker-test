const Joi = require("joi");
const {
  password,
  first_name,
  last_name,
  role_id,
  uuidv5,
  target_per_day_calories,
  target_is_weight_loss,
} = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  id: uuidv5.required(),
  password,
  first_name,
  last_name,
  role_id,
  target_per_day_calories,
  target_is_weight_loss,
});
