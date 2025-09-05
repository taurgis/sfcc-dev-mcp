/**
 * Constants and configuration values for log operations
 */

export const LOG_CONSTANTS = {
  /** Default number of bytes to read from the end of large files */
  DEFAULT_TAIL_BYTES: 200 * 1024, // 200KB

  /** Maximum number of log files to show in listings */
  MAX_LOG_FILES_DISPLAY: 50,

  /** Default search result limit */
  DEFAULT_SEARCH_LIMIT: 20,

  /** Order multiplier for file priority calculation */
  FILE_ORDER_MULTIPLIER: 1000000,

  /** Supported log levels */
  LOG_LEVELS: ['error', 'warn', 'info', 'debug'] as const,
} as const;

export const LOG_FILE_PATTERNS = {
  /** Standard log file pattern (e.g., "error-", "warn-") */
  STANDARD: (level: string) => `${level}-`,

  /** Custom log file pattern (e.g., "customerror-", "customwarn-") */
  CUSTOM: (level: string) => `custom${level}-`,

  /** Job log file pattern (e.g., "Job-") */
  JOB: () => 'Job-',
} as const;

export const JOB_LOG_CONSTANTS = {
  /** Jobs folder path */
  JOBS_FOLDER: '/jobs/',

  /** Default number of job logs to return */
  DEFAULT_JOB_LOG_LIMIT: 10,

  /** Job log file name pattern for matching */
  JOB_LOG_PATTERN: /^Job-.+\.log$/,
} as const;

export const LOG_MESSAGES = {
  NO_FILES_FOUND: (level: string, date: string, available: string) =>
    `No ${level} log files found for date ${date}. Available files: ${available}`,

  NO_SEARCH_MATCHES: (pattern: string, date: string) =>
    `No matches found for "${pattern}" in logs for ${date}`,

  SEARCH_RESULTS: (count: number, pattern: string) =>
    `Found ${count} matches for "${pattern}":`,
} as const;
