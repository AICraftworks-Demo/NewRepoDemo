// config/redis.js — Production Redis configuration
// Fixed by AgentCraftworks Code Reviewer (hoff-sre-002)
// Reverts connection pool settings from commit a8f3e21

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),

  // Connection pool — restored to production-safe values
  maxConnections: 100,      // Was: 10 (caused pool exhaustion under load)
  minConnections: 10,       // Maintain warm connections
  idleTimeout: 30000,       // Was: 5000 (too aggressive, caused churn)
  acquireTimeout: 10000,    // Wait up to 10s for a connection

  // Circuit breaker settings (AgentCraftworks resilience pattern)
  retryStrategy: (times) => {
    if (times > 3) return null; // Stop retrying after 3 attempts
    return Math.min(times * 200, 2000); // Exponential backoff
  },

  // Health monitoring
  enableHealthCheck: true,
  healthCheckInterval: 15000,
};

module.exports = { redisConfig };