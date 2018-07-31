const express = require("express");
const router = express.Router();
const _ = require("lodash");
const config = require("config");
const bcrypt = require("bcrypt");
const auth = require("../midddleware/authorization");
const { User, validateNewUser, validatePassword } = require("../models/users");

router.get("/me", auth, async function(req, res) {
  const user = await User.findById(req.user._id).select("-password");
  return res.send(user);
});

router.post("/", async function(req, res) {
  let bodyValidation = validateNewUser(req.body);
  if (bodyValidation.error) {
    return res.status(400).send(bodyValidation.error.details[0]);
  }

  let passwordValidation = validatePassword(req.body.password);
  if (passwordValidation.error) {
    return res.status(400).send(passwordValidation.error.details[0]);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User exists");
  }

  user = new User(_.pick(req.body, ["email", "name", "password"]));

  const salt = await bcrypt.genSalt(parseInt(config.get("salt")));
  user.password = await bcrypt.hash(req.body.password, salt);

  const token = await user.generateAuthToken();

  await user.save();

  return res
    .header("x-auth-token", token)
    .send(_.pick(user, ["name", "email", "password"]));
});

module.exports = router;
