const BaseError = require('./BaseError');
const { DEF_VALIDATION_ERROR } = require('../appConstants').errorCodes;

const generateErrorMessage = (errors = []) => {
  // create error message based on incoming list of errors
  const errorMessage =
    (errors.details &&
      errors.details.reduce((acc, errorDetails) => {
        if (errorDetails.message.endsWith('.')) {
          acc += `${errorDetails.message} `;
        } else {
          acc += `${errorDetails.message}. `;
        }
        return acc;
      }, '')) ||
    '';
  return errorMessage.trim();
};

class JoiSchemaError extends BaseError {
  constructor(errors, data) {
    super(generateErrorMessage(errors), DEF_VALIDATION_ERROR, data);
    this.errors = errors;
  }
}

module.exports = JoiSchemaError;
