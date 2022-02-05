const Author = require('../models/author');
const Book = require('../models/book');

// Display list of all Authors.
exports.authorList = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, authorList) => {
      if (err) return next(err);
      res.render('authorList.njk', {
        layout: 'layout.njk',
        title: 'Author List',
        authorList,
      });
    });
};

// Display detail page for a specific Author.
exports.authorDetail = function (req, res, next) {
  Promise.all([
    Author.find({ _id: req.params.id }),
    Book.find({ author: req.params.id }, 'title summary').sort({ title: 1 }),
  ])
    .then(([author, books]) => ({
      author,
      books,
    }))
    .then((data) => {
      res.render('author.njk', {
        layout: 'layout.njk',
        data,
      });
    })
    .catch((err) => next(err));
};

// Display Author create form on GET.
exports.author_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create POST');
};

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
