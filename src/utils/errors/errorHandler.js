const jsonlint = require('jsonlint');
const logger = require("@logger")("errorHandler");
const {
  responseCodes: {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    UNAUTHORISED,
    FORBIDDEN,
    NOT_FOUND,
    REDIRECTION_ERROR,
  },
  errorCodes: { DEF_UNHANDLED_ERROR, DEF_TOKEN_NO_ACCESS },
} = require("@utils/appConstants");
const { TokenError, JsonSchemaError } = require("@errors");

const getResponse = (statusCode, message, requestId, data = {}) => {
  return {
    data,
    result: {
      message,
      ...(requestId && { requestId }), // Add requestId only if it exists with non-empty string
      statusCode, // New property which further clasifies the error
      success: false,
      code: "",
    },
  };
};

const processError = (err, requestId = "") => {
  let errorResponse = {};
  let responseCode;

  // log error
  logger.error(err);

  if (err instanceof Error) {
    const { name, data, statusCode = DEF_UNHANDLED_ERROR, message } = err;
    errorResponse = getResponse(statusCode, message, requestId, data);

    switch (name) {
      case "PayloadTooLargeError":
        responseCode = statusCode;
        errorResponse.data = null;
        break;
      case "JsonWebTokenError":
      case "TokenError":
        responseCode = UNAUTHORISED;
        if (statusCode === DEF_TOKEN_NO_ACCESS) {
          responseCode = FORBIDDEN;
        }
        errorResponse.data = null;
        break;
      case "JsonSchemaError":
      case "JoiSchemaError":
      case "ValidationError":
      case "NoRecordFoundError":
        errorResponse.data = null;
        responseCode = BAD_REQUEST;
        break;
      case "NotFoundError":
        errorResponse.data = null;
        responseCode = NOT_FOUND;
        break;
      case "RedirectionError":
        errorResponse.data = null;
        responseCode = REDIRECTION_ERROR;
        break;
      case "ServerError":
      case "DatabaseError":
      case "ReferenceError":
      case "TypeError":
      default:
        errorResponse.data = null;
        responseCode = INTERNAL_SERVER_ERROR;
    }
  } else {
    errorResponse.data = null;
    responseCode = INTERNAL_SERVER_ERROR;
    errorResponse.result = {
      success: false,
      statusCode: DEF_UNHANDLED_ERROR,
      message: "Unknown Error",
      requestId: requestId,
    };
  }

  // Temporarily removing the statusCode from error
  delete errorResponse.result.statusCode;

  errorResponse.result.code = responseCode;

  return [responseCode, errorResponse];
};

module.exports = (err, req, res, next) => {
  if (err.name === "TypeError") {
    // auth0-api-jwt-rsa-validation throws this following error, if the token is invalid
    if (err.message === `Cannot read property 'iss' of undefined`) {
      err = new TokenError().invalid();
    }
  } else if (err.name === "UnauthorizedError") {
    if (err.code === "credentials_required") {
      err = new TokenError().notFound();
    } else {
      if (err.inner && err.inner.name === "TokenExpiredError") {
        err = new TokenError().expired();
      } else {
        err = new TokenError().invalid();
      }
    }
  } else if (err.message && err.message.includes("Failed to obtain")) {
    const message = err.message;
    err = new TokenError().invalid();
    err.message = message;
  } else if (err.type === "entity.parse.failed") {
    try {
      jsonlint.parse(err.body);
    } catch (e) {
      err = new JsonSchemaError().badJson(e.message);
    }
  }

  const [statusCode, response] = processError(
    err,
    res.locals.requestId || req.headers.requestId
  );

  res.error = true;
  res.code = statusCode;
  res.response = response;

  return next();
};
