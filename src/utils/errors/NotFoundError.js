const BaseError = require('./BaseError');
const { DEF_NOTFOUND_ERROR } = require('../appConstants').errorCodes;

const DEFAULT_MSG = 'Resource not found';
class NotFoundError extends BaseError {
  constructor(message = DEFAULT_MSG) {
    super(message, DEF_NOTFOUND_ERROR);
    return this;
  }
}

module.exports = NotFoundError;
