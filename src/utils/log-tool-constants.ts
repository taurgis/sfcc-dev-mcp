/**
 * Shared constants for log tool handlers
 * Centralizes defaults, types, and configuration
 */

import type { LogLevel as BaseLogLevel } from '../types/types.js';

// Extended log level type that includes 'all' for tool filtering
export type LogLevelWithAll = BaseLogLevel | 'all';

// Re-export base LogLevel for convenience
export type { LogLevel } from '../types/types.js';

// Log levels enum for validation and iteration
export const LogLevelValues = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  ALL: 'all',
} as const;

// Default limits for different tool types
export const DEFAULT_LIMITS = {
  latest: 20,
  search: 20,
  jobEntries: 10,
  jobSearch: 20,
  jobFiles: 10,
} as const;

// Tool name sets for O(1) lookup
export const LOG_TOOL_NAMES_SET = new Set([
  'get_latest_error',
  'get_latest_warn',
  'get_latest_info',
  'get_latest_debug',
  'summarize_logs',
  'search_logs',
  'list_log_files',
  'get_log_file_contents',
] as const);

export const JOB_LOG_TOOL_NAMES_SET = new Set([
  'get_latest_job_log_files',
  'search_job_logs_by_name',
  'get_job_log_entries',
  'search_job_logs',
  'get_job_execution_summary',
] as const);

// Type definitions
export type LogToolName = 'get_latest_error' | 'get_latest_warn' | 'get_latest_info' | 'get_latest_debug' |
                         'summarize_logs' | 'search_logs' | 'list_log_files' | 'get_log_file_contents';

export type JobLogToolName = 'get_latest_job_log_files' | 'search_job_logs_by_name' | 'get_job_log_entries' |
                            'search_job_logs' | 'get_job_execution_summary';

// Typed argument interfaces for each tool
export type LogToolArgs =
  | { tool: 'get_latest_error' | 'get_latest_warn' | 'get_latest_info' | 'get_latest_debug'; limit?: number; date?: string }
  | { tool: 'summarize_logs'; date?: string }
  | { tool: 'search_logs'; pattern: string; logLevel?: LogLevelWithAll; limit?: number; date?: string }
  | { tool: 'list_log_files' }
  | { tool: 'get_log_file_contents'; filename: string; maxBytes?: number; tailOnly?: boolean };

export type JobLogToolArgs =
  | { tool: 'get_latest_job_log_files'; limit?: number }
  | { tool: 'search_job_logs_by_name'; jobName: string; limit?: number }
  | { tool: 'get_job_log_entries'; level?: LogLevelWithAll; limit?: number; jobName?: string }
  | { tool: 'search_job_logs'; pattern: string; level?: LogLevelWithAll; limit?: number; jobName?: string }
  | { tool: 'get_job_execution_summary'; jobName: string };

// Helper functions
export function getLimit(providedLimit: number | undefined, toolType: keyof typeof DEFAULT_LIMITS): number {
  return providedLimit ?? DEFAULT_LIMITS[toolType];
}

export function isValidLogLevel(level: string): level is LogLevelWithAll {
  return Object.values(LogLevelValues).includes(level as LogLevelWithAll);
}
