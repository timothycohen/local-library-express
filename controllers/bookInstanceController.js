const { isValidObjectId } = require('mongoose');
const { body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');
const { pass404 } = require('../utils/errors');

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
exports.bookInstanceDetail = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book instance', 'Invalid Object Id', next);

  BookInstance.findById(req.params.id)
    .populate('book')
    .then((bookInstance) => {
      if (!bookInstance) return pass404('book instance', `Couldn't find id ${id}.`, next);

      res.render('bookInstance.njk', {
        title: `Book Instance: ${bookInstance.book.title}`,
        bookInstance,
      });
    })
    .catch(next);
};

// Display BookInstance create form on GET.
exports.getCreateBookInstance = async function (req, res, next) {
  try {
    const allBooks = await Book.find({}, 'id, title');
    const statuses = BookInstance.schema.path('status').enumValues;
    res.render('createBookInstanceForm.njk', {
      title: 'Create Book Instance',
      allBooks,
      statuses,
      today: new Date().toLocaleDateString('en-CA'),
    });
  } catch (err) {
    next(err);
  }
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
      try {
        const allBooks = await Book.find({}, 'id, title');
        const statuses = BookInstance.schema.path('status').enumValues;

        return res.render('createBookInstanceForm.njk', {
          title: 'Create Book Instance',
          bookInstance: res.body,
          allBooks,
          statuses,
          errors: errors.array(),
        });
      } catch (err) {
        next(err);
      }
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
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book instance', `Invalid Object Id`, next);

  try {
    await BookInstance.findByIdAndDelete(req.params.id);
    res.redirect('/catalog/bookInstances');
  } catch (err) {
    next(err);
  }
};

// Display BookInstance update form on GET.
exports.getUpdateBookInstance = async function (req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return pass404('book instance', 'Invalid Object Id', next);

  try {
    const [bookInstance, allBooks] = await Promise.all([
      BookInstance.findById(id),
      Book.find({}, 'id, title'),
    ]);

    if (!bookInstance) return pass404('book instance', `Couldn't find id ${id}.`, next);

    const statuses = BookInstance.schema.path('status').enumValues;

    return res.render('createBookInstanceForm.njk', {
      title: 'Update Book Instance',
      bookInstance: {
        ...bookInstance._doc,
        dueBack: new Date(bookInstance.dueBack).toLocaleDateString('en-CA'),
      },
      allBooks,
      statuses,
    });
  } catch (err) {
    next(err);
  }
};

// Handle bookinstance update on POST.
exports.postUpdateBookInstance = [
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
        title: 'Update Book Instance',
        bookInstance: res.body,
        allBooks,
        statuses,
        errors: errors.array(),
      });
    }

    const ogInstance = await BookInstance.findById(req.params.id);

    BookInstance.findByIdAndUpdate(
      req.params.id,
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        dueBack: req.body.dueBack,
      },
      (err) => {
        if (err) return next(err);
        return res.redirect(ogInstance.url);
      }
    );
  },
];
