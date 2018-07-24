const express = require('express'),
    router = express.Router(),
    Fawn = require('fawn'),
    mongoose = require('mongoose'),
    {Rental, validateRental} = require('../models/rentals'),
    {Movie} = require('../models/movies'),
    {Customer} = require('../models/customers');

Fawn.init(mongoose);

router.get('/', async function (req, res) {
    try {
        const rentalList = await Rental.find().sort('-dateRented');
        return res.send(rentalList);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/', async function (req, res) {
    try {
        const {error} = validateRental(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message)
        }

        let customer = await Customer.findById(req.body.customerId);
        if (!customer) {
            return res.status(404).send(`Customer with id ${req.body.customerId} does not exist`)
        }

        let movie = await Movie.findById(req.body.movieId);
        if (!movie) {
            return res.status(404).send(`Movie with id ${req.body.movieId} does not exist`)
        }
        if (movie.numberInStock === 0) {
            return res.status(404).send(`${movie.title} is not available for rental`)
        }

        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
        });

        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id},
                {
                    $inc: {numberInStock: -1}
                })
            .run();

        res.send(rental);
    }

    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;