/**
 * SFCC Documentation Tool Schemas
 */

export const SFCC_DOCUMENTATION_TOOLS = [
  {
    name: 'get_sfcc_class_info',
    description: 'Get detailed information about an SFCC class including properties, methods, constants, and inheritance. Essential for understanding dw.* APIs when building controllers, scripts, templates, or REST APIs. Supports filtering by section and search within class members.',
    inputSchema: {
      type: 'object',
      properties: {
        className: {
          type: 'string',
          minLength: 1,
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
          minLength: 1,
          description: 'Filter class members by keyword (case-insensitive). Single word only, e.g., "price", "get", "custom".',
        },
      },
      required: ['className'],
    },
  },
  {
    name: 'search_sfcc_classes',
    description: "Find SFCC classes by partial name or keyword. Use when you don't know the exact class name (e.g., 'catalog' finds dw.catalog.*, 'price' finds pricing-related classes).",
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          minLength: 1,
          description: 'Single keyword to search class names, e.g., "catalog", "order", "basket".',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_sfcc_methods',
    description: 'Find methods across all dw.* classes by name. Use when you know a method exists but not which class contains it.',
    inputSchema: {
      type: 'object',
      properties: {
        methodName: {
          type: 'string',
          minLength: 1,
          description: 'Method name to search, e.g., "getProduct", "addItem", "calculate".',
        },
      },
      required: ['methodName'],
    },
  },
  {
    name: 'list_sfcc_classes',
    description: 'List all available SFCC dw.* classes organized by namespace. Use to explore the full API surface or find classes in a specific domain.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_sfcc_class_documentation',
    description: 'Get the full raw documentation for an SFCC class including examples and detailed descriptions. Use when get_sfcc_class_info lacks sufficient detail.',
    inputSchema: {
      type: 'object',
      properties: {
        className: {
          type: 'string',
          minLength: 1,
          description: 'The SFCC class name',
        },
      },
      required: ['className'],
    },
  },
];
