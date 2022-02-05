const { body, validationResult } = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
exports.genreList = function (req, res, next) {
  Genre.find({})
    .sort('name')
    .exec((err, genreList) => {
      if (err) return next(err);

      res.render('genreList.njk', {
        genreList,
        title: 'Genre List',
      });
    });
};

// Display detail page for a specific Genre.
exports.genre = function (req, res, next) {
  Promise.all([Genre.findById(req.params.id), Book.find({ genre: req.params.id })])
    .then(([genre, genreBooks]) => ({ genre, genreBooks }))
    .then((results) => {
      if (results.genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      res.render('genre.njk', {
        title: `Genre: ${results.genre.name}`,
        ...results,
      });
    });
};

// Display Genre create form on GET.
exports.getCreateGenre = function (req, res, next) {
  res.render('genreForm.njk');
};

// Handle Genre create form on POST.
exports.postCreateGenre = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) return res.render('genreForm.njk', { genre, errors: errors.array() });

    // Data from form is valid.
    // Check if Genre with same name already exists.
    Genre.findOne({ name: req.body.name }).exec((err, foundGenre) => {
      if (err) return next(err);

      if (foundGenre) return res.redirect(foundGenre.url);

      genre.save((err) => {
        if (err) return next(err);

        res.redirect(genre.url);
      });
    });
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
