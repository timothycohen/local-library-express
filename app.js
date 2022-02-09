const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const mongoose = require('mongoose');
require('dotenv').config();
const debug = require('debug')('local-library:app');
const compression = require('compression');
const helmet = require('helmet');
const { logHTTP, logError } = require('./utils/logger');

// initialize express
const app = express();

// secure by setting various HTTP headers
app.use(helmet());

// set up db connection
const mongoDB = process.env.DATABASE_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => logError({ message: `MongoDB connection error: ${err.message}` }));

// configure nunjucks templates
// warn: escape all user input
nunjucks.configure('views', {
  autoescape: false,
  express: app,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Write http requests to console and combined.log: http timestamp method url status response-time res[content-length]
app.use(logHTTP);

// recognize incoming req.body object as json or strings/arrays (needed for post/put requests)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parse the Cookie header on the request and expose as req.cookies (and if secret provided req.signedCookies)
app.use(cookieParser());

// compress all routes
app.use(compression());

// serve all files in the given path
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/catalog', require('./routes/catalog'));

// if no route found, create 404 error and forward to error handler
app.use((req, res, next) => next(createError(404)));

// redirect stderr to log files and tidy console message
app.use(logError);

// error handler
app.use((err, req, res, next) => {
  // if a specific error wasn't caught, give a 500 error
  err.status = err.status || 500;
  // if development, send the full error to the console and template
  if (req.app.get('env') === 'development') {
    debug(err);
    return res.render('error.njk', {
      title: err?.status,
      message: err?.message,
      status: err?.status,
      cause: err?.cause,
      production: false,
    });
  }

  // if production, make a human readable error for the template
  if (err.status === 404) err.message = err.message || `Shoot! Couldn't find that page.`;
  else if (err.status === 500) err.message = 'Shoot! Something went wrong.';
  return res.render('error.njk', { message: err?.message, status: err?.status, production: true });
});

module.exports = app;
