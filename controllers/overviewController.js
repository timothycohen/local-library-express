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
    .catch(next);
};

module.exports = { overview };
