const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');

const env = require('./config/env');
const logger = require('./config/logger');
const apiRoutes = require('./routes');
const notFoundMiddleware = require('./middlewares/not-found.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

function normalizeOrigin(rawOrigin) {
  try {
    return new URL(rawOrigin).origin;
  } catch {
    return null;
  }
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(request) {
        return {
          id: request.id,
          method: request.method,
          url: request.url
        };
      }
    }
  })
);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const allowed = normalizedOrigin && env.ALLOWED_CLIENT_ORIGINS.includes(normalizedOrigin);

      if (allowed) {
        return callback(null, true);
      }

      logger.warn({ origin, allowedOrigins: env.ALLOWED_CLIENT_ORIGINS }, 'Blocked by CORS policy');
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key']
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: '200kb' }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OK'
  });
});

const originRestrictedPublicPaths = new Set([
  '/articles',
  '/articles/random',
  '/articles/hot',
  '/categories',
  '/sources'
]);

app.use('/api', (req, res, next) => {
  if (!env.RESTRICT_PUBLIC_API_TO_ORIGINS) {
    return next();
  }

  if (req.method === 'OPTIONS') {
    return next();
  }

  const requestOrigin = req.get('origin');
  const normalizedOrigin = requestOrigin ? normalizeOrigin(requestOrigin) : null;
  const isPublicGetRoute = req.method === 'GET' && originRestrictedPublicPaths.has(req.path);
  const isAllowedOrigin = normalizedOrigin && env.ALLOWED_CLIENT_ORIGINS.includes(normalizedOrigin);

  if (isPublicGetRoute && !isAllowedOrigin) {
    logger.warn(
      { path: req.path, method: req.method, origin: requestOrigin || null },
      'Blocked direct public API access without an allowed Origin'
    );
    return res.status(403).json({
      success: false,
      message: 'Direct API access is restricted'
    });
  }

  return next();
});

app.use('/api', apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
