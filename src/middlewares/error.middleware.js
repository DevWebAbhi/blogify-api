const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    message = err.message || message;
  } else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = field ? `Duplicate field value: ${field}` : 'Duplicate key error';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors || {}).map(e => e.message).join(', ');
    message = messages || 'Validation error';
  } else if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  res.status(statusCode).json({ success: false, error: { message } });
};

module.exports = errorHandler;
