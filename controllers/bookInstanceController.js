const { body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');

// Display list of all BookInstances.
exports.bookInstanceList = function (req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec((err, bookInstanceList) => {
      if (err) return next(err);

      res.render('bookInstanceList.njk', {
        title: 'Book Instance List',
        bookInstanceList,
      });
    });
};

// Display detail page for a specific BookInstance.
exports.bookInstanceDetail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookInstance) => {
      if (err) return next(err);
      res.render('bookInstance.njk', {
        title: `Book Instance: ${bookInstance.book.title}`,
        bookInstance,
      });
    });
};

// Display BookInstance create form on GET.
exports.getCreateBookInstance = async function (req, res) {
  const allBooks = await Book.find({}, 'id, title');
  const statuses = BookInstance.schema.path('status').enumValues;
  res.render('createBookInstanceForm.njk', {
    title: 'Create Book Instance',
    allBooks,
    statuses,
    today: new Date().toLocaleDateString('en-CA'),
  });
};

// Handle BookInstance create form on POST.
exports.postCreateBookInstance = [
  // Validate
  body('book').trim().isLength({ min: 1 }).escape().withMessage('Book is required.'),
  body('imprint').trim().isLength({ min: 1 }).escape().withMessage('Imprint is required.'),
  body('status')
    .trim()
    .isIn(BookInstance.schema.path('status').enumValues)
    .escape()
    .withMessage('Status is required.'),
  body('dueBack', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, 'id, title');
      const statuses = BookInstance.schema.path('status').enumValues;

      return res.render('createBookInstanceForm.njk', {
        title: 'Create Book Instance',
        bookInstance: res.body,
        allBooks,
        statuses,
        errors: errors.array(),
      });
    }

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
    });

    bookInstance.save((err) => {
      if (err) return next(err);
      res.redirect(bookInstance.url);
    });
  },
];

// Handle BookInstance delete on POST.
exports.postDeleteBookInstance = async function (req, res, next) {
  await BookInstance.findByIdAndDelete(req.params.id).catch((err) => next(err));
  res.redirect('/catalog/bookInstances');
};

// Display BookInstance update form on GET.
exports.getUpdateBookInstance = async function (req, res, next) {
  const [bookInstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id),
    Book.find({}, 'id, title'),
  ]).catch((err) => next(err));

  const statuses = BookInstance.schema.path('status').enumValues;

  return res.render('createBookInstanceForm.njk', {
    title: 'Update Book Instance',
    bookInstance,
    allBooks,
    statuses,
  });
};

// Handle bookinstance update on POST.
exports.postUpdateBookInstance = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
