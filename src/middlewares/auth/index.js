const jwt = require("jsonwebtoken");
const {
  jwt: { secret, algorithm, expiresIn },
} = require("@config");
const { getDataScope } = require("@utils/helpers");

/**
 * Validates the token or header
 * @param {object} req IncomingRequest Object
 * @param {*} res  OutgoingResponse object
 * @param {*} next next handler to be handed over
 */
const validate = (req, res, next) => {
  const token = (req.headers.authorization || "").split("Bearer ")[1];
  jwt.verify(token, secret, { algorithm }, (err, decoded) => {
    if (err) return next(err);
    res.locals.user = decoded.data;
    res.locals.isAdmin = decoded.data.role_id === 3;
    res.locals.dataScope = getDataScope(decoded.data);
    return next();
  });
};

const generateToken = (payload) => {
  return new Promise((res, rej) => {
    jwt.sign(payload, secret, { algorithm, expiresIn }, (err, token) => {
      if (err) return rej(err);
      return res({
        token,
        expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
      });
    });
  });
};

module.exports = {
  validate,
  generateToken,
};
