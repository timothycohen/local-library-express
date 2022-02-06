const { body, validationResult } = require('express-validator');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

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
exports.book = function (req, res, next) {
  Promise.all([
    Book.findById(req.params.id).populate('author').populate('genre'),
    BookInstance.find({ book: req.params.id }),
  ])
    .then(([book, bookInstances]) => ({ book, bookInstances }))
    .then((results) => {
      if (results.book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
      res.render('book.njk', {
        ...results,
      });
    });
};

// Display book create form on GET.
exports.getCreateBook = async function (req, res, next) {
  const [allGenres, allAuthors] = await Promise.all([
    Genre.find().sort([['name', 'ascending']]),
    Author.find().sort([['name', 'ascending']]),
  ]);
  res.render('createBookForm.njk', { allGenres, allAuthors });
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
  body('genre.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [allGenres, allAuthors] = await Promise.all([
        Genre.find().sort([['name', 'ascending']]),
        Author.find().sort([['name', 'ascending']]),
      ]);
      return res.render('createBookForm.njk', {
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
      genre: req.body.genres,
    });

    book.save((err) => {
      if (err) return next(err);
      res.redirect(book.url);
    });
  },
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
