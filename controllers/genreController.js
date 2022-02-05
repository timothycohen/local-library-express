const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
exports.genreList = function (req, res, next) {
  Genre.find({})
    .sort('name')
    .exec((err, genreList) => {
      if (err) return next(err);

      res.render('genreList.njk', {
        layout: 'layout.njk',
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
        layout: 'layout.njk',
        ...results,
      });
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

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
