const { Router } = require("express");

const router = Router();
const handlers = require("./handler");

module.exports = () => {
  router.get("/", handlers.get);

  router.post("/signup", handlers.signup);

  router.post("/create_token", handlers.createToken);

  return router;
};
