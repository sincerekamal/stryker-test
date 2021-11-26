const httpContext = require("express-http-context");
const { createLogger, transports, format } = require("winston");
const { env, logging: logConfig, apiVersion } = require("@config");

/* eslint-disable no-console */
// eslint is disabled because logger is not available at this instance
console.log("Environment", env, "and with log level", logConfig.level);

let logger = createLogger({
  level: logConfig.level,
  defaultMeta: { apiVersion },
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/dev.log" }),
  ],
});

const formatMessage = (args = []) => {
  let message, returnMsgObj;
  const argsLength = args.length;
  if (argsLength > 1) {
    // if multiple arguments are passed to any of the log methods
    // it will be wrapped inside an object
    // logger.info(1, ['two',3], {four: 'five'});
    // generates message as {"0":1,"1":["two",3],"2":{"four":"five"}}
    message = {
      ...args,
    };
  }
  if (argsLength === 1) {
    message = args[0];
  }

  // Stringify if message is not string
  if (message && typeof message !== "string") {
    returnMsgObj = { message: JSON.stringify(message) };
  }

  return returnMsgObj || message;
};

const formatError = (args = []) => {
  const argsLength = args.length;
  let errorObj;
  if (argsLength === 1 && args[0] instanceof Error) {
    const err = args[0];
    const { name, stack, message, ...rest } = err;
    errorObj = { errorName: name, stackTrace: stack, message, ...rest };
  } else {
    // this should usually not happen, as any argument coming to be logged as an Error,
    // should have a 'typeof' error.
    // if we send something to log as error, which is not exactly an error,
    // then we should rethink about sending that.
    errorObj = { errorName: "CustomError", message: { ...args } };
  }

  if (errorObj.message && typeof errorObj.message !== "string") {
    errorObj.message = JSON.stringify(errorObj.message);
  }

  return errorObj;
};

const getContextIds = () => {
  const contextIds = {};
  if (httpContext.get("clientId")) {
    contextIds.clientId = httpContext.get("clientId");
  }
  if (httpContext.get("requestId")) {
    contextIds.requestId = httpContext.get("requestId");
  }
  return contextIds;
};

const _formLogger = (_logger) => {
  return {
    log(...args) {
      // logger.log always prints only to console, we should use info/debug in general
      console.log(formatMessage(args));
    },
    debug(...args) {
      const contextIds = getContextIds();
      const message = formatMessage(args);
      if (Object.keys(contextIds).length > 0) {
        _logger.child({ ...contextIds }).debug(message);
      } else {
        _logger.debug(message);
      }
    },
    info(...args) {
      const contextIds = getContextIds();
      const message = formatMessage(args);
      if (Object.keys(contextIds).length > 0) {
        _logger.child({ ...contextIds }).info(message);
      } else {
        _logger.info(message);
      }
    },
    warn(...args) {
      const contextIds = getContextIds();
      const message = formatMessage(args);
      if (Object.keys(contextIds).length > 0) {
        _logger.child({ ...contextIds }).warn(message);
      } else {
        _logger.warn(message);
      }
    },
    error(...args) {
      const contextIds = getContextIds();
      // format error to obtain the type and stack information of error
      // if the errorObj does not have type and stack information
      // then it is a custom object that is being written as error
      const { message, ...rest } = formatError(args);
      // in case of error, meta should include errorName and stackTrace
      if (Object.keys(contextIds).length > 0) {
        _logger.child({ ...rest, ...contextIds }).error(message);
      } else {
        _logger.child({ ...rest }).error(message);
      }
    },
    /**
     * Use this method to set any extra keys which needs to be part of json in the loggly event
     * @param {object} attrs the attributes to set as meta ofor the child logger
     * @returns {object} a logger object formed based on input attributes (as meta)
     */
    setMeta(attrs = {}) {
      return _formLogger(_logger.child({ ...attrs }));
    },
  };
};

const loggerWrapper = (scope) => {
  let _logger = logger.child();
  if (scope) {
    _logger = logger.child({ scope });
  }
  return {
    ..._formLogger(_logger),
  };
};

module.exports = loggerWrapper;
