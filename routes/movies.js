const express = require('express'),
    router = express.Router(),
    {Movie, validateMovie} = require('../models/movies'),
    {Genre} = require('../models/genres');

router.get('/', async function (req, res) {
    try {
        const movieList = await Movie.find()
            .sort('title').select("title genre numberInStock dailyRentalRate");

        return res.send(movieList);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/', async function (req, res) {
    try {
        let {error} = validateMovie(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) {
            return res.status(404).send(`Genre with id ${req.body.genreId} not found`)
        }

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();

        return res.send(movie);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;