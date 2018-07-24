const express = require('express'),
    morgan = require('morgan'),
    config = require('config'),
    mongoose = require('mongoose'),
    Joi = require('joi'),
    helmet = require('helmet'),
    genres = require('./routes/genres'),
    customers = require('./routes/customers'),
    movies = require('./routes/movies'),
    rentals = require('./routes/rentals'),
    home = require('./routes/home');

Joi.objectId = require('joi-objectid')(Joi);

//export DEBUG=app:startup,app:db or *
const startupDebugger = require('debug')('app:startup'),
    dbDebugger = require('debug')('app:db');

const app = express();

const logger = require('./midddleware/logger');
const port = process.env.PORT || 3000;

if (app.get('env') == 'development') {
    startupDebugger('Morgan enabled...');
    app.use(morgan("tiny"));
}

mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true }).then(
    () => dbDebugger('Connected to MongoDB')
).catch((e) => {
    console.error(e.message);
});

app.set('view engine', 'pug');
app.set('views', './views');

//middleware functions
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/', home);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});