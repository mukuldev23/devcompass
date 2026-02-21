const axios = require('axios');
const env = require('../config/env');

const httpClient = axios.create({
  timeout: env.REQUEST_TIMEOUT_MS,
  headers: {
    'User-Agent': 'DevCompass-Bot/1.0'
  }
});

module.exports = httpClient;
