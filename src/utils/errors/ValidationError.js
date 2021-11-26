const BaseError = require('./BaseError');
const { DEF_VALIDATION_ERROR } = require('../appConstants').errorCodes;

class ValidationError extends BaseError {
  constructor(message, data) {
    super(message, DEF_VALIDATION_ERROR, data);
  }
}

module.exports = ValidationError;
