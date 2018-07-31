"use strict";

const express = require("express");
const app = express();
const winston = require("winston");

require("./start_up/logger")();
require("./start_up/app")(app);
require("./start_up/db")();
require("./start_up/config")();
require("./start_up/validation")();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  winston.info(`Listening on http://localhost:${port}`);
});
