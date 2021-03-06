const createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const { pass404 } = require('../utils/errors');

// Display list of all books.
exports.bookList = (req, res, next) => {
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec((err, bookList) => {
      if (err) return next(err);

      res.render('bookList.njk', {
        bookList,
        title: 'Book List',
      });
    });
};

// Display detail page for a specific book.
exports.book = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book', 'Invalid Object Id', next);

  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate('author').populate('genres'),
    BookInstance.find({ book: req.params.id }),
  ]).catch(next);

  if (!book) return pass404('book', `Couldn't find id ${id}.`, next);

  res.render('book.njk', {
    title: `Book: ${book.title}`,
    book,
    bookInstances,
  });
};

// Display book create form on GET.
exports.getCreateBook = async function (req, res, next) {
  const [allGenres, allAuthors] = await Promise.all([
    Genre.find().sort([['name', 'ascending']]),
    Author.find().sort([['name', 'ascending']]),
  ]).catch(next);
  res.render('createBookForm.njk', {
    title: 'Create Book',
    allGenres,
    allAuthors,
  });
};

// Handle book create on POST.
exports.postCreateBook = [
  // req.body.genres could be undefined, string, or array of id strings. cast into an array
  (req, res, next) => {
    if (!req.body.genres) req.body.genres = [];
    if (typeof req.body.genres === 'string') req.body.genres = [req.body.genres];
    next();
  },
  // Validate
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title is required.'),
  body('author').trim().isLength({ min: 1 }).escape().withMessage('Author is required.'),
  body('summary').trim().isLength({ min: 1 }).escape().withMessage('Summary is required.'),
  body('isbn')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('ISBN is required.')
    .isAlphanumeric()
    .withMessage('ISBN cannot have non-alphanumeric characters.'),
  body('genres.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [allGenres, allAuthors] = await Promise.all([
        Genre.find().sort([['name', 'ascending']]),
        Author.find().sort([['name', 'ascending']]),
      ]);
      return res.render('createBookForm.njk', {
        title: 'Create Book',
        allGenres,
        allAuthors,
        book: req.body,
        errors: errors.array(),
      });
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genres: req.body.genres,
    });

    book.save((err) => {
      if (err) return next(err);
      res.redirect(book.url);
    });
  },
];

// Display book delete form on GET.
exports.getDeleteBook = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book', `Invalid Object Id`, next);

  const [book, bookInstances] = await Promise.all([
    Book.findById(id).populate('author').populate('genres'),
    BookInstance.find({ book: id }),
  ]).catch((err) => next(err));

  if (!book) return pass404('book', `Couldn't find id ${id}.`, next);

  res.render('deleteBook.njk', {
    title: `Book: ${book.title}`,
    book,
    bookInstances,
  });
};

// Handle book delete on POST.
exports.postDeleteBook = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book', `Invalid Object Id`, next);

  const bookInstances = await BookInstance.findOne({ book: id }).catch((err) => next(err));
  if (bookInstances) {
    const err = createError(403);
    err.message = `Delete the book's instances before the book.`;
    next(err);
  }
  await Book.findByIdAndDelete(id).catch((err) => next(err));

  res.redirect('/catalog/books');
};

// Display book update form on GET.
exports.getUpdateBook = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book', 'Invalid Object Id', next);

  const [book, allGenres, allAuthors] = await Promise.all([
    Book.findById(req.params.id),
    Genre.find().sort([['name', 'ascending']]),
    Author.find().sort([['name', 'ascending']]),
  ]).catch((err) => next(err));

  if (!book) return pass404('book', `Couldn't find id ${id}.`, next);

  return res.render('createBookForm.njk', {
    title: 'Update Book',
    allGenres,
    allAuthors,
    book,
  });
};

// Handle book update on POST.
exports.postUpdateBook = [
  // req.body.genres could be undefined, string, or array of id strings. cast into an array
  (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return pass404('book', `Invalid Object Id`, next);

    if (!req.body.genres) req.body.genres = [];
    if (typeof req.body.genres === 'string') req.body.genres = [req.body.genres];
    next();
  },
  // Validate
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title is required.'),
  body('author').trim().isLength({ min: 1 }).escape().withMessage('Author is required.'),
  body('summary').trim().isLength({ min: 1 }).escape().withMessage('Summary is required.'),
  body('isbn')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('ISBN is required.')
    .isAlphanumeric()
    .withMessage('ISBN cannot have non-alphanumeric characters.'),
  body('genres.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [allGenres, allAuthors] = await Promise.all([
        Genre.find().sort([['name', 'ascending']]),
        Author.find().sort([['name', 'ascending']]),
      ]).catch(next);
      return res.render('createBookForm.njk', {
        title: 'Create Book',
        allGenres,
        allAuthors,
        book: req.body,
        errors: errors.array(),
      });
    }

    const ogBook = await Book.findById(req.params.id).exec((err) => {
      if (err) return next(err);
    });

    try {
      await ogBook.updateOne({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genres: req.body.genres,
      });
    } catch (err) {
      next(err);
    }

    res.redirect(ogBook.url);
  },
];
