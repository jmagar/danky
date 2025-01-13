import IORedis from 'ioredis';
import { env } from './env';

const createClient = () => {
  const client = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    showFriendlyErrorStack: env.NODE_ENV === 'development',
  });

  client.on('error', error => {
    console.error('Redis Client Error:', error);
  });

  return client;
};

// Create shared Redis client
export const redis = createClient();

// PubSub clients need separate connections
export const createPubSubClient = () => {
  const pub = createClient();
  const sub = createClient();
  return { pub, sub };
};
