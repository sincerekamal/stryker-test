const { Router } = require("express");

const router = Router();
const handlers = require("./handler");

module.exports = () => {
  router.post("/users", handlers.create);

  router.get("/users/:id?", handlers.get);

  router.patch("/users/:id?", handlers.update);

  router.delete("/users/:id?", handlers.delete);

  router.post("/users/list", handlers.list);

  return router;
};
