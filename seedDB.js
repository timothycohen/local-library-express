#! /usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const Genre = require('./models/genre');
const BookInstance = require('./models/bookInstance');
const { logger, logError } = require('./utils/logger');

// set up connection
const mongoDB = process.env.DATABASE_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (err) => logError({ message: `MongoDB connection error: ${err.message}` }));

// filled as docs are saved in the factory functions. To be used as relationships for other documents
const genreDocs = [];
const authorDocs = [];
const bookDocs = [];
const bookInstanceDocs = [];

// factory functions
const createGenre = async ({ name }) => {
  const genre = new Genre({ name });
  const doc = await genre.save().catch((err) => {
    logger.error({ message: `Error creating genre: ${name}: ${err.message}` });
  });
  if (doc) {
    genreDocs.push(doc);
    logger.info({ message: `New Genre: ${genre.name}` });
  }
};

const createAuthor = async ({ firstName, familyName, dateOfBirth, dateOfDeath }) => {
  const author = new Author({ firstName, familyName, dateOfBirth, dateOfDeath });

  const doc = await author.save().catch((err) => {
    logger.error({ message: `Error creating author: ${firstName} ${familyName}: ${err.message}` });
  });
  if (doc) {
    authorDocs.push(doc);
    logger.info({ message: `New Author: ${author.firstName} ${author.familyName}` });
  }
};

const createBook = async ({ title, summary, isbn, author, genres }) => {
  const book = new Book({ title, summary, isbn, author, genres });

  const doc = await book.save().catch((err) => {
    logger.error({ message: `Error creating book: ${title}: ${err.message}` });
  });
  if (doc) {
    bookDocs.push(doc);
    logger.info({ message: `New Book: ${book.title}` });
  }
};

const createBookInstance = async ({ book, imprint, dueBack, status }) => {
  const bookInstance = new BookInstance({ book, imprint, dueBack, status });
  const doc = await bookInstance.save().catch((err) => {
    logger.error({ message: `Error creating bookInstance: ${bookInstance._id}: ${err.message}` });
  });
  if (doc) {
    bookInstanceDocs.push(doc);
    logger.info({ message: `New Book Instance: ${bookInstance._id}` });
  }
};

// seed data
// note that the books and book instances are functions that resolve to the data because some data isn't defined until the factories run
const seedGenres = [{ name: 'Fantasy' }, { name: 'Science Fiction' }, { name: 'French Poetry' }];

const seedAuthors = [
  { firstName: 'Patrick', familyName: 'Rothfuss', dateOfBirth: '1973-06-06' },
  { firstName: 'Ben', familyName: 'Bova', dateOfBirth: '1932-11-8' },
  {
    firstName: 'Isaac',
    familyName: 'Asimov',
    dateOfBirth: '1920-01-02',
    dateOfDeath: '1992-04-06',
  },
  { firstName: 'Bob', familyName: 'Billings' },
  { firstName: 'Jim', familyName: 'Jones', dateOfBirth: '1971-12-16' },
];

const getBooksData = () => [
  {
    title: 'The Name of the Wind (The Kingkiller Chronicle, #1)',
    summary:
      'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.',
    isbn: '9781473211896',
    author: authorDocs[0],
    genres: [genreDocs[0]],
  },
  {
    title: "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    summary:
      'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.',
    isbn: '9788401352836',
    author: authorDocs[0],
    genres: [genreDocs[0]],
  },
  {
    title: 'The Slow Regard of Silent Things (Kingkiller Chronicle)',
    summary:
      'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.',
    isbn: '9780756411336',
    author: authorDocs[0],
    genres: [genreDocs[0]],
  },

  {
    title: 'Apes and Angels',
    summary:
      'Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...',
    isbn: '9780765379528',
    author: authorDocs[1],
    genres: [genreDocs[1]],
  },
  {
    title: 'Death Wave',
    summary:
      "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
    isbn: '9780765379504',
    author: authorDocs[1],
    genres: [genreDocs[1]],
  },
  {
    title: 'Test Book 1',
    summary: 'Summary of test book 1',
    isbn: 'ISBN111111',
    author: authorDocs[4],
    genres: [genreDocs[0], genreDocs[1]],
  },
  {
    title: 'Test Book 2',
    summary: 'Summary of test book 2',
    isbn: 'ISBN222222',
    author: authorDocs[4],
  },
];

const getBookInstancesData = () => [
  { book: bookDocs[0], imprint: 'London Gollancz, 2014.', status: 'Available' },
  { book: bookDocs[1], imprint: 'Gollancz, 2011.', status: 'Loaned' },
  { book: bookDocs[2], imprint: 'Gollancz, 2015.' },
  {
    book: bookDocs[3],
    imprint: 'New York Tom Doherty Associates, 2016.',
    status: 'Available',
  },
  {
    book: bookDocs[3],
    imprint: 'New York Tom Doherty Associates, 2016.',
    status: 'Available',
  },
  {
    book: bookDocs[3],
    imprint: 'New York Tom Doherty Associates, 2016.',
    status: 'Available',
  },
  {
    book: bookDocs[4],
    imprint: 'New York, NY Tom Doherty Associates, LLC, 2015.',
    status: 'Available',
  },
  {
    book: bookDocs[4],
    imprint: 'New York, NY Tom Doherty Associates, LLC, 2015.',
    status: 'Maintenance',
  },
  {
    book: bookDocs[4],
    imprint: 'New York, NY Tom Doherty Associates, LLC, 2015.',
    status: 'Loaned',
  },
  {
    book: bookDocs[0],
    imprint: 'Imprint XXX2',
  },
  {
    book: bookDocs[1],
    imprint: 'Imprint XXX3',
  },
];

// run factories and then close the connection
const seed = async () => {
  logger.info({ message: '🌱' });

  await Promise.all(seedGenres.map(createGenre)).catch((err) =>
    logger.error({ message: `createGenre failed ${err.message}` })
  );
  await Promise.all(seedAuthors.map(createAuthor)).catch((err) =>
    logger.error({ message: `createAuthor failed ${err.message}` })
  );
  const seedBooks = getBooksData();
  await Promise.all(seedBooks.map(createBook)).catch((err) =>
    logger.error({ message: `createBook failed ${err.message}` })
  );
  const seedBookInstances = getBookInstancesData();
  await Promise.all(seedBookInstances.map(createBookInstance)).catch((err) =>
    logger.error({ message: `createBookInstance failed ${err.message}` })
  );

  mongoose.connection.close();
};

seed();
