const mongoose = require('mongoose'),
Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10
    }
});

const Customer = mongoose.model('Customer', customerSchema);


function validateUserInput(body) {
    const Schema = {
        name: Joi.string().min(6).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.number().min(10).required()
    }
    return Joi.validate(body, Schema);
};

function validateUserUpdateInput(body) {
    const Schema = {
        name: Joi.string().min(6),
        isGold: Joi.boolean(),
        phone: Joi.number().min(10)
    }
    return Joi.validate(body, Schema);
};

exports.Customer = Customer;
exports.validateUserInput = validateUserInput;
exports.validateUserUpdateInput = validateUserUpdateInput;