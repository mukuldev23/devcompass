const logger = require('../config/logger');

function errorMiddleware(error, req, res, next) {
  logger.error({
    err: error,
    route: req.originalUrl,
    method: req.method
  }, 'Unhandled error');

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error'
  });
}

module.exports = errorMiddleware;
