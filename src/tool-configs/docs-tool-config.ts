import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { SFCCDocumentationClient } from '../clients/docs-client.js';

export const DOC_TOOL_NAMES = [
  'get_sfcc_class_info',
  'search_sfcc_classes',
  'search_sfcc_methods',
  'list_sfcc_classes',
  'get_sfcc_class_documentation',
] as const;

export type DocToolName = typeof DOC_TOOL_NAMES[number];
export const DOC_TOOL_NAMES_SET = new Set<DocToolName>(DOC_TOOL_NAMES);

/**
 * Configuration for SFCC documentation tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const DOCS_TOOL_CONFIG: Record<DocToolName, GenericToolSpec<ToolArguments, any>> = {
  get_sfcc_class_info: {
    defaults: (args: ToolArguments) => ({
      ...args,
      expand: args.expand ?? false,
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('className'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.docsClient as SFCCDocumentationClient;
      const result = await client.getClassDetailsExpanded(args.className as string, args.expand as boolean);
      if (!result) {
        throw new Error(`Class "${args.className}" not found`);
      }
      return result;
    },
    logMessage: (args: ToolArguments) =>
      `Class info ${args.className} expand=${args.expand ?? false}`,
  },

  search_sfcc_classes: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.docsClient as SFCCDocumentationClient;
      return client.searchClasses(args.query as string);
    },
    logMessage: (args: ToolArguments) => `Search classes ${args.query}`,
  },

  search_sfcc_methods: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('methodName'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.docsClient as SFCCDocumentationClient;
      return client.searchMethods(args.methodName as string);
    },
    logMessage: (args: ToolArguments) => `Search methods ${args.methodName}`,
  },

  list_sfcc_classes: {
    defaults: (args: ToolArguments) => args,
    validate: (_args: ToolArguments, _toolName: string) => {
      // No validation needed for list operation
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.docsClient as SFCCDocumentationClient;
      return client.getAvailableClasses();
    },
    logMessage: (_args: ToolArguments) => 'List classes',
  },

  get_sfcc_class_documentation: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('className'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.docsClient as SFCCDocumentationClient;
      const result = await client.getClassDocumentation(args.className as string);
      if (!result) {
        throw new Error(`Documentation for class "${args.className}" not found`);
      }
      return result;
    },
    logMessage: (args: ToolArguments) => `Raw doc ${args.className}`,
  },
};
