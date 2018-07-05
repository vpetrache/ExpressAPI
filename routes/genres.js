const express = require('express'),
    Joi = require('joi');
const router = express.Router();

const genres = [{ id: 1, "name": "action" },
{ id: 2, "name": "x-rated" },
{ id: 3, "name": "horror" }]

//req.params and query params
//http://localhost:3000/api/genres/3/221?test=int&null=false
router.get('/:id/:params', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send(genres[req.params.id - 1])
});

router.get('/', (req, res) => {
    return res.status(200).send(genres)
})

router.get('/:id', (req, res) => {

    const genre = genres.find((x) => {
        return x.id.toString() === req.params.id;
    })
    if (!genre) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }

    return res.status(200).send(genre)
})

router.post('/', (req, res) => {
    let newGenre = {
        id: genres.length + 1,
        name: ""
    };
    let { error } = validateUserInput(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    newGenre.name = req.body.name;
    genres.push(newGenre);
    return res.send(newGenre);
})

router.put('/:id', (req, res) => {
    //search
    let genre = genres.find((x) => {
        return x.id.toString() === req.params.id;
    })
    if (!genre) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }
    //update
    let { error } = validateUserInput(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    genre.name = req.body.name;

    //responde
    return res.send(genre);
})

router.delete('/:id', (req, res) => {
    //search
    let genre = genres.find((x) => {
        return x.id.toString() === req.params.id;
    })
    if (!genre) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }
    let index = genres.findIndex((x) => {
        return x.name === genre.name;
    })
    //delete
    genres.splice(index, 1);
    //responde
    return res.send(genre);
})

function validateUserInput(genre) {
    let schema = {
        name: Joi.string().min(3).max(10).required()
    }
    return Joi.validate(genre, schema);
};

module.exports = router;