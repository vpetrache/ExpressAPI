"use strict";

require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  process.on("unhandledRejection", ex => {
    throw ex;
  });

  winston.handleExceptions(
    new winston.transports.Console({
      prettyPrint: true,
      colorize: true,
      handleExceptions: true
    })
  );

  winston.add(winston.transports.File, {
    filename: "logfile.log",
    level: "info",
    handleExceptions: true
  });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost:27017/vidly",
    handleExceptions: true,
    level: "error"
  });
};
