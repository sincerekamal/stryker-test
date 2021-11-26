const Joi = require("joi");
const {
  description,
  num_of_calories,
  date,
  time,
  uuidv4,
} = require("@utils/joiValidation/common.schema");

module.exports = Joi.object({
  id: uuidv4.required(),
  date,
  time,
  description,
  num_of_calories,
});
