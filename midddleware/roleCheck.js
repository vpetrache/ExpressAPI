"use strict";

module.exports = function(req, res, next) {
  if (req.user.isAdmin === true) {
    next();
  } else {
    return res.status(403).send("Access denied!");
  }
};
