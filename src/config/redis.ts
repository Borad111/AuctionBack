import { createClient } from 'redis';

// Redis connection configuration
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

// Error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

// Connect function
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connection established');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    process.exit(1);
  }
};

export default redisClient;