import pino from "pino";
import type { Logger } from "pino";

const logger = pino({
  name: "danky",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  level: process.env["LOG_LEVEL"] && process.env["LOG_LEVEL"].length > 0
    ? process.env["LOG_LEVEL"]
    : "info",
});

export type { Logger };
export default logger;
