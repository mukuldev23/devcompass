const Redis = require('ioredis');
const env = require('./env');
const logger = require('./logger');

class CacheClient {
  constructor() {
    this.memoryStore = new Map();
    this.redis = null;

    if (env.REDIS_URL) {
      this.redis = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableReadyCheck: true
      });

      this.redis.on('error', (error) => {
        logger.warn({ err: error }, 'Redis unavailable. Falling back to in-memory cache');
      });
    }
  }

  async connect() {
    if (!this.redis) return;

    try {
      await this.redis.connect();
      logger.info('Redis cache connected');
    } catch (error) {
      logger.warn({ err: error }, 'Unable to connect Redis cache');
      this.redis = null;
    }
  }

  async disconnect() {
    if (!this.redis) return;
    await this.redis.quit();
  }

  async get(key) {
    if (this.redis) {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    }

    const record = this.memoryStore.get(key);
    if (!record) return null;

    if (record.expiresAt && record.expiresAt <= Date.now()) {
      this.memoryStore.delete(key);
      return null;
    }

    return record.value;
  }

  async set(key, value, ttlSeconds) {
    if (this.redis) {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }

    this.memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    });
  }

  async del(key) {
    if (this.redis) {
      await this.redis.del(key);
      return;
    }

    this.memoryStore.delete(key);
  }

  async deleteByPrefix(prefix) {
    if (this.redis) {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length) {
        await this.redis.del(...keys);
      }
      return;
    }

    for (const key of this.memoryStore.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryStore.delete(key);
      }
    }
  }
}

module.exports = new CacheClient();
