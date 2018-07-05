const express = require('express'),
    morgan = require('morgan'),
    config = require('config'),
    helmet = require('helmet'),
    genres = require('./routes/genres'),
    home = require('./routes/home');

//export DEBUG=app:startup,app:db or *
const startupDebugger = require('debug')('app:startup'),
    dbDebugger = require('debug')('app:db');

const app = express();

const logger = require('./midddleware/logger')
const port = process.env.PORT || 3000;

if (app.get('env') == 'development') {
    startupDebugger('Morgan enabled...');
    app.use(morgan("tiny"));
}

dbDebugger('connected to database...');

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

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})