/**
 * Best Practices Tool Schemas
 */

export const BEST_PRACTICES_TOOLS = [
  {
    name: 'get_available_best_practice_guides',
    description: 'List all SFCC best practice guides. Use first to discover available guidance for cartridges, hooks, controllers, jobs, security, and performance.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_best_practice_guide',
    description: 'Get a complete best practice guide with examples and patterns. Always consult before implementing cartridges, ISML, hooks, controllers, jobs, or custom endpoints.',
    inputSchema: {
      type: 'object',
      properties: {
        guideName: {
          type: 'string',
          enum: ['cartridge_creation', 'isml_templates', 'job_framework', 'localserviceregistry', 'ocapi_hooks', 'scapi_hooks', 'sfra_controllers', 'sfra_models', 'sfra_client_side_js', 'sfra_scss', 'scapi_custom_endpoint', 'performance', 'security'],
          description: 'Guide identifier (see enum for available guides)',
        },
      },
      required: ['guideName'],
    },
  },
  {
    name: 'search_best_practices',
    description: 'Search across all guides for specific patterns or concepts. Use single keywords like "validation", "security", "caching", "error".',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Single keyword to search, e.g., "validation", "authentication", "cache".',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_hook_reference',
    description: 'Get hook reference tables showing all OCAPI or SCAPI extension points, signatures, and parameters. Essential when implementing hooks.',
    inputSchema: {
      type: 'object',
      properties: {
        guideName: {
          type: 'string',
          description: 'The hook guide name',
          enum: ['ocapi_hooks', 'scapi_hooks'],
        },
      },
      required: ['guideName'],
    },
  },
];
