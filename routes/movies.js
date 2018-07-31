const express = require("express");
const router = express.Router();
const auth = require("../midddleware/authorization");
const { Movie, validateMovie } = require("../models/movies");
const { Genre } = require("../models/genres");

router.get("/", async function(req, res) {
    const movieList = await Movie.find()
      .sort("title")
      .select("title genre numberInStock dailyRentalRate");

    return res.send(movieList);
});

router.post("/", auth, async function(req, res) {
    let { error } = validateMovie(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res
        .status(404)
        .send(`Genre with id ${req.body.genreId} not found`);
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
});

module.exports = router;
