const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

// Display Overview Details
exports.index = async (req, res) => {
  Promise.all([
    Book.countDocuments({}),
    BookInstance.countDocuments({}),
    BookInstance.countDocuments({ status: 'Available' }),
    Author.countDocuments({}),
    Genre.countDocuments({}),
  ])
    .then(
      ([bookCount, bookInstanceCount, bookInstanceAvailableCount, authorCount, genreCount]) => ({
        bookCount,
        bookInstanceCount,
        bookInstanceAvailableCount,
        authorCount,
        genreCount,
      })
    )
    .then((results) => {
      const data = {
        title: 'Local Library Home',
        ...results,
        error: null,
      };
      res.render('overview.njk', data);
    })
    .catch((error) => {
      const data = {
        error,
        title: 'Local Library Home',
      };
      res.render('overview.njk', data);
    });
};

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
exports.book_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

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
