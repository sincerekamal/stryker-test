/**
 * This is common validation for all APIs.
 * Specific validations can be done in the specific files
 * returns either an object which has the modified, sanitized, validated payload
 * or throws the Joi Schema error
 */
const { JoiSchemaError } = require('@errors');

module.exports = (schema, payload, convert = true) => {
  // do schema validation
  const { value, error } = schema.validate(payload, { abortEarly: false, convert });

  if (error) {
    throw new JoiSchemaError(error);
  }

  return value;
};
