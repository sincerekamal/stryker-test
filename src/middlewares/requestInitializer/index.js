/** Extracts the information from request object, manipulates and sets it into the response
 * object which can be used in any of the upcoming middlewares or request handlers
 */

const url = require("url");
const { v4 } = require("uuid");
const httpContext = require("express-http-context");

const reqBodyLogger = require("@logger")("requestBody");

/**
 *
 * @param {object} req Request object, from which we will extract information
 * @param {object} res Response object in which we will initialize the values
 * @param {Function} next Pass the control to next middleware or route
 */
const initRequest = async (req, res, next) => {
  const reqHeaders = req.headers;
  const requestId = (reqHeaders && reqHeaders.request_id) || v4();

  httpContext.set("requestId", requestId.toString());

  let endpoint = reqHeaders && reqHeaders.api_uri;

  const host = req.get("host");
  if (!endpoint) {
    endpoint = url.format({
      protocol: req.protocol,
      host,
      pathname: req.originalUrl,
    });
  }

  // selectively pick the headers to log
  // the reason for the OR condition is because it may be possible that no headers are sent
  // (however, authorization is sent in header, so headers cannot be empty/undefined)
  const { authorization, ...httpHeaders } = reqHeaders || {};

  res.locals = {
    requestId,
    requestStartTime: new Date(),
    transaction: {
      requestId,
      endpoint,
      request_type: req.method,
    },
    originalBody: { ...req.body, ...req.params },
    user: null,
    dataScope: null,
    httpHeaders,
  };

  // set meta details for request and write the incoming request details.
  // even in cases where body is not available, meta details will be written.
  reqBodyLogger
    .setMeta({
      host,
      endpoint: req.originalUrl,
      method: req.method,
    })
    .debug(req.body || { message: "No request body" });

  next();
};

module.exports = initRequest;
