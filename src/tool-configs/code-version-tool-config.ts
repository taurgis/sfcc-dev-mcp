import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { OCAPICodeVersionsClient } from '../clients/ocapi/code-versions-client.js';

export const CODE_VERSION_TOOL_NAMES = [
  'get_code_versions',
  'activate_code_version',
] as const;

export type CodeVersionToolName = typeof CODE_VERSION_TOOL_NAMES[number];
export const CODE_VERSION_TOOL_NAMES_SET = new Set<CodeVersionToolName>(CODE_VERSION_TOOL_NAMES);

/**
 * Configuration for code version tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const CODE_VERSION_TOOL_CONFIG: Record<CodeVersionToolName, GenericToolSpec<ToolArguments, any>> = {
  get_code_versions: {
    defaults: (args: ToolArguments) => args,
    validate: (_args: ToolArguments, _toolName: string) => {
      // No validation needed for list operation
    },
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.codeVersionsClient as OCAPICodeVersionsClient;
      return client.getCodeVersions();
    },
    logMessage: (_args: ToolArguments) => 'Get code versions',
  },

  activate_code_version: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('codeVersionId'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.codeVersionsClient as OCAPICodeVersionsClient;
      return client.activateCodeVersion(args.codeVersionId as string);
    },
    logMessage: (args: ToolArguments) => `Activate code version ${args?.codeVersionId}`,
  },
};
