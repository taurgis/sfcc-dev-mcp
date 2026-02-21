/**
 * Shared MCP Tool Schema Components
 *
 * Reusable schema definitions for MCP tool definitions.
 * DRY: These are used across multiple tool categories.
 */

/**
 * Common query schema for OCAPI search operations
 */
export const QUERY_SCHEMA = {
  type: 'object',
  description: 'Query to filter results',
  properties: {
    text_query: {
      type: 'object',
      description: 'Search for text in specific fields',
      properties: {
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to search in (e.g., ["id", "display_name", "description"])',
        },
        search_phrase: {
          type: 'string',
          minLength: 1,
          description: 'Text to search for',
        },
      },
      required: ['fields', 'search_phrase'],
    },
    term_query: {
      type: 'object',
      description: 'Search for exact term matches',
      properties: {
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to search in',
        },
        operator: {
          type: 'string',
          minLength: 1,
          description: 'Query operator (e.g., "is", "one_of")',
        },
        values: {
          type: 'array',
          items: { type: 'string' },
          description: 'Values to match',
        },
      },
      required: ['fields', 'operator', 'values'],
    },
    bool_query: {
      type: 'object',
      description: 'Combine multiple queries with boolean logic',
      properties: {
        must: {
          type: 'array',
          items: { type: 'object' },
          description: 'Queries that must match (AND)',
        },
        must_not: {
          type: 'array',
          items: { type: 'object' },
          description: 'Queries that must not match',
        },
        should: {
          type: 'array',
          items: { type: 'object' },
          description: 'Queries that should match (OR)',
        },
      },
    },
    match_all_query: {
      type: 'object',
      description: 'Match all documents - useful when you want all results or to filter with sorts/pagination only.',
      properties: {},
    },
  },
} as const;

/**
 * Common sorts schema for OCAPI search operations
 */
export const SORTS_SCHEMA = {
  type: 'array',
  description: 'Sort criteria',
  items: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        description: 'Field to sort by',
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Sort order (default: asc)',
      },
    },
    required: ['field'],
  },
} as const;

/**
 * Common pagination schema for OCAPI search operations
 */
export const PAGINATION_SCHEMA = {
  start: {
    type: 'integer',
    description: 'Start index for pagination (default: 0)',
    default: 0,
    minimum: 0,
  },
  count: {
    type: 'integer',
    description: 'Number of results to return (default: 200)',
    default: 200,
    minimum: 1,
    maximum: 1000,
  },
  select: {
    type: 'string',
    minLength: 1,
    description: "Property selector (e.g., '(**)' for all properties)",
  },
} as const;

/**
 * Factory to create search request schema with optional description override
 */
export function createSearchRequestSchema(queryDescription?: string) {
  return {
    type: 'object',
    description: 'The search request with query, sorting, and pagination options',
    properties: {
      query: queryDescription
        ? { ...QUERY_SCHEMA, description: queryDescription }
        : QUERY_SCHEMA,
      sorts: SORTS_SCHEMA,
      ...PAGINATION_SCHEMA,
    },
  };
}

/**
 * Common date parameter schema
 */
export const DATE_PARAM_SCHEMA = {
  type: 'string',
  description: 'Date in YYYYMMDD format (default: today)',
  pattern: '^\\d{8}$',
} as const;

/**
 * Common limit parameter schema
 */
export function createLimitSchema(defaultValue: number, description?: string) {
  return {
    type: 'integer',
    description: description ?? `Number of entries to return (default: ${defaultValue})`,
    default: defaultValue,
    minimum: 1,
    maximum: 1000,
  };
}
