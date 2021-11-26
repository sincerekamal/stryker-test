const BaseError = require('./BaseError');
const { DEF_REDIRECTION_ERROR } = require('../appConstants').errorCodes;

class RedirectionError extends BaseError {
  constructor(message, data) {
    super(message, DEF_REDIRECTION_ERROR, data);
  }
}

module.exports = RedirectionError;
