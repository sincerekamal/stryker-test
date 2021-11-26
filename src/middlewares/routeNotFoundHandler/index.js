const { NotFoundError } = require('@errors');

const routeNotFoundHandler = (req, res, next) => {
  // req.route is only populated when a route is actually matched,
  // in case route is not matched, i.e. 404, then throw error.
  if (req.route) {
    next();
  } else {
    next(
      new NotFoundError('This endpoint is not served OR method type is incorrect for the endpoint.')
    );
  }
};

module.exports = routeNotFoundHandler;
