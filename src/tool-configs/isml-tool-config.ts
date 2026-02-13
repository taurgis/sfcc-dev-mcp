import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { ISMLClient } from '../clients/isml-client.js';

export const ISML_TOOL_NAMES = [
  'list_isml_elements',
  'get_isml_element',
  'search_isml_elements',
  'get_isml_elements_by_category',
  'get_isml_categories',
] as const;

export type ISMLToolName = typeof ISML_TOOL_NAMES[number];
export const ISML_TOOL_NAMES_SET = new Set<ISMLToolName>(ISML_TOOL_NAMES);

/**
 * Configuration for ISML documentation tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const ISML_TOOL_CONFIG: Record<ISMLToolName, GenericToolSpec<ToolArguments, any>> = {
  list_isml_elements: {
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ismlClient as ISMLClient;
      return client.getAvailableElements();
    },
    logMessage: (_args: ToolArguments) => 'List ISML elements',
  },

  get_isml_element: {
    defaults: (args: ToolArguments) => ({
      ...args,
      includeContent: args.includeContent ?? true,
      includeSections: args.includeSections ?? true,
      includeAttributes: args.includeAttributes ?? true,
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('elementName'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ismlClient as ISMLClient;
      const result = await client.getISMLElement(args.elementName as string, {
        includeContent: args.includeContent as boolean,
        includeSections: args.includeSections as boolean,
        includeAttributes: args.includeAttributes as boolean,
      });
      if (!result) {
        throw new Error(`ISML element "${args.elementName}" not found`);
      }
      return result;
    },
    logMessage: (args: ToolArguments) => `ISML element ${args.elementName}`,
  },

  search_isml_elements: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ismlClient as ISMLClient;
      return client.searchISMLElements(args.query as string, {
        category: args.category as string | undefined,
        limit: args.limit as number | undefined,
      });
    },
    logMessage: (args: ToolArguments) => `Search ISML ${args.query}`,
  },

  get_isml_elements_by_category: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('category'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ismlClient as ISMLClient;
      return client.getElementsByCategory(args.category as string);
    },
    logMessage: (args: ToolArguments) => `ISML elements by category ${args.category}`,
  },

  get_isml_categories: {
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ismlClient as ISMLClient;
      return client.getAvailableCategories();
    },
    logMessage: (_args: ToolArguments) => 'ISML categories',
  },
};
