const mongoose = require('mongoose'),
    Joi = require('joi');

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
            validator: function (e) {
                let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(e);
            },
            message: 'Email is not valid!'
        }
    },
    password: {
        type: String,
        minLength: 5,
        maxLength: 255,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

function validateNewUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateNewUser = validateNewUser;