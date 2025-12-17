import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { SFCCBestPracticesClient } from '../clients/best-practices-client.js';

export const BEST_PRACTICE_TOOL_NAMES = [
  'get_available_best_practice_guides',
  'get_best_practice_guide',
  'search_best_practices',
  'get_hook_reference',
] as const;

export type BestPracticeToolName = typeof BEST_PRACTICE_TOOL_NAMES[number];
export const BEST_PRACTICE_TOOL_NAMES_SET = new Set<BestPracticeToolName>(BEST_PRACTICE_TOOL_NAMES);

/**
 * Configuration for SFCC best practices tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const BEST_PRACTICES_TOOL_CONFIG: Record<BestPracticeToolName, GenericToolSpec<ToolArguments, any>> = {
  get_available_best_practice_guides: {
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.bestPracticesClient as SFCCBestPracticesClient;
      return client.getAvailableGuides();
    },
    logMessage: (_args: ToolArguments) => 'List guides',
  },

  get_best_practice_guide: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('guideName'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.bestPracticesClient as SFCCBestPracticesClient;
      return client.getBestPracticeGuide(args.guideName as string);
    },
    logMessage: (args: ToolArguments) => `Guide ${args.guideName}`,
  },

  search_best_practices: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.bestPracticesClient as SFCCBestPracticesClient;
      return client.searchBestPractices(args.query as string);
    },
    logMessage: (args: ToolArguments) => `Search best practices ${args.query}`,
  },

  get_hook_reference: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('guideName'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.bestPracticesClient as SFCCBestPracticesClient;
      return client.getHookReference(args.guideName as string);
    },
    logMessage: (args: ToolArguments) => `Hook reference ${args.guideName}`,
  },
};
