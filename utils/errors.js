const createError = require('http-errors');

const pass404 = (type, cause, next) => {
  const err404 = createError(404);
  err404.message = `Shoot! Couldn't find that ${type}.`;
  err404.cause = cause;
  return next(err404);
};

module.exports = { pass404 };
