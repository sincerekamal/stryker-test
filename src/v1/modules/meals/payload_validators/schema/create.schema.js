const Joi = require("joi");
const {
  description,
  num_of_calories,
  date,
  time,
  uuidv5,
} = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  user_id: uuidv5.required(),
  date: date.required(),
  time: time.required(),
  description,
  num_of_calories,
});
