const { body, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');
const { pass404 } = require('../utils/errors');

// Display list of all Authors.
exports.authorList = function (req, res, next) {
  Author.find()
    .sort([['familyName', 'ascending']])
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
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('author', 'Invalid Object Id', next);

  Promise.all([Author.findById(id), Book.find({ author: id }, 'title summary').sort({ title: 1 })])
    .then(([author, books]) => {
      if (!author) return pass404('author', `Couldn't find id ${id}.`, next);
      return { author, books };
    })
    .then((data) => {
      res.render('author.njk', {
        title: `Author: ${data.author.name}`,
        ...data,
      });
    })
    .catch(next);
};

// Display Author create form on GET.
exports.getCreateAuthor = function (req, res) {
  res.render('createAuthorForm.njk', { title: 'Create Author' });
};

// Handle Author create form on POST.
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
      return res.render('createAuthorForm.njk', {
        title: 'Create Author',
        author: {
          ...req.body,
          dateOfBirth: new Date(req.body.dateOfBirth).toLocaleDateString('en-CA'),
          dateOfDeath: new Date(req.body.dateOfDeath).toLocaleDateString('en-CA'),
        },
        errors: errors.array(),
      });
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
exports.getDeleteAuthor = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('author', `Invalid Object Id`, next);

  Promise.all([Author.findById(id), Book.find({ author: id }, 'title summary').sort({ title: 1 })])
    .then(([author, books]) => ({
      author,
      books,
    }))
    .then((data) => {
      res.render('deleteAuthor.njk', { ...data, title: 'Delete Author' });
    })
    .catch(next);
};

// Handle Author delete on POST.
exports.postDeleteAuthor = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('author', `Invalid Object Id`, next);

  const books = await Book.findOne({ author: id }).catch(next);
  if (books) {
    const err = new Error();
    err.status = 403;
    err.message = `Delete the author's books before the author.`;
    next(err);
  }
  await Author.findByIdAndDelete(id).catch(next);

  res.redirect('/catalog/authors');
};

// Display Author update form on GET.
exports.getUpdateAuthor = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('author', 'Invalid Object Id', next);

  const author = await Author.findById(id);
  if (!author) return pass404('author', `Couldn't find id ${id}.`, next);

  return res.render('createAuthorForm.njk', {
    title: 'Update Author',
    author: {
      ...author._doc,
      dateOfBirth: new Date(author.dateOfBirth).toLocaleDateString('en-CA'),
      dateOfDeath: new Date(author.dateOfDeath).toLocaleDateString('en-CA'),
    },
  });
};

// Handle Author update on POST.
exports.postUpdateAuthor = [
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

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('createAuthorForm.njk', {
        title: 'Update Author',
        author: {
          ...req.body,
          dateOfBirth: new Date(req.body.dateOfBirth).toLocaleDateString('en-CA'),
          dateOfDeath: new Date(req.body.dateOfDeath).toLocaleDateString('en-CA'),
        },
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) return pass404('author', `Invalid Object Id`, next);

    const ogAuthor = await Author.findById(id);

    try {
      await ogAuthor.updateOne({
        firstName: req.body.firstName,
        familyName: req.body.familyName,
        dateOfBirth: req.body.dateOfBirth,
        dateOfDeath: req.body.dateOfDeath,
      });
    } catch (err) {
      next(err);
    }

    res.redirect(ogAuthor.url);
  },
];
