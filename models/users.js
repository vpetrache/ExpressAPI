const mongoose = require("mongoose");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true,
    unique: true,
    validate: {
      validator: function(e) {
        let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(e);
      },
      message: "Email is not valid!"
    }
  },
  password: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey"),
    {
      expiresIn: 360
    }
  );

  return token;
};

const User = mongoose.model("User", userSchema);

function validateNewUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

function validateLogin(body) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(body, schema);
}

function validatePassword(password) {
  const complexityOptions = {
    min: 5,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2
  };

  return Joi.validate(password, new PasswordComplexity(complexityOptions));
}

exports.User = User;
exports.validateNewUser = validateNewUser;
exports.validatePassword = validatePassword;
exports.validateLogin = validateLogin;
