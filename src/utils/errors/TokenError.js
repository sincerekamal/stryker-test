const BaseError = require("./BaseError");
const {
  DEF_TOKEN_INVALID_ERROR,
  DEF_TOKEN_EXPIRED_ERROR,
  DEF_TOKEN_NO_ACCESS,
} = require("../appConstants").errorCodes;

const DEFAULT_MSG = "Invalid token";
class TokenError extends BaseError {
  constructor() {
    super(DEFAULT_MSG, DEF_TOKEN_INVALID_ERROR);
    this.statusCode = DEF_TOKEN_INVALID_ERROR;
    return this;
  }

  invalid() {
    this.message = DEFAULT_MSG;
    this.statusCode = DEF_TOKEN_INVALID_ERROR;
    return this;
  }

  notFound() {
    this.message = "No authorization token was found";
    this.statusCode = DEF_TOKEN_INVALID_ERROR;
    return this;
  }

  expired() {
    this.message = "Token expired";
    this.statusCode = DEF_TOKEN_EXPIRED_ERROR;
    return this;
  }

  noAccess() {
    this.message = `You don't have permission to do this action`;
    this.statusCode = DEF_TOKEN_NO_ACCESS;
    return this;
  }
}

module.exports = TokenError;
