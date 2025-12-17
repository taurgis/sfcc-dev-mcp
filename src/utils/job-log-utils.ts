/**
 * Shared utilities for job log operations
 */

import { LogToolValidators } from './log-tool-utils.js';

export class JobLogValidators {
  /**
   * Allowed log levels for job logs (includes 'all' for job-specific operations)
   * @deprecated Use LogToolValidators.validateLogLevel instead
   */
  static readonly ALLOWED_LEVELS = ['error', 'warn', 'info', 'debug', 'all'] as const;

  /**
   * Validate job log level parameter
   * Delegates to LogToolValidators for consistency
   * @param level - The level to validate
   * @param toolName - Optional tool name for better error messages
   */
  static validateJobLogLevel(level: string, toolName?: string): void {
    LogToolValidators.validateLogLevel(level, toolName ?? 'job_log_tool');
  }
}

export class JobLogFormatters {
  /**
   * Format a consistent log message for job operations
   * @param operation - The operation being performed
   * @param params - Parameters for the operation
   */
  static formatJobLogMessage(
    operation: string,
    params: {
      jobName?: string;
      level?: string;
      limit?: number;
      pattern?: string;
    },
  ): string {
    const parts = [operation];

    if (params.jobName) {
      parts.push(`jobName=${params.jobName}`);
    }

    if (params.level) {
      parts.push(`level=${params.level}`);
    }

    if (params.limit !== undefined) {
      parts.push(`limit=${params.limit}`);
    }

    if (params.pattern) {
      parts.push(`pattern="${params.pattern}"`);
    }

    return parts.join(' ');
  }
}
