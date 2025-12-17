/**
 * ISML Documentation Tool Schemas
 */

export const ISML_DOCUMENTATION_TOOLS = [
  {
    name: 'list_isml_elements',
    description: 'Get a list of all available ISML (Internet Store Markup Language) elements with summaries. Use this to discover what ISML elements are available for template development including control flow (isif, isloop), output formatting (isprint), includes (isinclude, iscomponent), scripting (isscript, isset), caching (iscache), and special elements.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_isml_element',
    description: 'Get detailed documentation for a specific ISML element including syntax, attributes, examples, and use cases. Use this when implementing ISML templates and need to understand element usage, required/optional attributes, formatting options, or best practices for elements like isif, isloop, isprint, isinclude, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        elementName: {
          type: 'string',
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
    description: 'Search across ISML element documentation for specific terms, functionality, or patterns. Use this when you need to find elements by purpose (e.g., \'loop\', \'conditional\', \'cache\'), by attribute name, or by use case. Returns results with relevance scoring and preview snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term or concept (e.g., \'loop\', \'conditional\', \'format\', \'cache\', \'redirect\')',
        },
        category: {
          type: 'string',
          description: 'Optional category filter: control-flow, output, includes, scripting, cache, decorators, special, payment, or analytics',
          enum: ['control-flow', 'output', 'includes', 'scripting', 'cache', 'decorators', 'special', 'payment', 'analytics'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_isml_elements_by_category',
    description: 'Get all ISML elements filtered by category. Use this to explore elements grouped by functionality such as control flow elements (isif, isloop), output elements (isprint), includes/components (isinclude, iscomponent, isslot), scripting (isscript, isset), or special elements.',
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
    description: 'Get all available ISML element categories with descriptions and element counts. Use this to understand the organization of ISML elements and discover what types of functionality are available for template development.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
