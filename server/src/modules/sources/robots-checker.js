const { URL } = require('url');
const robotsParser = require('robots-parser');
const httpClient = require('../../utils/http-client');
const logger = require('../../config/logger');

const ROBOTS_CACHE = new Map();
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const USER_AGENT = 'Devcompass-Bot';

async function getRobots(url) {
  const parsedUrl = new URL(url);
  const robotsUrl = `${parsedUrl.origin}/robots.txt`;

  const existing = ROBOTS_CACHE.get(robotsUrl);
  if (existing && existing.expiresAt > Date.now()) {
    return existing.parser;
  }

  try {
    const response = await httpClient.get(robotsUrl);
    const parser = robotsParser(robotsUrl, response.data);

    ROBOTS_CACHE.set(robotsUrl, {
      parser,
      expiresAt: Date.now() + CACHE_TTL_MS
    });

    return parser;
  } catch (error) {
    logger.warn({ err: error, robotsUrl }, 'Unable to fetch robots.txt. Blocking source for compliance');
    return null;
  }
}

async function isAllowedByRobots(url) {
  const parser = await getRobots(url);
  if (!parser) return false;

  try {
    const isAllowed = parser.isAllowed(url, USER_AGENT);

    // Only explicit false is treated as blocked; undefined/null fall back to allowed.
    return isAllowed !== false;
  } catch (error) {
    logger.warn({ err: error, url }, 'Unable to parse robots response');
    return false;
  }
}

module.exports = {
  isAllowedByRobots
};
