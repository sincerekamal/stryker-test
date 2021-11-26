const { time, fdate } = require("./joiExtensions");
const Joi = require("joi").extend(time, fdate);

module.exports = {
  email: Joi.string().email().lowercase().min(3).max(100),
  password: Joi.string().min(6).max(20),
  first_name: Joi.string().min(1).max(30),
  last_name: Joi.string().min(1).max(30),
  target_per_day_calories: Joi.number().min(1).max(100000),
  target_is_weight_loss: Joi.bool(),
  role_id: Joi.number().min(1).max(3),

  description: Joi.string().min(1).max(300),
  num_of_calories: Joi.number().min(1).max(100000),
  date: Joi.fdate().format("yyyy-MM-dd"),
  time: Joi.time(),

  uuidv4: Joi.string().uuid({ version: "uuidv4" }),
  uuidv5: Joi.string().uuid({ version: "uuidv5" }),
  query: Joi.string().min(6).max(500).default("1"),
  limit: Joi.number().min(1).max(500),
  offset: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).default(0),
};
