const logger = require("@logger")("responseHandler");

const { apiVersion } = require("@config");
const { OK } = require("@utils/appConstants").responseCodes;

const getResponse = ({
  message,
  requestId,
  data = {},
  success = true,
  code = OK,
  extraResult = {},
} = {}) => ({
  data,
  result: {
    success,
    code,
    message,
    ...(requestId && { requestId }), // Add requestId only if it exists with non-empty string
    ...extraResult,
  },
});

const sendResponse = (res, response) => {
  res.status(response.result.code);
  res.set("X-Served-By", `api-version:${apiVersion}`);
  res.send(response);
};

/**
 * This middleware is responsible of sending any response from the server
 * @param {object} req Express' Request object which holds the request information
 * @param {object} res Express' Response object which holds the response information
 * and related methods
 * If `res.error` is set, `res.response` will be used as response,
 * otherwise response will be formed from `res.result`
 * res.result {object} This object will have the following properties
 * res.result.requestId - optional
 * res.result.message - Required
 * res.result.data - optional, defaults to {}
 * res.result.success - optional, defaults to true
 * res.result.code - optional, defaults to 200
 * res.result.extraResult - optional, defaults to {}
 * @param {Function} next Passes the control to next handler when called without params.
 * If called with params, passes the control to next error handler
 */
module.exports = async (req, res, next) => {
  let response;
  try {
    if (res.error) {
      response = res.response;
      if (res.code === 307) {
        res.set("Location", `${res.locals.redirectURI}`);
      }
    } else {
      response = getResponse({
        ...res.result,
        requestId: res.locals && res.locals.requestId,
      });
    }
  } catch (err) {
    logger.error(err);
  }
  sendResponse(res, response);
  next();
};
