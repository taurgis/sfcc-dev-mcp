import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { OCAPIClient } from '../clients/ocapi-client.js';

export const SYSTEM_OBJECT_TOOL_NAMES = [
  'get_system_object_definitions',
  'get_system_object_definition',
  'search_system_object_attribute_definitions',
  'search_custom_object_attribute_definitions',
  'search_site_preferences',
  'search_system_object_attribute_groups',
] as const;

export type SystemObjectToolName = typeof SYSTEM_OBJECT_TOOL_NAMES[number];
export const SYSTEM_OBJECT_TOOL_NAMES_SET = new Set<SystemObjectToolName>(SYSTEM_OBJECT_TOOL_NAMES);

/**
 * Configuration for system object tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const SYSTEM_OBJECT_TOOL_CONFIG: Record<SystemObjectToolName, GenericToolSpec<ToolArguments, any>> = {
  get_system_object_definitions: {
    defaults: (args: ToolArguments) => args,
    validate: (_args: ToolArguments, _toolName: string) => {
      // No validation needed for list operation
    },
    exec: async (_args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      return client.systemObjects.getSystemObjectDefinitions();
    },
    logMessage: (_args: ToolArguments) => 'Get system object definitions',
  },

  get_system_object_definition: {
    defaults: (args: ToolArguments) => args,
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      return client.systemObjects.getSystemObjectDefinition(args.objectType as string);
    },
    logMessage: (args: ToolArguments) => `Get system object definition for ${args?.objectType}`,
  },

  search_system_object_attribute_definitions: {
    defaults: (args: ToolArguments) => ({
      ...args,
      searchRequest: args.searchRequest ?? {
        query: { match_all_query: {} },
        select: '(**)',
        count: 200,
      },
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      return client.systemObjects.searchSystemObjectAttributeDefinitions(
        args.objectType as string,
        args.searchRequest as any,
      );
    },
    logMessage: (args: ToolArguments) => `Search system object attributes for ${args?.objectType}`,
  },

  search_custom_object_attribute_definitions: {
    defaults: (args: ToolArguments) => ({
      ...args,
      searchRequest: args.searchRequest ?? {
        query: { match_all_query: {} },
        count: 200,
      },
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      return client.systemObjects.searchCustomObjectAttributeDefinitions(
        args.objectType as string,
        args.searchRequest as any,
      );
    },
    logMessage: (args: ToolArguments) => `Search custom object attributes for ${args?.objectType}`,
  },

  search_site_preferences: {
    defaults: (args: ToolArguments) => ({
      ...args,
      instanceType: args.instanceType ?? 'sandbox',
      searchRequest: args.searchRequest ?? {
        query: { match_all_query: {} },
        count: 200,
      },
      options: args.options ?? { expand: 'value' },
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('groupId'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      return client.sitePreferences.searchSitePreferences(
        args.groupId as string,
        args.instanceType as string,
        args.searchRequest as any,
        args.options as any,
      );
    },
    logMessage: (args: ToolArguments) => `Search site preferences group ${args?.groupId}`,
  },

  search_system_object_attribute_groups: {
    defaults: (args: ToolArguments) => ({
      ...args,
      searchRequest: args.searchRequest ?? {
        query: { match_all_query: {} },
        count: 200,
      },
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      return client.systemObjects.searchSystemObjectAttributeGroups(
        args.objectType as string,
        args.searchRequest as any,
      );
    },
    logMessage: (args: ToolArguments) => `Search attribute groups for ${args?.objectType}`,
  },
};
