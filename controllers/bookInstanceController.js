const BookInstance = require('../models/bookInstance');

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
    .exec((err, data) => {
      const [bookInstance] = data;
      if (err) return next(err);
      res.render('bookInstance.njk', {
        bookInstance,
      });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
