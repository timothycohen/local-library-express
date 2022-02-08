const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const mongoose = require('mongoose');
require('dotenv').config();

// initialize express
const app = express();

// set up db connection
const mongoDB = process.env.DATABASE_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure nunjucks templates
// warn: escape all user input
nunjucks.configure('views', {
  autoescape: false,
  express: app,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/catalog', require('./routes/catalog'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = createError(404);
  err.message = `Shoot! Couldn't find that page.`;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Something went wrong';

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error.njk', { ...err });
});

module.exports = app;
