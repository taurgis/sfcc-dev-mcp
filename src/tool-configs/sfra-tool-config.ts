import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { SFRAClient } from '../clients/sfra-client.js';

export const SFRA_TOOL_NAMES = [
  'get_available_sfra_documents',
  'get_sfra_document',
  'search_sfra_documentation',
  'get_sfra_documents_by_category',
  'get_sfra_categories',
] as const;

export type SFRAToolName = typeof SFRA_TOOL_NAMES[number];
export const SFRA_TOOL_NAMES_SET = new Set<SFRAToolName>(SFRA_TOOL_NAMES);

/**
 * Configuration for SFRA documentation tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const SFRA_TOOL_CONFIG: Record<SFRAToolName, GenericToolSpec<ToolArguments, any>> = {
  get_available_sfra_documents: {
    defaults: (args: ToolArguments) => args,
    validate: (_args: ToolArguments, _toolName: string) => {
      // No validation needed for list operation
    },
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.sfraClient as SFRAClient;
      return client.getAvailableDocuments();
    },
    logMessage: (_args: ToolArguments) => 'List SFRA docs',
  },

  get_sfra_document: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('documentName'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.sfraClient as SFRAClient;
      const result = await client.getSFRADocument(args.documentName as string);
      if (!result) {
        throw new Error(`SFRA document "${args.documentName}" not found`);
      }
      return result;
    },
    logMessage: (args: ToolArguments) => `SFRA doc ${args.documentName}`,
  },

  search_sfra_documentation: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.sfraClient as SFRAClient;
      return client.searchSFRADocumentation(args.query as string);
    },
    logMessage: (args: ToolArguments) => `Search SFRA ${args.query}`,
  },

  get_sfra_documents_by_category: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('category'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.sfraClient as SFRAClient;
      return client.getDocumentsByCategory(args.category as string);
    },
    logMessage: (args: ToolArguments) => `SFRA docs by category ${args.category}`,
  },

  get_sfra_categories: {
    defaults: (args: ToolArguments) => args,
    validate: (_args: ToolArguments, _toolName: string) => {
      // No validation needed for list operation
    },
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.sfraClient as SFRAClient;
      return client.getAvailableCategories();
    },
    logMessage: (_args: ToolArguments) => 'SFRA categories',
  },
};
