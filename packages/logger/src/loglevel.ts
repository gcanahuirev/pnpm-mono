/**
 * Indicates the severity of a log message.
 */
export enum LogLevel {
  /** Critical error, system stability is affected. */
  ERROR = 'error',

  /** Non-critical error, system stability is not affected, but issue should be investigated. */
  WARN = 'warn',

  /** Informative message. */
  INFO = 'info',

  /** HTTP access logging. */
  HTTP = 'http',

  /** More verbose informative message. */
  VERBOSE = 'verbose',

  /** Message to assist with debugging. */
  DEBUG = 'debug',

  /** Unnecessarily noisy or frequent message. */
  SILLY = 'silly',
}

const allLogLevels: string[] = [
  LogLevel.ERROR,
  LogLevel.WARN,
  LogLevel.INFO,
  LogLevel.HTTP,
  LogLevel.VERBOSE,
  LogLevel.DEBUG,
  LogLevel.SILLY,
];

/**
 * Determines if the value is a valid log level or not.
 * @param value the value to test
 * @returns true if a log level, false if not
 */
export function isLogLevel(value: unknown): value is LogLevel {
  if (typeof value !== 'string') {
    return false;
  }
  return allLogLevels.indexOf(value) !== -1;
}
