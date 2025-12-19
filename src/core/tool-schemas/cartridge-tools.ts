/**
 * Cartridge Generation Tool Schemas
 */

export const CARTRIDGE_GENERATION_TOOLS = [
  {
    name: 'generate_cartridge_structure',
    description: 'Generate a complete SFCC cartridge with proper directory structure, configurations, and boilerplate files. Creates files directly in the target directory.',
    inputSchema: {
      type: 'object',
      properties: {
        cartridgeName: {
          type: 'string',
          description: 'Name of the cartridge (e.g., "plugin_example")',
        },
        targetPath: {
          type: 'string',
          description: 'Target directory path where the cartridge files should be placed. If not specified, files will be placed in the current working directory. Use absolute paths for best results (e.g., "/Users/username/projects/my-sfcc-project/").',
        },
        fullProjectSetup: {
          type: 'boolean',
          description: 'Whether to create a complete project setup (package.json, webpack, etc.) or just add a cartridge to existing project structure. Use true for new projects, false to add cartridge to existing projects. Always send the root of the project directory as the targetPath.',
          default: true,
        },
      },
      required: ['cartridgeName'],
    },
  },
];
