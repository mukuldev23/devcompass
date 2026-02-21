const env = require('../config/env');

function apiKeyMiddleware(req, res, next) {
  const providedApiKey = req.header('x-api-key');

  if (!providedApiKey || providedApiKey !== env.ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  return next();
}

module.exports = apiKeyMiddleware;
