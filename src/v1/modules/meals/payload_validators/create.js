/**
 * returns either an object which has the modified, sanitized, validated payload
 * or throws the validation error
 */
const schema = require("./schema/create.schema");
const joiValidation = require("@utils/joiValidation");
const { ValidationError } = require("@errors");
module.exports = (context, payload) => {
  // do validation
  const validatedPayload = joiValidation(schema, payload);

  if (!validatedPayload.num_of_calories && !validatedPayload.description) {
    throw new ValidationError(`Either num_of_calories or description should be provided`)
  }

  return validatedPayload;
};
