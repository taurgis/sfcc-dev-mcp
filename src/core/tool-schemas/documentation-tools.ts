/**
 * SFCC Documentation Tool Schemas
 */

export const SFCC_DOCUMENTATION_TOOLS = [
  {
    name: 'get_sfcc_class_info',
    description: 'Get detailed information about an SFCC class including properties, methods, and description. Use this when you need to understand what a specific SFCC class does, what methods/properties are available, or when implementing features that use SFCC APIs. Essential for cartridge development (controllers, scripts, templates, rest-apis) using the dw.* namespace in the SFCC Rhino environment.',
    inputSchema: {
      type: 'object',
      properties: {
        className: {
          type: 'string',
          description: "The SFCC class name (e.g., 'Catalog', 'dw.catalog.Catalog')",
        },
        expand: {
          type: 'boolean',
          description: 'Whether to include detailed information about referenced types used by this class (default: false)',
          default: false,
        },
        includeDescription: {
          type: 'boolean',
          description: 'Whether to include the class description in the response (default: true)',
          default: true,
        },
        includeConstants: {
          type: 'boolean',
          description: 'Whether to include constants in the response (default: true)',
          default: true,
        },
        includeProperties: {
          type: 'boolean',
          description: 'Whether to include properties in the response (default: true)',
          default: true,
        },
        includeMethods: {
          type: 'boolean',
          description: 'Whether to include methods in the response (default: true)',
          default: true,
        },
        includeInheritance: {
          type: 'boolean',
          description: 'Whether to include inheritance hierarchy in the response (default: true)',
          default: true,
        },
        search: {
          type: 'string',
          description: 'Optional search term to filter constants, properties, methods, and inheritance entries. Case-insensitive search across names and descriptions. Only one word at a time (e.g., "get", "create", "order"). Combining multiple words or looking for multiple items at the same time is not supported.',
        },
      },
      required: ['className'],
    },
  },
  {
    name: 'search_sfcc_classes',
    description: "Search for SFCC classes by name or functionality. Use this when you know part of a class name or need to find classes related to specific functionality (e.g., search 'catalog' to find catalog-related classes). Perfect starting point when you're unsure of the exact class name or exploring available APIs for a feature area.",
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for class names. Only use one word at a time (e.g., "catalog", "order", "customer"). Combining multiple words or attempting to look for multiple classes at the same time is not supported.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_sfcc_methods',
    description: 'Search for methods across all SFCC classes by method name. Use this when you know the method name but not which class it belongs to, or when looking for similar methods across different classes. Helpful for discovering all available methods that perform similar operations.',
    inputSchema: {
      type: 'object',
      properties: {
        methodName: {
          type: 'string',
          description: 'Method name to search for. Only use one word at a time (e.g., "get", "create", "update"). Combining multiple words or looking for multiple methods at the same time is not supported.',
        },
      },
      required: ['methodName'],
    },
  },
  {
    name: 'list_sfcc_classes',
    description: "Get a complete list of all available SFCC classes. Use this for exploration and discovery when you need to understand the full scope of SFCC APIs, or when you're new to SFCC development and want to see what's available. Good starting point for understanding the SFCC class hierarchy.",
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_sfcc_class_documentation',
    description: "Get the complete raw documentation for an SFCC class. Use this when you need comprehensive details about a class including examples, detailed descriptions, and full context. Best for in-depth understanding when the basic class info isn't sufficient.",
    inputSchema: {
      type: 'object',
      properties: {
        className: {
          type: 'string',
          description: 'The SFCC class name',
        },
      },
      required: ['className'],
    },
  },
];
