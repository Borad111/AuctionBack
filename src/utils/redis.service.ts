import redisClient from "../config/redis";
import logger from "../utils/logger";

export class RedisService {
  // ✅ Data set karna
  static async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      const options = ttl ? { EX: ttl } : {};
      await redisClient.set(key, stringValue, options);
    } catch (error) {
      logger.error("Redis set error:", error);
      // Fail silently - cache fail hone par application nahi rukna chahiye
    }
  }

  // ✅ Data get karna
  // Redis service mein metrics add karo
  static async get<T>(key: string): Promise<T | null> {
    const start = Date.now();
    try {
      const data = await redisClient.get(key);
      const duration = Date.now() - start;

      // ✅ Cache hit/miss metrics
      logger.info(
        `Redis GET ${key} - ${duration}ms - ${data ? "HIT" : "MISS"}`
      );

      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Redis get error:", error);
      return null;
    }
  }

  // ✅ Data delete karna
  static async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error("Redis delete error:", error);
    }
  }

  // ✅ Cache clear karna (pattern based)
  static async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      logger.error("Redis clear pattern error:", error);
    }
  }
}
