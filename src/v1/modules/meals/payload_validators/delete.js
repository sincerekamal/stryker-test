/**
 * returns either an object which has the modified, sanitized, validated payload
 * or throws the validation error
 */
const schema = require("./schema/delete.schema");
const joiValidation = require("@utils/joiValidation");
module.exports = (context, payload) => {
  // do validation
  return joiValidation(schema, payload);
};
