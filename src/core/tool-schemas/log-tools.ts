/**
 * Log Analysis Tool Schemas
 */

import { DATE_PARAM_SCHEMA, createLimitSchema } from './shared-schemas.js';

// Shared log level enum for consistency
const LOG_LEVEL_ENUM = ['error', 'warn', 'info', 'debug'] as const;
const JOB_LOG_LEVEL_ENUM = ['error', 'warn', 'info', 'debug', 'all'] as const;

/**
 * Factory for creating get_latest_* tool definitions
 * DRY: Eliminates repetition for error/warn/info/debug tools
 */
function createLatestLogToolSchema(level: string, description: string) {
  return {
    name: `get_latest_${level}`,
    description,
    inputSchema: {
      type: 'object',
      properties: {
        date: DATE_PARAM_SCHEMA,
        limit: createLimitSchema(20, `Max ${level} entries to return (default: 20)`),
      },
    },
  };
}

export const LOG_TOOLS = [
  createLatestLogToolSchema(
    'error',
    'Get latest SFCC error log entries. Use for debugging crashes, exceptions, API failures, or when code throws errors.',
  ),
  createLatestLogToolSchema(
    'warn',
    'Get latest warning messages. Use to identify deprecations, potential issues, or suboptimal configurations.',
  ),
  createLatestLogToolSchema(
    'info',
    'Get latest info messages. Use to verify operations completed, track business logic execution, or monitor normal flow.',
  ),
  createLatestLogToolSchema(
    'debug',
    'Get latest debug messages. Use for step-by-step tracing, variable inspection, or when error logs lack context.',
  ),
  {
    name: 'summarize_logs',
    description: 'Get a health overview of all log activity with counts and key issues. Use as first step when investigating problems or for daily health checks.',
    inputSchema: {
      type: 'object',
      properties: {
        date: DATE_PARAM_SCHEMA,
      },
    },
  },
  {
    name: 'search_logs',
    description: 'Search logs for specific patterns, error messages, order numbers, user IDs, or custom identifiers. Essential for tracking specific transactions.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Search pattern or keyword to find in logs',
        },
        logLevel: {
          type: 'string',
          enum: LOG_LEVEL_ENUM,
          description: 'Restrict search to specific log level for more focused results',
        },
        date: DATE_PARAM_SCHEMA,
        limit: createLimitSchema(20, 'Number of matching entries to return (default: 20)'),
      },
      required: ['pattern'],
    },
  },
  {
    name: 'list_log_files',
    description: 'List available log files with sizes and modification dates. Use to discover available log data or check log retention.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_log_file_contents',
    description: 'Read full contents of a specific log file. Use for detailed analysis when you need complete error traces or full context.',
    inputSchema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'Log filename or path. For standard logs: "error-blade-20240820-000000.log". For job logs: "jobs/JobName/Job-JobName-12345.log".',
        },
        maxBytes: {
          type: 'number',
          description: 'Maximum number of bytes to read from the file (default: 1MB). Use this to limit the amount of data returned for very large files.',
          default: 1048576,
        },
        tailOnly: {
          type: 'boolean',
          description: 'Whether to read only the tail (end) of the file instead of the full contents (default: false). Set to true for large files to get recent entries.',
          default: false,
        },
      },
      required: ['filename'],
    },
  },
];

export const JOB_LOG_TOOLS = [
  {
    name: 'get_latest_job_log_files',
    description: 'Get recent job log files from /Logs/jobs/. Job logs contain all log levels in single files. Use for debugging custom job steps.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: createLimitSchema(10, 'Number of job log files to return (default: 10)'),
      },
    },
  },
  {
    name: 'search_job_logs_by_name',
    description: 'Find job log files by job name (partial match supported). Use to locate logs for a specific job.',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'The job name to search for (partial matches supported)',
        },
        limit: createLimitSchema(10, 'Number of job log files to return (default: 10)'),
      },
      required: ['jobName'],
    },
  },
  {
    name: 'get_job_log_entries',
    description: 'Get job log entries by level (error/warn/info/debug/all). Unlike standard logs, job logs combine all levels in one file.',
    inputSchema: {
      type: 'object',
      properties: {
        level: {
          type: 'string',
          enum: JOB_LOG_LEVEL_ENUM,
          description: 'Log level to retrieve (default: all). Use "all" to see all log levels from job executions.',
          default: 'all',
        },
        limit: createLimitSchema(10, 'Number of job log entries to return (default: 10)'),
        jobName: {
          type: 'string',
          description: 'Optional job name to filter results to a specific job',
        },
      },
    },
  },
  {
    name: 'search_job_logs',
    description: 'Search job logs for patterns, error messages, or custom logging from job steps. Essential for debugging custom job code.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Search pattern or keyword to find in job logs',
        },
        level: {
          type: 'string',
          enum: JOB_LOG_LEVEL_ENUM,
          description: 'Restrict search to specific log level (default: all)',
          default: 'all',
        },
        limit: createLimitSchema(20, 'Number of matching entries to return (default: 20)'),
        jobName: {
          type: 'string',
          description: 'Optional job name to restrict search to a specific job',
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'get_job_execution_summary',
    description: 'Get execution summary for a job: timing, status, error counts, and step info. Use for monitoring job health and performance.',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'The job name to get execution summary for',
        },
      },
      required: ['jobName'],
    },
  },
];
