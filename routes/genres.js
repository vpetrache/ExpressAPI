const express = require('express');
let {Genre, validateUserInput} = require('../models/genres');
dbDebugger = require('debug')('app:db')
const router = express.Router();

//req.params and query params
//http://localhost:3000/api/genres/3/221?test=int&null=false
router.get('/:id/:params', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send(genres[req.params.id - 1])
});

router.get('/', async (req, res) => {
    const result = await Genre.find()
        .sort({ name: 1 });
    return res.send(result);
});

router.get('/:id', async (req, res) => {
    // const genre = genres.find((x) => {
    //     return x.id.toString() === req.params.id;
    // })
    // if (!genre) {
    //     return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    // }
    // return res.status(200).send(genre)

    try {
        const result = await Genre.findById(req.params.id);
        if (!result) {
            return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
        }
        res.status(200).send(result);
    }
    catch (err) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }

});

router.post('/', async (req, res) => {
    // let newGenre = {
    //     id: genres.length + 1,
    //     name: ""
    // };
    // let { error } = validateUserInput(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message)
    // }
    // newGenre.name = req.body.name;
    // genres.push(newGenre);
    // return res.send(newGenre);

    let { error } = validateUserInput(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    return res.send(genre);

});

router.put('/:id', async (req, res) => {
    // //search
    // let genre = genres.find((x) => {
    //     return x.id.toString() === req.params.id;
    // })
    // if (!genre) {
    //     return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    // }
    // //update
    // let { error } = validateUserInput(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message)
    // }
    // genre.name = req.body.name;

    // //responde
    // return res.send(genre);

    //update first
    let { error } = validateUserInput(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let genre;
    try {
        genre = await Genre.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            }
        }, { new: true });
    }
    catch (err) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }
    return res.status(200).send(genre);

});

router.delete('/:id', async (req, res) => {
    //search
    // let genre = genres.find((x) => {
    //     return x.id.toString() === req.params.id;
    // })
    // if (!genre) {
    //     return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    // }
    // let index = genres.findIndex((x) => {
    //     return x.name === genre.name;
    // })
    // //delete
    // genres.splice(index, 1);
    // //responde
    // return res.send(genre);
    try {
        let genre = await Genre.findByIdAndRemove(req.params.id);
        dbDebugger(genre);
        res.send(genre);
    }
    catch (err) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }
});

module.exports = router;