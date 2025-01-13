// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

type LogLevelString = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LOG_LEVEL_VALUES = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
} as const;

type LogLevel = (typeof LOG_LEVEL_VALUES)[keyof typeof LOG_LEVEL_VALUES];

const LOG_COLORS = {
  [LOG_LEVEL_VALUES.TRACE]: '\x1b[90m', // Gray
  [LOG_LEVEL_VALUES.DEBUG]: '\x1b[90m', // Gray
  [LOG_LEVEL_VALUES.INFO]: '\x1b[90m', // Gray
  [LOG_LEVEL_VALUES.WARN]: '\x1b[1;93m', // Bold bright yellow
  [LOG_LEVEL_VALUES.ERROR]: '\x1b[1;91m', // Bold bright red
  [LOG_LEVEL_VALUES.FATAL]: '\x1b[1;101m', // Red background, Bold text
} as const;

const LOG_LEVEL_MAP: Record<LogLevelString, LogLevel> = {
  trace: LOG_LEVEL_VALUES.TRACE,
  debug: LOG_LEVEL_VALUES.DEBUG,
  info: LOG_LEVEL_VALUES.INFO,
  warn: LOG_LEVEL_VALUES.WARN,
  error: LOG_LEVEL_VALUES.ERROR,
  fatal: LOG_LEVEL_VALUES.FATAL,
} as const;

const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LOG_LEVEL_VALUES.TRACE]: 'trace',
  [LOG_LEVEL_VALUES.DEBUG]: 'debug',
  [LOG_LEVEL_VALUES.INFO]: 'info',
  [LOG_LEVEL_VALUES.WARN]: 'warn',
  [LOG_LEVEL_VALUES.ERROR]: 'error',
  [LOG_LEVEL_VALUES.FATAL]: 'fatal',
} as const;

export class Logger {
  private readonly level: LogLevel;
  private static readonly RESET = '\x1b[0m';

  constructor({ level = LOG_LEVEL_VALUES.INFO }: { level?: LogLevelString | LogLevel } = {}) {
    this.level = this.parseLogLevel(level);
  }

  private parseLogLevel(level: LogLevel | LogLevelString): LogLevel {
    if (typeof level === 'number') return level;
    return LOG_LEVEL_MAP[level.toLowerCase() as LogLevelString];
  }

  private log(level: LogLevel, ...args: unknown[]): void {
    if (level < this.level) return;

    const color = LOG_COLORS[level];
    const levelStr = `[${LOG_LEVEL_NAMES[level]}]`;
    const formattedArgs = args.map(this.formatValue);

    if (level >= LOG_LEVEL_VALUES.WARN) {
      // Use console.warn or console.error for appropriate levels
      const logMethod = level >= LOG_LEVEL_VALUES.ERROR ? console.error : console.warn;
      logMethod(`${color}${levelStr}${Logger.RESET}`, ...formattedArgs);
    } else {
      // Use process.stdout.write for other levels to avoid console.log
      const output = [`${color}${levelStr}${Logger.RESET}`, ...formattedArgs].join(' ') + '\n';
      process.stdout.write(output);
    }
  }

  private formatValue(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
  }

  private createLogMethod(level: LogLevel) {
    return (...args: unknown[]) => this.log(level, ...args);
  }

  trace = this.createLogMethod(LOG_LEVEL_VALUES.TRACE);
  debug = this.createLogMethod(LOG_LEVEL_VALUES.DEBUG);
  info = this.createLogMethod(LOG_LEVEL_VALUES.INFO);
  warn = this.createLogMethod(LOG_LEVEL_VALUES.WARN);
  error = this.createLogMethod(LOG_LEVEL_VALUES.ERROR);
  fatal = this.createLogMethod(LOG_LEVEL_VALUES.FATAL);
}

export interface LoggerOptions {
  level?: LogLevelString | LogLevel;
}

export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger(options);
}

export { LOG_LEVEL_VALUES as LogLevel };
export type { LogLevelString };
