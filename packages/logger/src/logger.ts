import type { Logger } from 'pino';
import pino from 'pino';
import { env } from './env';

// Configure base logger
export const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: label => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['*.password', '*.secret', '*.token', '*.key'],
    remove: true,
  },
});

// Create child loggers for different contexts
export const createLogger = (context: string): Logger => {
  return logger.child({ context });
};

// Export pre-configured loggers
export const dbLogger = createLogger('database');
export const apiLogger = createLogger('api');
export const mcpLogger = createLogger('mcp');
