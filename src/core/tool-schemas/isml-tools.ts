/**
 * ISML Documentation Tool Schemas
 */

export const ISML_DOCUMENTATION_TOOLS = [
  {
    name: 'list_isml_elements',
    description: 'List all ISML template elements with summaries. Includes control flow (isif, isloop), output (isprint), includes (isinclude, iscomponent), scripting (isscript), and caching (iscache).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_isml_element',
    description: 'Get detailed documentation for an ISML element including syntax, attributes, examples, and use cases.',
    inputSchema: {
      type: 'object',
      properties: {
        elementName: {
          type: 'string',
          minLength: 1,
          description: 'The ISML element name (e.g., \'isif\', \'isloop\', \'isprint\', \'isinclude\', \'iscomponent\'). The \'is\' prefix is optional.',
        },
        includeContent: {
          type: 'boolean',
          description: 'Whether to include full documentation content (default: true)',
          default: true,
        },
        includeSections: {
          type: 'boolean',
          description: 'Whether to include section headings (default: true)',
          default: true,
        },
        includeAttributes: {
          type: 'boolean',
          description: 'Whether to include attribute information (default: true)',
          default: true,
        },
      },
      required: ['elementName'],
    },
  },
  {
    name: 'search_isml_elements',
    description: 'Search ISML elements by purpose, attribute name, or use case. Returns relevance-scored results with preview snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          minLength: 1,
          description: 'Search term or concept (e.g., \'loop\', \'conditional\', \'format\', \'cache\', \'redirect\')',
        },
        category: {
          type: 'string',
          description: 'Optional category filter: control-flow, output, includes, scripting, cache, decorators, special, payment, or analytics',
          enum: ['control-flow', 'output', 'includes', 'scripting', 'cache', 'decorators', 'special', 'payment', 'analytics'],
        },
        limit: {
          type: 'integer',
          minimum: 1,
          description: 'Maximum number of results to return',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_isml_elements_by_category',
    description: 'Get ISML elements filtered by category (control-flow, output, includes, scripting, cache, decorators, special, payment, analytics).',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Category to filter by: control-flow (conditionals, loops), output (formatting), includes (templates, components), scripting (server-side code), cache (caching), decorators (layout), special (redirect, status), payment (payment elements), analytics (tracking)',
          enum: ['control-flow', 'output', 'includes', 'scripting', 'cache', 'decorators', 'special', 'payment', 'analytics'],
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_isml_categories',
    description: 'Get all ISML element categories with descriptions and counts.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
