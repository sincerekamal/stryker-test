const { Router } = require("express");

const router = Router();
const handlers = require("./handler");

module.exports = () => {
  router.post("/meals", handlers.create);

  router.get("/meals/:id?", handlers.get);

  router.patch("/meals/:id?", handlers.update);

  router.delete("/meals/:id?", handlers.delete);

  router.post("/meals/list", handlers.list);

  return router;
};
