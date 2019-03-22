const express = require("express");

const projectsRouter = require("./routers/projects-router.js");
const actionsRouter = require("./routers/actions-router.js");

const helmet = require("helmet");
const cors = require("cors");

const server = express();

// BUILT-IN MIDDLEWARE (WITH HELMET SECURITY)
server.use(express.json());
server.use(helmet());

// CUSTOM MIDDLEWARE (LOGGER)
server.use(function(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
});

// THIRD PARTY MIDDLEWARE
server.use(cors());

server.get("/", (req, res) => {
  res.send("Hello from Guillermo's Sprint Challenge #11 server!");
});

// ROUTE HANDLERS ARE ALSO MIDDLEWARE
server.use("/api/projects", projectsRouter);
server.use("/api/actions", actionsRouter);

// CUSTOM MIDDLEWARE!
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist. Try /api/projects or /api/actions.");
});

module.exports = server;
