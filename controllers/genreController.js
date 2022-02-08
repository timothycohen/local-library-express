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
  Promise.all([Genre.findById(req.params.id), Book.find({ genres: req.params.id })])
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
  res.render('createGenreForm.njk', { title: 'Create Genre' });
};

// Handle Genre create form on POST.
exports.postCreateGenre = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty())
      return res.render('createGenreForm.njk', {
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });

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

// Handle Genre delete on POST. Schema middleware removes it from all books
// findByIdAndDelete returns the query, not the doc, so it's a hassle to use in the schema.pre('remove') hook
// easier to do this finding and deleting the document separately
exports.postDeleteGenre = async function (req, res, next) {
  const genreDoc = await Genre.findById(req.params.id).catch((err) => next(err));
  await genreDoc.delete().catch((err) => next(err));
  res.redirect('/catalog/genres');
};

// Display Genre update form on GET.
exports.getUpdateGenre = async function (req, res) {
  const genre = await Genre.findById(req.params.id);

  return res.render('createGenreForm.njk', {
    title: 'Update Genre',
    genre,
  });
};

// Handle Genre update on POST.
exports.postUpdateGenre = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const ogGenre = await Genre.findById(req.params.id);
    const updatedFields = { name: req.body.name };
    const updatedGenre = { ...ogGenre._doc, ...updatedFields };

    if (!errors.isEmpty())
      return res.render('createGenreForm.njk', {
        title: 'Update Genre',
        updatedGenre,
        errors: errors.array(),
      });

    Genre.findByIdAndUpdate(req.params.id, updatedFields, (err) => {
      if (err) return next(err);
      return res.redirect(ogGenre.url);
    });
  },
];
