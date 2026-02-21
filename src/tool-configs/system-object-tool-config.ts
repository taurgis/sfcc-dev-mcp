import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { OCAPIClient } from '../clients/ocapi-client.js';
import { OCAPISearchRequest, SitePreferencesSearchOptions } from '../types/ocapi-search.js';

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

interface ObjectTypeArgs extends ToolArguments {
  objectType: string;
}

interface SystemObjectDefinitionsArgs extends ToolArguments {
  start?: number;
  count?: number;
  select?: string;
}

interface ObjectSearchArgs extends ObjectTypeArgs {
  searchRequest: OCAPISearchRequest;
}

interface SitePreferenceSearchArgs extends ToolArguments {
  groupId: string;
  instanceType: string;
  searchRequest: OCAPISearchRequest;
  options?: SitePreferencesSearchOptions;
}

/**
 * Configuration for system object tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const SYSTEM_OBJECT_TOOL_CONFIG: Record<SystemObjectToolName, GenericToolSpec<ToolArguments, unknown>> = {
  get_system_object_definitions: {
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      const typedArgs = args as SystemObjectDefinitionsArgs;
      // Pass pagination parameters to the client
      const params = {
        start: typedArgs.start,
        count: typedArgs.count,
        select: typedArgs.select,
      };
      // Remove undefined values to avoid sending them
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });
      return client.systemObjects.getSystemObjectDefinitions(Object.keys(params).length > 0 ? params : undefined);
    },
    logMessage: (args: ToolArguments) => `Get system object definitions (start: ${args?.start ?? 0}, count: ${args?.count ?? 200})`,
  },

  get_system_object_definition: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.ocapiClient as OCAPIClient;
      const { objectType } = args as ObjectTypeArgs;
      return client.systemObjects.getSystemObjectDefinition(objectType);
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
      const { objectType, searchRequest } = args as ObjectSearchArgs;
      return client.systemObjects.searchSystemObjectAttributeDefinitions(
        objectType,
        searchRequest,
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
      const { objectType, searchRequest } = args as ObjectSearchArgs;
      return client.systemObjects.searchCustomObjectAttributeDefinitions(
        objectType,
        searchRequest,
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
      const { groupId, instanceType, searchRequest, options } = args as SitePreferenceSearchArgs;
      return client.sitePreferences.searchSitePreferences(
        groupId,
        instanceType,
        searchRequest,
        options,
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
      const { objectType, searchRequest } = args as ObjectSearchArgs;
      return client.systemObjects.searchSystemObjectAttributeGroups(
        objectType,
        searchRequest,
      );
    },
    logMessage: (args: ToolArguments) => `Search attribute groups for ${args?.objectType}`,
  },
};
