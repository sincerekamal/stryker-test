const controllers = require("./controllers");
const payloadValidators = require("./payload_validators");

module.exports = {
  get: async (req, res, next) => {
    try {
      res.result = await controllers.get(res.locals, req.params);

      return next();
    } catch (err) {
      return next(err);
    }
  },

  signup: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.signup(res.locals, req.body);

      res.result = await controllers.signup(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },

  createToken: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.createToken(
        res.locals,
        req.body
      );

      res.locals = { ...res.locals, originalBody: req.originalBody };

      res.result = await controllers.createToken(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },
};
