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
        limit: createLimitSchema(20, `Number of ${level} entries to return (default: 20)`),
      },
    },
  };
}

export const LOG_TOOLS = [
  createLatestLogToolSchema(
    'error',
    'Get the latest error messages from SFCC logs. Use this when debugging failed operations, investigating crashes, exceptions, or when code is not working as expected. Essential for troubleshooting critical issues, API failures, database connection problems, or when users report bugs. Errors indicate something went wrong and needs immediate attention.',
  ),
  createLatestLogToolSchema(
    'warn',
    'Get the latest warning messages from SFCC logs. Use this to identify potential issues, deprecated features being used, performance concerns, or configurations that might cause problems later. Warnings help prevent future errors and optimize code quality. Check warnings when code works but performance is slow or when preparing for production deployment.',
  ),
  createLatestLogToolSchema(
    'info',
    'Get the latest info messages from SFCC logs. Use this to understand application flow, verify that operations completed successfully, track business logic execution, or monitor normal system behavior. Info logs help confirm that features are working correctly and provide context about what the system is doing during normal operation.',
  ),
  createLatestLogToolSchema(
    'debug',
    "Get the latest debug messages from SFCC logs. Use this for detailed troubleshooting when you need to trace code execution step-by-step, inspect variable values, understand complex business logic flow, or investigate subtle bugs. Debug logs provide the most detailed information and are essential when standard error logs don't provide enough context to solve the problem.",
  ),
  {
    name: 'summarize_logs',
    description: 'Get a comprehensive overview of all log activity with counts and key issues for a specific date. Use this as the first step when investigating problems to quickly understand the overall health of the system, identify the most frequent errors, and get a high-level view before diving into specific log types. Perfect for daily health checks, incident response, or when you need to quickly assess if there are any major issues.',
    inputSchema: {
      type: 'object',
      properties: {
        date: DATE_PARAM_SCHEMA,
      },
    },
  },
  {
    name: 'search_logs',
    description: "Search for specific patterns, keywords, or error messages across SFCC logs. Use this when you know what you're looking for - specific error messages, function names, API calls, user IDs, order numbers, or any custom identifiers. Essential for tracking down specific issues, following a transaction through the system, or finding all instances of a particular problem pattern.",
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
    description: 'List all available log files with metadata including sizes and modification dates. Use this to understand what log data is available, check if logs are being generated properly, or when you need to investigate issues from specific time periods. Helpful for determining log retention and identifying the best date range for investigation.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_log_file_contents',
    description: 'Get the complete contents of a specific log file. Use this when you need to read the full content of a specific log file identified by the list_log_files tool or job log files from get_latest_job_log_files. Essential for detailed analysis of specific log files, reading complete error traces, or when you need the full context of a log file rather than just recent entries.',
    inputSchema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'The complete filename or path of the log file to read. For standard logs, use just the filename (e.g., "error-blade-20240820-000000.log"). For job logs, use the full path as returned by get_latest_job_log_files (e.g., "jobs/JobName/Job-JobName-12345.log")',
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
    description: 'Get the latest job log files from the SFCC jobs folder. Use this to discover recent job executions, identify available job logs, and understand which jobs have run recently. Job logs are stored in a deeper folder structure (/Logs/jobs/[job name ID]/Job-*.log) and contain all log levels (error, warn, info, debug) in single files. Essential for debugging custom job steps and monitoring job execution.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: createLimitSchema(10, 'Number of job log files to return (default: 10)'),
      },
    },
  },
  {
    name: 'search_job_logs_by_name',
    description: 'Search for job log files by job name. Use this when you want to find logs for a specific job to debug custom job steps or understand job execution patterns. Job names are typically the system ID or custom-configured names for jobs.',
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
    description: 'Get job log entries for a specific log level or all levels from recent job executions. Unlike standard logs, job logs contain all log levels in one file, making this tool perfect for debugging custom job code. Use this to see what happened during job execution, track errors in job steps, or monitor job performance.',
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
    description: 'Search for specific patterns, error messages, or keywords within job logs. Use this when debugging specific job issues, looking for custom logging messages in your job steps, tracking job variables, or finding specific execution patterns. Essential for troubleshooting custom job code.',
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
    description: 'Get a comprehensive execution summary for a specific job including timing, status, error counts, and step information. Use this to understand job performance, identify bottlenecks, check execution status, or get an overview of what happened during job execution. Perfect for monitoring job health and debugging job step issues.',
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
