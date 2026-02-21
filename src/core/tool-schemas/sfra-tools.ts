/**
 * SFRA Documentation Tool Schemas
 */

export const SFRA_DOCUMENTATION_TOOLS = [
  {
    name: 'get_available_sfra_documents',
    description: 'List all SFRA documentation including Server, Request, Response, QueryString, render module, and 26+ model docs (cart, account, billing, shipping, products, pricing).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_sfra_document',
    description: 'Get complete SFRA class or model documentation with properties, methods, and examples. Use for implementing controllers, middleware, or working with SFRA models.',
    inputSchema: {
      type: 'object',
      properties: {
        documentName: {
          type: 'string',
          minLength: 1,
          description: 'Document name, e.g., "server", "request", "cart", "product-full", "account". Use get_available_sfra_documents for full list.',
        },
      },
      required: ['documentName'],
    },
  },
  {
    name: 'search_sfra_documentation',
    description: 'Search across all SFRA docs for concepts or functionality. Returns relevance-scored results with categorization.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          minLength: 1,
          description: 'Search term, e.g., "middleware", "routing", "cache", "cart", "pricing".',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_sfra_documents_by_category',
    description: 'Get SFRA documents filtered by functional area (core classes, product models, order/cart, customer, pricing, store).',
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
    description: 'Get all SFRA document categories with counts. Use to understand documentation organization before browsing.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
