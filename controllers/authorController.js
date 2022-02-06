const { body, validationResult } = require('express-validator');
const Author = require('../models/author');
const Book = require('../models/book');

// Display list of all Authors.
exports.authorList = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, authorList) => {
      if (err) return next(err);
      res.render('authorList.njk', {
        title: 'Author List',
        authorList,
      });
    });
};

// Display detail page for a specific Author.
exports.authorDetail = async function (req, res, next) {
  Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }, 'title summary').sort({ title: 1 }),
  ])
    .then(([author, books]) => ({
      author,
      books,
    }))
    .then((data) => {
      res.render('author.njk', {
        data,
      });
    })
    .catch((err) => next(err));
};

// Display Author create form on GET.
exports.getCreateAuthor = function (req, res) {
  res.render('createAuthorForm.njk');
};

// Handle Author create on POST.
exports.postCreateAuthor = [
  // Validate
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('familyName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('dateOfBirth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('dateOfDeath', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      console.log(typeof errors);
      return res.render('createAuthorForm.njk', { author: req.body, errors: errors.array() });
    }

    // Form data is valid.
    // Create an Author object with escaped and trimmed data.
    const author = new Author({
      firstName: req.body.firstName,
      familyName: req.body.familyName,
      dateOfBirth: req.body.dateOfBirth,
      dateOfDeath: req.body.dateOfDeath,
    });
    author.save((err) => {
      if (err) return next(err);
      res.redirect(author.url);
    });
  },
];

// Display Author delete form on GET.
exports.author_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};
