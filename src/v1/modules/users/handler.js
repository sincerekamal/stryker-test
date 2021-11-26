const payloadValidators = require("./payload_validators");
const controllers = require("./controllers");

module.exports = {
  create: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.create(res.locals, req.body);

      res.result = await controllers.create(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.get(res.locals, req.params);

      res.result = await controllers.get(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.update(res.locals, {
        ...req.body,
        id: req.params.id,
      });

      res.result = await controllers.update(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.delete(res.locals, req.params);

      res.result = await controllers.delete(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },
  list: async (req, res, next) => {
    try {
      const validatedPayload = payloadValidators.list(res.locals, req.body);

      res.result = await controllers.list(res.locals, validatedPayload);

      return next();
    } catch (err) {
      return next(err);
    }
  },
};
