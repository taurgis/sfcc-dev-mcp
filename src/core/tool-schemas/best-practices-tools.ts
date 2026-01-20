/**
 * Best Practices Tool Schemas
 *
 * DEPRECATED: These tools have been replaced by GitHub Copilot Agent Skills.
 * They now return deprecation notices pointing users to the new skill-based approach.
 */

export const BEST_PRACTICES_TOOLS = [
  {
    name: 'get_available_best_practice_guides',
    description: '[DEPRECATED] Use GitHub Copilot Agent Skills instead. Copy skills from ai-instructions/skills/ to your project. This tool now returns a deprecation notice.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_best_practice_guide',
    description: '[DEPRECATED] Use GitHub Copilot Agent Skills instead. The best practices are now available as skill files (e.g., sfcc-cartridge-development, sfcc-sfra-controllers). This tool now returns a deprecation notice.',
    inputSchema: {
      type: 'object',
      properties: {
        guideName: {
          type: 'string',
          enum: ['cartridge_creation', 'isml_templates', 'job_framework', 'localserviceregistry', 'ocapi_hooks', 'scapi_hooks', 'sfra_controllers', 'sfra_models', 'sfra_client_side_js', 'sfra_scss', 'scapi_custom_endpoint', 'performance', 'security'],
          description: '[DEPRECATED] Guide identifier - use Agent Skills instead',
        },
      },
      required: ['guideName'],
    },
  },
  {
    name: 'search_best_practices',
    description: '[DEPRECATED] Use GitHub Copilot Agent Skills instead. Skills are automatically loaded based on context. This tool now returns a deprecation notice.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '[DEPRECATED] Search query - use Agent Skills instead',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_hook_reference',
    description: '[DEPRECATED] Use sfcc-ocapi-hooks or sfcc-scapi-hooks Agent Skills instead. This tool now returns a deprecation notice.',
    inputSchema: {
      type: 'object',
      properties: {
        guideName: {
          type: 'string',
          description: '[DEPRECATED] Hook guide name - use Agent Skills instead',
          enum: ['ocapi_hooks', 'scapi_hooks'],
        },
      },
      required: ['guideName'],
    },
  },
];
