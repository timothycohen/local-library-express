const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');

const { timestamp, combine, uncolorize, json, colorize, printf } = format;

/** winston levels are as follows: error warn info http verbose debug silly
 *  log errors to './logs/error.log'
 *  log everything with a level of error/warn/info/http to './logs/combined.log' and the console
 */

const options = {
  file: {
    level: 'http',
    filename: './logs/combined.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: combine(
      uncolorize(),
      timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      json(),
      printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    ),
  },
  console: {
    level: 'http',
    format: combine(
      colorize(),
      timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    ),
  },
};

const logger = createLogger({
  transports: [
    new transports.File({ ...options.file, level: 'error', filename: './logs/error.log' }),
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
});

/*  set up two middleware functions
 *  morgan to monitor and pipe all http requests through winston
 *  an error logger to log errors as the last middleware before rendering the error template
 */

const logHTTP = morgan('dev', {
  stream: { write: (message) => logger.http(message.trim()) },
});

const logError = (err, req, res, next) => {
  logger.error({ message: err.message });
  next(err);
};

module.exports = { logger, logHTTP, logError };
