import { GenericToolSpec, ToolExecutionContext, ToolArguments } from '../core/handlers/base-handler.js';
import {
  ValidationHelpers,
  CommonValidations,
  validateLogLevel,
  validateLimit,
  formatLogMessage,
} from '../core/handlers/validation-helpers.js';
import { JobLogToolName, getLimit } from '../utils/log-tool-constants.js';
import { SFCCLogClient } from '../clients/log-client.js';

/**
 * Configuration for job log tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const JOB_LOG_TOOL_CONFIG: Record<JobLogToolName, GenericToolSpec<ToolArguments, any>> = {
  get_latest_job_log_files: {
    defaults: (args: ToolArguments) => ({
      limit: getLimit(args.limit as number, 'jobFiles'),
    }),
    validate: (args: ToolArguments, toolName: string) =>
      validateLimit(args.limit as number, toolName),
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.getLatestJobLogFiles(args.limit as number);
    },
    logMessage: (args: ToolArguments) => formatLogMessage('Fetching latest job log files', {
      limit: args.limit as number,
    }),
  },

  search_job_logs_by_name: {
    defaults: (args: ToolArguments) => ({
      limit: getLimit(args.limit as number, 'jobFiles'),
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), toolName);
      validateLimit(args.limit as number, toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.searchJobLogsByName(args.jobName as string, args.limit as number);
    },
    logMessage: (args: ToolArguments) => formatLogMessage('Searching job logs by name', {
      jobName: args.jobName as string,
      limit: args.limit as number,
    }),
  },

  get_job_log_entries: {
    defaults: (args: ToolArguments) => ({
      level: args.level ?? 'all',
      limit: getLimit(args.limit as number, 'jobEntries'),
    }),
    validate: (args: ToolArguments, toolName: string) => {
      validateLogLevel(args.level as string, toolName);
      validateLimit(args.limit as number, toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.getJobLogEntries(
        args.level as any,
        args.limit as number,
        args.jobName as string,
      );
    },
    logMessage: (args: ToolArguments) => formatLogMessage('Fetching job log entries', {
      level: args.level as string,
      limit: args.limit as number,
      jobName: args.jobName as string,
    }),
  },

  search_job_logs: {
    defaults: (args: ToolArguments) => ({
      level: args.level ?? 'all',
      limit: getLimit(args.limit as number, 'jobSearch'),
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), toolName);
      validateLogLevel(args.level as string, toolName);
      validateLimit(args.limit as number, toolName);
      if (args.jobName !== undefined) {
        ValidationHelpers.validateArguments(args, CommonValidations.optionalField(
          'jobName',
          'string',
          (value: string) => typeof value === 'string' && value.trim().length > 0,
          'jobName must be a non-empty string',
        ), toolName);
      }
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.searchJobLogs(
        args.pattern as string,
        args.level as any,
        args.limit as number,
        args.jobName as string,
      );
    },
    logMessage: (args: ToolArguments) => formatLogMessage('Searching job logs', {
      pattern: args.pattern as string,
      level: args.level as string,
      limit: args.limit as number,
      jobName: args.jobName as string,
    }),
  },

  get_job_execution_summary: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.getJobExecutionSummary(args.jobName as string);
    },
    logMessage: (args: ToolArguments) => `Getting job execution summary for: ${args.jobName as string}`,
  },
};
