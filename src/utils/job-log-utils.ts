/**
 * Shared utilities for job log operations
 */

export class JobLogValidators {
  /**
   * Allowed log levels for job logs (includes 'all' for job-specific operations)
   */
  static readonly ALLOWED_LEVELS = ['error', 'warn', 'info', 'debug', 'all'] as const;

  /**
   * Validate job log level parameter
   * @param level - The level to validate
   * @param toolName - Optional tool name for better error messages
   */
  static validateJobLogLevel(level: string, toolName?: string): void {
    if (!this.ALLOWED_LEVELS.includes(level as any)) {
      const errorPrefix = toolName ? `${toolName}: ` : '';
      throw new Error(
        `${errorPrefix}Invalid log level: ${level}. Must be one of: ${this.ALLOWED_LEVELS.join(', ')}`,
      );
    }
  }

  /**
   * Get default limit based on operation type
   * @param operationType - Type of operation ('search' | 'entries' | 'files')
   */
  static getDefaultLimit(operationType: 'search' | 'entries' | 'files'): number {
    switch (operationType) {
      case 'search':
        return 20;
      case 'entries':
        return 10;
      case 'files':
        return 10;
      default:
        return 10;
    }
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
