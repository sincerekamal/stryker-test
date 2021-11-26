const BaseError = require('./BaseError');
const { DEF_SERVER_ERROR } = require('../appConstants').errorCodes;

const DEFAULT_MSG = 'Something went wrong';
class ServerError extends BaseError {
  constructor(err) {
    super((err && err.message) || DEFAULT_MSG, DEF_SERVER_ERROR, err);
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }
}

module.exports = ServerError;
