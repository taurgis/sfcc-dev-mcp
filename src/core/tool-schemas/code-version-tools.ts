/**
 * Code Version Tool Schemas
 */

export const CODE_VERSION_TOOLS = [
  {
    name: 'get_code_versions',
    description: 'List all code versions on the SFCC instance. Use for deployment management, identifying active version, or preparing code-switch fixes.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'activate_code_version',
    description: 'Activate a code version (deactivates current). Use for code-switch fixes, SCAPI endpoint issues, or deployment conflicts. Only inactive versions can be activated.',
    inputSchema: {
      type: 'object',
      properties: {
        codeVersionId: {
          type: 'string',
          minLength: 1,
          description: 'ID of the inactive code version to activate.',
        },
      },
      required: ['codeVersionId'],
    },
  },
];
