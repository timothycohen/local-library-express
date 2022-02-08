const express = require('express');
const { overview } = require('../controllers/overviewController');
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');
const bookInstanceController = require('../controllers/bookInstanceController');

const router = express.Router();

/* ######################### Overview #########################  */

// Get a count of each item
router.get('/', overview);

/* ######################### Books #########################  */

// GET all
router.get('/books', bookController.bookList);

// GET create form
// warn This must come before :id routes
router.get('/book/create', bookController.getCreateBook);

// POST create form
router.post('/book/create', bookController.postCreateBook);

// GET one
router.get('/book/:id', bookController.book);

// GET request to delete Book.
router.get('/book/:id/delete', bookController.getDeleteBook);

// POST request to delete Book.
router.post('/book/:id/delete', bookController.postDeleteBook);

// GET request to update Book.
router.get('/book/:id/update', bookController.getUpdateBook);

// POST request to update Book.
router.post('/book/:id/update', bookController.postUpdateBook);

/* ######################### Authors #########################  */

// GET all
router.get('/authors', authorController.authorList);

// GET create form
// warn This must come before :id routes
router.get('/author/create', authorController.getCreateAuthor);

// POST create form
router.post('/author/create', authorController.postCreateAuthor);

// GET one
router.get('/author/:id', authorController.authorDetail);

// GET delete author page
router.get('/author/:id/delete', authorController.getDeleteAuthor);

// POST delete author
router.post('/author/:id/delete', authorController.postDeleteAuthor);

// GET request to update Author.
router.get('/author/:id/update', authorController.getUpdateAuthor);

// POST request to update Author.
router.post('/author/:id/update', authorController.postUpdateAuthor);

/* ######################### Genres #########################  */

// GET all
router.get('/genres', genreController.genreList);

// GET create form
// warn This must come before :id routes
router.get('/genre/create', genreController.getCreateGenre);

// POST create form
router.post('/genre/create', genreController.postCreateGenre);

// GET one
router.get('/genre/:id', genreController.genre);

// POST request to delete Genre.
router.post('/genre/:id/delete', genreController.postDeleteGenre);

// GET request to update Genre.
router.get('/genre/:id/update', genreController.getUpdateGenre);

// POST request to update Genre.
router.post('/genre/:id/update', genreController.postUpdateGenre);

/* ######################### Book Instances #########################  */

// GET all
router.get('/bookInstances', bookInstanceController.bookInstanceList);

// GET create form
// warn This must come before :id routes
router.get('/bookinstance/create', bookInstanceController.getCreateBookInstance);

// POST create form
router.post('/bookinstance/create', bookInstanceController.postCreateBookInstance);

// GET one
router.get('/bookInstance/:id', bookInstanceController.bookInstanceDetail);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', bookInstanceController.postDeleteBookInstance);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', bookInstanceController.getUpdateBookInstance);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', bookInstanceController.postUpdateBookInstance);

module.exports = router;
