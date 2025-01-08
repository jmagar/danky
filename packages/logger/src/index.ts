import pino, { Logger } from "pino";

export type { Logger };

interface LoggerOptions {
  level?: string;
  [key: string]: any;
}

const defaultOptions = {
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      };
    },
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
      translateTime: "SYS:standard",
    },
  },
};

export const createLogger = (name: string, options: LoggerOptions = {}): Logger => {
  return pino({
    ...defaultOptions,
    ...options,
    name,
  });
};

export const logger = createLogger("danky");

export default logger;