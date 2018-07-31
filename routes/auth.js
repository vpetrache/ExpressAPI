const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require('config');
const { User, validateLogin } = require("../models/users");

router.post("/", async (req, res) => {
  let { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0]);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send("Invalid email or password!");
  }

  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!validatePassword) {
    return res.status(401).send("Invalid email or password!");
  }

  const token = await user.generateAuthToken();

  res.send(token);
});

router.post('/token', async (req, res)=>{

    const token = await jwt.decode(req.body.token,
    config.get('jwtPrivateKey')
    );

    res.send(token);
})

module.exports = router;
