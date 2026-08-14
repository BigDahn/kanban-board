const Ioredis = require('ioredis');

const connection = new Ioredis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

connection.on('connect', () => {
  console.log('✅ Redis connected');
});

connection.on('ready', () => {
  console.log('✅ Redis ready');
});

connection.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = connection;
