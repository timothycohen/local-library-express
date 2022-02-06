const express = require('express');
const { overview } = require('../controllers/overviewController');
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');
const bookInstanceController = require('../controllers/bookInstanceController');

const router = express.Router();

/* ##### Overview #####  */

// Get a count of each item
router.get('/', overview);

/* ##### Books #####  */

// GET all
router.get('/books', bookController.bookList);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', bookController.getCreateBook);

// POST request for creating Book.
router.post('/book/create', bookController.postCreateBook);

// GET one
router.get('/book/:id', bookController.book);

/* ######################### TODO #########################  */

// GET request to delete Book.
router.get('/book/:id/delete', bookController.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', bookController.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', bookController.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', bookController.book_update_post);

/* ##### Authors #####  */

// GET all
router.get('/authors', authorController.authorList);

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', authorController.getCreateAuthor);

// POST request for creating Author.
router.post('/author/create', authorController.postCreateAuthor);

// GET one
router.get('/author/:id', authorController.authorDetail);

/* ######################### TODO #########################  */
// GET request to delete Author.
router.get('/author/:id/delete', authorController.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', authorController.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', authorController.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', authorController.author_update_post);

/* ##### Genres #####  */

// GET all
router.get('/genres', genreController.genreList);

// GET create genre form
router.get('/genre/create', genreController.getCreateGenre);

// POST create genre form
router.post('/genre/create', genreController.postCreateGenre);

// GET one
router.get('/genre/:id', genreController.genre);

/* ######################### TODO #########################  */

// GET request to delete Genre.
router.get('/genre/:id/delete', genreController.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genreController.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genreController.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genreController.genre_update_post);

/* ##### Book Instances #####  */

// GET all
router.get('/bookInstances', bookInstanceController.bookInstanceList);

// GET one
router.get('/bookInstance/:id', bookInstanceController.bookInstanceDetail);

/* ######################### TODO #########################  */
// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', bookInstanceController.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstance/create', bookInstanceController.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', bookInstanceController.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', bookInstanceController.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', bookInstanceController.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', bookInstanceController.bookinstance_update_post);

module.exports = router;
