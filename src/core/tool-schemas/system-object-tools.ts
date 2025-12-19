/**
 * System Object Tool Schemas
 */

import { createSearchRequestSchema } from './shared-schemas.js';

export const SYSTEM_OBJECT_TOOLS = [
  {
    name: 'get_system_object_definitions',
    description: 'Get all system object definitions with metadata (not attributes). Use to discover available objects and identify Custom Objects via the _type field.',
    inputSchema: {
      type: 'object',
      properties: {
        start: {
          type: 'number',
          description: 'Start index for pagination (default: 0)',
          default: 0,
        },
        count: {
          type: 'number',
          description: 'Number of items to return (default: 200)',
          default: 200,
        },
        select: {
          type: 'string',
          description: 'OCAPI field selector. Examples: "(**)" for all, "(data.(object_type, display_name))" for specific fields.',
          default: '(**)',
        },
      },
    },
  },
  {
    name: 'get_system_object_definition',
    description: 'Get metadata for a specific system object (attribute count, group count, flags). For attribute details, use search_system_object_attribute_definitions. Does not work for Custom Objects.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: 'System object type, e.g., "Product", "Customer", "Order", "Category".',
        },
      },
      required: ['objectType'],
    },
  },
  {
    name: 'search_system_object_attribute_definitions',
    description: 'Search attribute definitions within a system object. Supports text search, filtering by mandatory/searchable/system, and sorting. Use match_all_query to get all attributes.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: 'System object type, e.g., "Product", "Customer", "Order".',
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute definitions'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
  {
    name: 'search_site_preferences',
    description: 'Search site preferences by name, description, or type. Use to validate preference names and types when working with Site.getCurrent().getCustomPreferenceValue() or dw.system.Site.current.preferences.custom.*.',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: {
          type: 'string',
          description: 'The ID of the preference group to search within',
        },
        instanceType: {
          type: 'string',
          enum: ['staging', 'development', 'sandbox', 'production'],
          description: 'The instance type to search preferences for. Since this MCP server is aimed at development and testing, the default is "sandbox".',
          default: 'sandbox',
        },
        searchRequest: createSearchRequestSchema('Query to filter site preferences'),
        options: {
          type: 'object',
          description: 'Additional options for the search',
          properties: {
            maskPasswords: {
              type: 'boolean',
              description: 'Whether to mask password type preference values (default: true)',
              default: true,
            },
            expand: {
              type: 'string',
              description: 'Expand options (use "value" to retrieve value definitions)',
            },
          },
        },
      },
      required: ['groupId', 'instanceType', 'searchRequest'],
    },
  },
  {
    name: 'search_system_object_attribute_groups',
    description: 'Search attribute groups for a system object. Use "SitePreferences" as objectType to find preference groups needed for the site preferences API.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: 'System object type, e.g., "Product", "Customer", "SitePreferences".',
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute groups'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
  {
    name: 'search_custom_object_attribute_definitions',
    description: 'Search attribute definitions within a custom object type (user-defined objects, not system objects). Supports text search, filtering, and sorting.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: 'Custom object type, e.g., "Global_String", "MyCustomObject".',
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute definitions'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
];
