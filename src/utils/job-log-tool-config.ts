import { ToolSpec, LogToolValidators } from './log-tool-utils.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { JobLogToolName, getLimit } from './log-tool-constants.js';
import { JobLogValidators, JobLogFormatters } from './job-log-utils.js';

/**
 * Configuration for job log tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const JOB_LOG_TOOL_CONFIG: Record<JobLogToolName, ToolSpec> = {
  get_latest_job_log_files: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'jobFiles'),
    }),
    validate: (args, toolName) => LogToolValidators.validateLimit(args.limit as number, toolName),
    exec: async (args, client) => client.getLatestJobLogFiles(args.limit as number),
    logMessage: (args) => JobLogFormatters.formatJobLogMessage('Fetching latest job log files', {
      limit: args.limit as number,
    }),
  },

  search_job_logs_by_name: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'jobFiles'),
    }),
    validate: (args, toolName) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), toolName);
      LogToolValidators.validateLimit(args.limit as number, toolName);
    },
    exec: async (args, client) => client.searchJobLogsByName(args.jobName as string, args.limit as number),
    logMessage: (args) => JobLogFormatters.formatJobLogMessage('Searching job logs by name', {
      jobName: args.jobName as string,
      limit: args.limit as number,
    }),
  },

  get_job_log_entries: {
    defaults: (args) => ({
      level: args.level ?? 'all',
      limit: getLimit(args.limit as number, 'jobEntries'),
    }),
    validate: (args, toolName) => {
      JobLogValidators.validateJobLogLevel(args.level as string, toolName);
      LogToolValidators.validateLimit(args.limit as number, toolName);
    },
    exec: async (args, client) => client.getJobLogEntries(
      args.level as any,
      args.limit as number,
      args.jobName as string,
    ),
    logMessage: (args) => JobLogFormatters.formatJobLogMessage('Fetching job log entries', {
      level: args.level as string,
      limit: args.limit as number,
      jobName: args.jobName as string,
    }),
  },

  search_job_logs: {
    defaults: (args) => ({
      level: args.level ?? 'all',
      limit: getLimit(args.limit as number, 'jobSearch'),
    }),
    validate: (args, toolName) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), toolName);
      JobLogValidators.validateJobLogLevel(args.level as string, toolName);
      LogToolValidators.validateLimit(args.limit as number, toolName);
    },
    exec: async (args, client) => client.searchJobLogs(
      args.pattern as string,
      args.level as any,
      args.limit as number,
      args.jobName as string,
    ),
    logMessage: (args) => JobLogFormatters.formatJobLogMessage('Searching job logs', {
      pattern: args.pattern as string,
      level: args.level as string,
      limit: args.limit as number,
      jobName: args.jobName as string,
    }),
  },

  get_job_execution_summary: {
    validate: (args, toolName) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), toolName);
    },
    exec: async (args, client) => client.getJobExecutionSummary(args.jobName as string),
    logMessage: (args) => `Getting job execution summary for: ${args.jobName as string}`,
  },
};
