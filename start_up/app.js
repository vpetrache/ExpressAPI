"use strict";

const express = require("express");
const helmet = require("helmet");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");
const error = require("../midddleware/error");

module.exports = function(app) {
  app.set("view engine", "pug");
  app.set("views", "./views");

  //middleware functions
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(helmet());
  app.use("/api/genres", genres);
  app.use("/", home);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
