const mongoose = require('mongoose'),
    Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 10,
        required: true,
        lowercase: true
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateUserInput(genre) {
    let schema = {
        name: Joi.string().min(3).max(10).required()
    }
    return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.validateUserInput = validateUserInput;