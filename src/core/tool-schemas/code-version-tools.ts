/**
 * Code Version Tool Schemas
 */

export const CODE_VERSION_TOOLS = [
  {
    name: 'get_code_versions',
    description: 'Get all code versions from an SFCC instance. Use this to view available code versions for deployment management and code-switch fixes. Essential for troubleshooting SCAPI endpoint registration issues, job deployment problems, and when you need to switch between different code versions to resolve deployment conflicts.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'activate_code_version',
    description: 'Activate a specific code version on the SFCC instance. Use this to perform code-switch fixes for SCAPI endpoint registration issues, job deployment problems, and deployment conflicts. Only inactive code versions can be activated, and activating a version will automatically deactivate the currently active version.',
    inputSchema: {
      type: 'object',
      properties: {
        codeVersionId: {
          type: 'string',
          description: 'The ID of the code version to activate. Must be an existing inactive code version.',
        },
      },
      required: ['codeVersionId'],
    },
  },
];
