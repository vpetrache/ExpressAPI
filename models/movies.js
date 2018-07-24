const mongoose = require('mongoose'),
    {genreSchema} = require('./genres'),
    Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 5,
        maxLength: 100,
        trim: true,
        unique: true,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 500,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 500,
        default: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(100).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(500).required(),
        dailyRentalRate: Joi.number().min(0).max(500),
    };

    return Joi.validate(movie, schema);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovie = validateMovie;
