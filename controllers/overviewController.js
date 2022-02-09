const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

// Display Overview Details
const overview = async (req, res, next) => {
  Promise.all([
    Book.countDocuments({}),
    BookInstance.countDocuments({}),
    BookInstance.countDocuments({ status: 'Available' }),
    Author.countDocuments({}),
    Genre.countDocuments({}),
  ])
    .then(([bookCount, bookInstanceCount, bookInstanceAvailableCount, authorCount, genreCount]) => {
      res.render('overview.njk', {
        title: 'Local Library Home',
        bookCount,
        bookInstanceCount,
        bookInstanceAvailableCount,
        authorCount,
        genreCount,
      });
    })
    .catch(next);
};

module.exports = { overview };
