/**
 * Best Practices Tool Schemas
 */

export const BEST_PRACTICES_TOOLS = [
  {
    name: 'get_available_best_practice_guides',
    description: 'Get a list of all available SFCC best practice and how-to guides. Use this first to discover what guidance is available before implementing any SFCC features. Essential for understanding what best practice resources exist for cartridge creation, hooks, controllers, and custom endpoints',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_best_practice_guide',
    description: 'Get a complete best practice and how-to guide with all sections and content. Use this when implementing specific SFCC features like cartridges, ISML templates, OCAPI/SCAPI hooks, SFRA controllers, or custom endpoints. Always consult the relevant guide before writing code to ensure you follow SFCC best practices, security guidelines, and proper architecture patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        guideName: {
          type: 'string',
          enum: ['cartridge_creation', 'isml_templates', 'job_framework', 'localserviceregistry', 'ocapi_hooks', 'scapi_hooks', 'sfra_controllers', 'sfra_models', 'sfra_client_side_js', 'sfra_scss', 'scapi_custom_endpoint', 'performance', 'security'],
          description: 'The guide name (e.g., \'cartridge_creation\', \'isml_templates\', \'job_framework\', \'localserviceregistry\', \'ocapi_hooks\', \'scapi_hooks\', \'sfra_controllers\', \'sfra_models\', \'sfra_client_side_js\', \'sfra_scss\', \'scapi_custom_endpoint\', \'performance\', \'security\')',
        },
      },
      required: ['guideName'],
    },
  },
  {
    name: 'search_best_practices',
    description: 'Search across all best practice guides for specific terms, patterns, or concepts. Use this when you need guidance on specific topics like validation, security, performance optimization, error handling, or any development pattern. Perfect for finding relevant best practices without reading entire guides.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "Search term or concept (e.g., 'validation', 'security', 'performance'). Use single words for best results as the API does not support complex queries.",
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_hook_reference',
    description: "Get comprehensive hook reference tables showing all available OCAPI or SCAPI hook endpoints and extension points. Use this when implementing hooks to see all available extension points, understand hook signatures, and ensure you're using the correct hook for your use case. Essential reference when extending SFCC APIs.",
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
