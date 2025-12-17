/**
 * System Object Tool Schemas
 */

import { createSearchRequestSchema } from './shared-schemas.js';

export const SYSTEM_OBJECT_TOOLS = [
  {
    name: 'get_system_object_definitions',
    description: 'Get all system object definitions from SFCC with their main metadata, not including attributes. Use this to discover what system objects are available in the SFCC instance, understand the basic data model, or when you need to see all objects at once. Essential for understanding the complete SFCC data structure and identifying objects. You can also discover which objects are "Custom Objects" by looking at the _type field in the response.',
    inputSchema: {
      type: 'object',
      properties: {
        start: {
          type: 'number',
          description: 'Optional start index for retrieving items from a given index (default: 0)',
          default: 0,
        },
        count: {
          type: 'number',
          description: 'Optional count for retrieving only a subset of items (default: 200)',
          default: 200,
        },
        select: {
          type: 'string',
          description: "Property selector using OCAPI select syntax. Controls which fields are returned in the response. Examples: '(**)' for all properties, '(start, total)' for pagination info only, '(data.(object_type))' for only object_type in data array, '(data.(object_type, display_name))' for specific fields in data array, '(start, data.(**))' for pagination info plus all data properties. Use parentheses to group field selections and dot notation to traverse object hierarchies.",
          default: '(**)',
        },
      },
    },
  },
  {
    name: 'get_system_object_definition',
    description: 'Get basic metadata about a specific SFCC system object definition including counts and configuration flags. Returns information like attribute count, group count, display name, creation date, and object type flags (content_object, queryable, read_only). Use this when you need to understand the basic structure and configuration of system objects like Product, Customer, Order, Category, or Site. For detailed attribute information, use get_system_object_attribute_definitions instead. You can not fetch "Custom Objects" with this API.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: "The system object type (e.g., 'Product', 'Customer', 'Order', 'Category', 'Site')",
        },
      },
      required: ['objectType'],
    },
  },
  {
    name: 'search_system_object_attribute_definitions',
    description: 'Search for specific attribute definitions within a system object type using complex queries. Use this when you need to find attributes by name, type, or other properties rather than retrieving all attributes. Supports text search on id/display_name/description, filtering by properties like mandatory/searchable/system, and sorting. Essential for finding custom attributes or attributes with specific characteristics. To get all attributes, use a match_all_query.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: "The system object type to search within (e.g., 'Product', 'Customer', 'Order', 'Category', 'Site')",
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute definitions'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
  {
    name: 'search_site_preferences',
    description: 'Search site preferences across sites in the specified preference group and instance. Use this to find specific site preferences by name, description, or value type. Essential for discovering custom site preferences, understanding preference configurations, or when working with site-specific settings. Use this tool when generating or debugging code that accesses site preferences (e.g., dw.system.Site.current.preferences.custom.yourPreference, Site.getCurrent().getCustomPreferenceValue()) to validate preference names, understand their data types, discover available preferences in a group, or troubleshoot preference-related issues. Supports complex queries with text search, filtering, and sorting.',
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
    description: 'Search attribute groups for a specific system object type. Use this to discover available attribute groups, which is essential for finding site preference groups (use "SitePreferences" as objectType) needed for the site preferences search API. Supports complex queries with text search, filtering, and sorting on group properties.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: 'The system object type to search attribute groups for (e.g., "Product", "Customer", "SitePreferences")',
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute groups'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
  {
    name: 'search_custom_object_attribute_definitions',
    description: 'Search for specific attribute definitions within a custom object type using complex queries. Use this when you need to find attributes by name, type, or other properties for custom objects rather than system objects. Supports text search on id/display_name/description, filtering by properties like mandatory/searchable/system, and sorting. Essential for finding custom attributes or attributes with specific characteristics in custom object definitions. Custom objects are user-defined data structures that extend SFCC functionality.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: "The custom object type to search within (e.g., 'Global_String', 'MyCustomObject')",
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute definitions'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
];
