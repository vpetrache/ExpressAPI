const express = require('express'),
    Joi = require('joi'),
    morgan = require('morgan'),
    config = require('config'),
    helmet = require('helmet');

//export DEBUG=app:startup,app:db or *
const startupDebugger = require('debug')('app:startup'),
    dbDebugger = require('debug')('app:db');

const app = express();

const logger = require('./midddleware/logger')
const port = process.env.PORT || 3000;

const genres = [{ id: 1, "name": "action" },
{ id: 2, "name": "x-rated" },
{ id: 3, "name": "horror" }]

if (app.get('env') == 'development') {
    startupDebugger('Morgan enabled...');
    app.use(morgan("tiny"));
}

dbDebugger('connected to database...');


app.set

//middleware functions
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

function validateUserInput(genre) {
    let schema = {
        name: Joi.string().min(3).max(10).required()
    }
    return Joi.validate(genre, schema);
};

app.get('/', (req, res) => {
    return res.status(404).send('Invalid endpoint!')
})

app.get('/api/genres', (req, res) => {
    return res.status(200).send(genres)
})

app.get('/api/genres/:id', (req, res) => {

    const genre = genres.find((x) => {
        return x.id.toString() === req.params.id;
    })
    if (!genre) {
        return res.status(404).send(`The genre with id ${req.params.id} was not found!`)
    }

    return res.status(200).send(genre)
})

app.post('/api/genres', (req, res) => {
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

app.put('/api/genres/:id', (req, res) => {
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

app.delete('/api/genres/:id', (req, res) => {
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


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})