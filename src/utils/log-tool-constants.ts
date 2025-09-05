/**
 * Shared constants for log tool handlers
 * Centralizes defaults, types, and configuration
 */

// Log levels enum for type safety
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  ALL = 'all'
}

// Default limits for different tool types
export const DEFAULT_LIMITS = {
  latest: 10,
  search: 20,
  jobEntries: 50,
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
  | { tool: 'search_logs'; pattern: string; logLevel?: LogLevel; limit?: number; date?: string }
  | { tool: 'list_log_files' }
  | { tool: 'get_log_file_contents'; filename: string; maxBytes?: number; tailOnly?: boolean };

export type JobLogToolArgs =
  | { tool: 'get_latest_job_log_files'; limit?: number }
  | { tool: 'search_job_logs_by_name'; jobName: string; limit?: number }
  | { tool: 'get_job_log_entries'; level?: LogLevel; limit?: number; jobName?: string }
  | { tool: 'search_job_logs'; pattern: string; level?: LogLevel; limit?: number; jobName?: string }
  | { tool: 'get_job_execution_summary'; jobName: string };

// Helper functions
export function getLimit(providedLimit: number | undefined, toolType: keyof typeof DEFAULT_LIMITS): number {
  return providedLimit ?? DEFAULT_LIMITS[toolType];
}

export function isValidLogLevel(level: string): level is LogLevel {
  return Object.values(LogLevel).includes(level as LogLevel);
}

export function deriveLogLevel(toolName: string, argsLevel?: string): LogLevel {
  if (argsLevel && isValidLogLevel(argsLevel)) {
    return argsLevel as LogLevel;
  }

  // Extract level from tool name for get_latest_* tools
  const match = toolName.match(/get_latest_(\w+)/);
  if (match && isValidLogLevel(match[1])) {
    return match[1] as LogLevel;
  }

  return LogLevel.ALL;
}
