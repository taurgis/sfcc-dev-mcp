/**
 * SFRA Documentation Tool Schemas
 */

export const SFRA_DOCUMENTATION_TOOLS = [
  {
    name: 'get_available_sfra_documents',
    description: 'Get a list of all available SFRA (Storefront Reference Architecture) documentation. Use this to discover what SFRA classes, modules, and models are documented, including Server, Request, Response, QueryString, render module, and comprehensive model documentation for account, cart, products, pricing, billing, shipping, and more. Essential for understanding SFRA architecture and available functionality.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_sfra_document',
    description: 'Get complete SFRA class, module, or model documentation with detailed information about properties, methods, and usage examples. Use this when working with SFRA controllers, middleware, models, or when you need to understand how SFRA components work together. Perfect for implementing SFRA-based features. Now supports all 26+ SFRA documents including core classes, product models, order/cart models, customer models, pricing models, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        documentName: {
          type: 'string',
          description: 'The SFRA document name (e.g., \'server\', \'request\', \'response\', \'querystring\', \'render\', \'cart\', \'product-full\', \'account\', \'billing\', \'shipping\', etc.). Use get_available_sfra_documents to see all available options.',
        },
      },
      required: ['documentName'],
    },
  },
  {
    name: 'search_sfra_documentation',
    description: 'Search across all SFRA documentation for specific terms, concepts, or functionality. Use this when you need to find specific SFRA features, understand how to implement controller patterns, locate model information, or find information about routing, middleware, request handling, response management, cart functionality, product models, or customer management. Enhanced with relevance scoring and categorization.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "Search term or concept (e.g., 'middleware', 'routing', 'render', 'querystring', 'cache', 'cart', 'product', 'billing', 'shipping', 'account', 'pricing')",
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_sfra_documents_by_category',
    description: 'Get SFRA documents filtered by category. Use this to explore documents in specific functional areas like core SFRA classes, product models, order/cart functionality, customer management, pricing, or store models. Perfect for discovering related documentation and understanding functional groupings.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'],
          description: 'Category to filter by: core (Server, Request, Response, etc.), product (product models), order (cart, billing, shipping), customer (account, address), pricing (price models), store (store models), other (utilities)',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_sfra_categories',
    description: 'Get all available SFRA document categories with counts and descriptions. Use this to understand the organization of SFRA documentation and discover what types of functionality are available. Helpful for exploring the full scope of SFRA capabilities.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
