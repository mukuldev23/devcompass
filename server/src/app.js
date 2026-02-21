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
    origin: env.CLIENT_ORIGIN,
    methods: ['GET', 'POST']
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

app.use('/api', apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
