/**
 * MCP Tool Definitions for SFCC Development
 *
 * This module contains all the tool definitions organized by category
 * to keep the main server file clean and maintainable.
 */

// ==============================================================
// SHARED SCHEMAS - DRY: Reusable schema components
// ==============================================================

/**
 * Common query schema for OCAPI search operations
 */
const QUERY_SCHEMA = {
  type: 'object',
  description: 'Query to filter results',
  properties: {
    text_query: {
      type: 'object',
      description: 'Search for text in specific fields',
      properties: {
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to search in (e.g., ["id", "display_name", "description"])',
        },
        search_phrase: {
          type: 'string',
          description: 'Text to search for',
        },
      },
      required: ['fields', 'search_phrase'],
    },
    term_query: {
      type: 'object',
      description: 'Search for exact term matches',
      properties: {
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to search in',
        },
        operator: {
          type: 'string',
          description: 'Query operator (e.g., "is", "one_of")',
        },
        values: {
          type: 'array',
          items: { type: 'string' },
          description: 'Values to match',
        },
      },
      required: ['fields', 'operator', 'values'],
    },
    bool_query: {
      type: 'object',
      description: 'Combine multiple queries with boolean logic',
      properties: {
        must: {
          type: 'array',
          items: { type: 'object' },
          description: 'Queries that must match (AND)',
        },
        must_not: {
          type: 'array',
          items: { type: 'object' },
          description: 'Queries that must not match',
        },
        should: {
          type: 'array',
          items: { type: 'object' },
          description: 'Queries that should match (OR)',
        },
      },
    },
    match_all_query: {
      type: 'object',
      description: 'Match all documents - useful when you want all results or to filter with sorts/pagination only.',
      properties: {},
    },
  },
} as const;

/**
 * Common sorts schema for OCAPI search operations
 */
const SORTS_SCHEMA = {
  type: 'array',
  description: 'Sort criteria',
  items: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        description: 'Field to sort by',
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Sort order (default: asc)',
      },
    },
    required: ['field'],
  },
} as const;

/**
 * Common pagination schema for OCAPI search operations
 */
const PAGINATION_SCHEMA = {
  start: {
    type: 'number',
    description: 'Start index for pagination (default: 0)',
    default: 0,
  },
  count: {
    type: 'number',
    description: 'Number of results to return (default: 200)',
    default: 200,
  },
  select: {
    type: 'string',
    description: "Property selector (e.g., '(**)' for all properties)",
  },
} as const;

/**
 * Factory to create search request schema with optional description override
 */
function createSearchRequestSchema(queryDescription?: string) {
  return {
    type: 'object',
    description: 'The search request with query, sorting, and pagination options',
    properties: {
      query: queryDescription
        ? { ...QUERY_SCHEMA, description: queryDescription }
        : QUERY_SCHEMA,
      sorts: SORTS_SCHEMA,
      ...PAGINATION_SCHEMA,
    },
  };
}

// ==============================================================
// TOOL DEFINITIONS
// ==============================================================

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

export const ISML_DOCUMENTATION_TOOLS = [
  {
    name: 'list_isml_elements',
    description: 'Get a list of all available ISML (Internet Store Markup Language) elements with summaries. Use this to discover what ISML elements are available for template development including control flow (isif, isloop), output formatting (isprint), includes (isinclude, iscomponent), scripting (isscript, isset), caching (iscache), and special elements.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_isml_element',
    description: 'Get detailed documentation for a specific ISML element including syntax, attributes, examples, and use cases. Use this when implementing ISML templates and need to understand element usage, required/optional attributes, formatting options, or best practices for elements like isif, isloop, isprint, isinclude, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        elementName: {
          type: 'string',
          description: 'The ISML element name (e.g., \'isif\', \'isloop\', \'isprint\', \'isinclude\', \'iscomponent\'). The \'is\' prefix is optional.',
        },
        includeContent: {
          type: 'boolean',
          description: 'Whether to include full documentation content (default: true)',
          default: true,
        },
        includeSections: {
          type: 'boolean',
          description: 'Whether to include section headings (default: true)',
          default: true,
        },
        includeAttributes: {
          type: 'boolean',
          description: 'Whether to include attribute information (default: true)',
          default: true,
        },
      },
      required: ['elementName'],
    },
  },
  {
    name: 'search_isml_elements',
    description: 'Search across ISML element documentation for specific terms, functionality, or patterns. Use this when you need to find elements by purpose (e.g., \'loop\', \'conditional\', \'cache\'), by attribute name, or by use case. Returns results with relevance scoring and preview snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term or concept (e.g., \'loop\', \'conditional\', \'format\', \'cache\', \'redirect\')',
        },
        category: {
          type: 'string',
          description: 'Optional category filter: control-flow, output, includes, scripting, cache, decorators, special, payment, or analytics',
          enum: ['control-flow', 'output', 'includes', 'scripting', 'cache', 'decorators', 'special', 'payment', 'analytics'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_isml_elements_by_category',
    description: 'Get all ISML elements filtered by category. Use this to explore elements grouped by functionality such as control flow elements (isif, isloop), output elements (isprint), includes/components (isinclude, iscomponent, isslot), scripting (isscript, isset), or special elements.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Category to filter by: control-flow (conditionals, loops), output (formatting), includes (templates, components), scripting (server-side code), cache (caching), decorators (layout), special (redirect, status), payment (payment elements), analytics (tracking)',
          enum: ['control-flow', 'output', 'includes', 'scripting', 'cache', 'decorators', 'special', 'payment', 'analytics'],
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_isml_categories',
    description: 'Get all available ISML element categories with descriptions and element counts. Use this to understand the organization of ISML elements and discover what types of functionality are available for template development.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

export const LOG_TOOLS = [
  {
    name: 'get_latest_error',
    description: 'Get the latest error messages from SFCC logs. Use this when debugging failed operations, investigating crashes, exceptions, or when code is not working as expected. Essential for troubleshooting critical issues, API failures, database connection problems, or when users report bugs. Errors indicate something went wrong and needs immediate attention.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYYMMDD format (default: today)',
        },
        limit: {
          type: 'number',
          description: 'Number of error entries to return (default: 20)',
          default: 20,
        },
      },
    },
  },
  {
    name: 'get_latest_warn',
    description: 'Get the latest warning messages from SFCC logs. Use this to identify potential issues, deprecated features being used, performance concerns, or configurations that might cause problems later. Warnings help prevent future errors and optimize code quality. Check warnings when code works but performance is slow or when preparing for production deployment.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYYMMDD format (default: today)',
        },
        limit: {
          type: 'number',
          description: 'Number of warning entries to return (default: 20)',
          default: 20,
        },
      },
    },
  },
  {
    name: 'get_latest_info',
    description: 'Get the latest info messages from SFCC logs. Use this to understand application flow, verify that operations completed successfully, track business logic execution, or monitor normal system behavior. Info logs help confirm that features are working correctly and provide context about what the system is doing during normal operation.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYYMMDD format (default: today)',
        },
        limit: {
          type: 'number',
          description: 'Number of info entries to return (default: 20)',
          default: 20,
        },
      },
    },
  },
  {
    name: 'get_latest_debug',
    description: "Get the latest debug messages from SFCC logs. Use this for detailed troubleshooting when you need to trace code execution step-by-step, inspect variable values, understand complex business logic flow, or investigate subtle bugs. Debug logs provide the most detailed information and are essential when standard error logs don't provide enough context to solve the problem.",
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYYMMDD format (default: today)',
        },
        limit: {
          type: 'number',
          description: 'Number of debug entries to return (default: 20)',
          default: 20,
        },
      },
    },
  },
  {
    name: 'summarize_logs',
    description: 'Get a comprehensive overview of all log activity with counts and key issues for a specific date. Use this as the first step when investigating problems to quickly understand the overall health of the system, identify the most frequent errors, and get a high-level view before diving into specific log types. Perfect for daily health checks, incident response, or when you need to quickly assess if there are any major issues.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYYMMDD format (default: today)',
        },
      },
    },
  },
  {
    name: 'search_logs',
    description: "Search for specific patterns, keywords, or error messages across SFCC logs. Use this when you know what you're looking for - specific error messages, function names, API calls, user IDs, order numbers, or any custom identifiers. Essential for tracking down specific issues, following a transaction through the system, or finding all instances of a particular problem pattern.",
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Search pattern or keyword to find in logs',
        },
        logLevel: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug'],
          description: 'Restrict search to specific log level for more focused results',
        },
        date: {
          type: 'string',
          description: 'Date in YYYYMMDD format (default: today)',
        },
        limit: {
          type: 'number',
          description: 'Number of matching entries to return (default: 20)',
          default: 20,
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'list_log_files',
    description: 'List all available log files with metadata including sizes and modification dates. Use this to understand what log data is available, check if logs are being generated properly, or when you need to investigate issues from specific time periods. Helpful for determining log retention and identifying the best date range for investigation.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_log_file_contents',
    description: 'Get the complete contents of a specific log file. Use this when you need to read the full content of a specific log file identified by the list_log_files tool or job log files from get_latest_job_log_files. Essential for detailed analysis of specific log files, reading complete error traces, or when you need the full context of a log file rather than just recent entries.',
    inputSchema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'The complete filename or path of the log file to read. For standard logs, use just the filename (e.g., "error-blade-20240820-000000.log"). For job logs, use the full path as returned by get_latest_job_log_files (e.g., "jobs/JobName/Job-JobName-12345.log")',
        },
        maxBytes: {
          type: 'number',
          description: 'Maximum number of bytes to read from the file (default: 1MB). Use this to limit the amount of data returned for very large files.',
          default: 1048576,
        },
        tailOnly: {
          type: 'boolean',
          description: 'Whether to read only the tail (end) of the file instead of the full contents (default: false). Set to true for large files to get recent entries.',
          default: false,
        },
      },
      required: ['filename'],
    },
  },
];

export const JOB_LOG_TOOLS = [
  {
    name: 'get_latest_job_log_files',
    description: 'Get the latest job log files from the SFCC jobs folder. Use this to discover recent job executions, identify available job logs, and understand which jobs have run recently. Job logs are stored in a deeper folder structure (/Logs/jobs/[job name ID]/Job-*.log) and contain all log levels (error, warn, info, debug) in single files. Essential for debugging custom job steps and monitoring job execution.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of job log files to return (default: 10)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'search_job_logs_by_name',
    description: 'Search for job log files by job name. Use this when you want to find logs for a specific job to debug custom job steps or understand job execution patterns. Job names are typically the system ID or custom-configured names for jobs.',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'The job name to search for (partial matches supported)',
        },
        limit: {
          type: 'number',
          description: 'Number of job log files to return (default: 10)',
          default: 10,
        },
      },
      required: ['jobName'],
    },
  },
  {
    name: 'get_job_log_entries',
    description: 'Get job log entries for a specific log level or all levels from recent job executions. Unlike standard logs, job logs contain all log levels in one file, making this tool perfect for debugging custom job code. Use this to see what happened during job execution, track errors in job steps, or monitor job performance.',
    inputSchema: {
      type: 'object',
      properties: {
        level: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug', 'all'],
          description: 'Log level to retrieve (default: all). Use "all" to see all log levels from job executions.',
          default: 'all',
        },
        limit: {
          type: 'number',
          description: 'Number of job log entries to return (default: 10)',
          default: 10,
        },
        jobName: {
          type: 'string',
          description: 'Optional job name to filter results to a specific job',
        },
      },
    },
  },
  {
    name: 'search_job_logs',
    description: 'Search for specific patterns, error messages, or keywords within job logs. Use this when debugging specific job issues, looking for custom logging messages in your job steps, tracking job variables, or finding specific execution patterns. Essential for troubleshooting custom job code.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Search pattern or keyword to find in job logs',
        },
        level: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug', 'all'],
          description: 'Restrict search to specific log level (default: all)',
          default: 'all',
        },
        limit: {
          type: 'number',
          description: 'Number of matching entries to return (default: 20)',
          default: 20,
        },
        jobName: {
          type: 'string',
          description: 'Optional job name to restrict search to a specific job',
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'get_job_execution_summary',
    description: 'Get a comprehensive execution summary for a specific job including timing, status, error counts, and step information. Use this to understand job performance, identify bottlenecks, check execution status, or get an overview of what happened during job execution. Perfect for monitoring job health and debugging job step issues.',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'The job name to get execution summary for',
        },
      },
      required: ['jobName'],
    },
  },
];

export const SYSTEM_OBJECT_TOOLS = [
  {
    name: 'get_system_object_definitions',
    description: 'Get all system object definitions from SFCC with their main metadata, not including attributes. Use this to discover what system objects are available in the SFCC instance, understand the basic data model, or when you need to see all objects at once. Essential for understanding the complete SFCC data structure and identifying objects. You can also discover which objects are "Custom Objects" by looking at the _type field in the response.',
    inputSchema: {
      type: 'object',
      properties: {
        start: {
          type: 'number',
          description: 'Optional start index for retrieving items from a given index (default: 0)',
          default: 0,
        },
        count: {
          type: 'number',
          description: 'Optional count for retrieving only a subset of items (default: 200)',
          default: 200,
        },
        select: {
          type: 'string',
          description: "Property selector using OCAPI select syntax. Controls which fields are returned in the response. Examples: '(**)' for all properties, '(start, total)' for pagination info only, '(data.(object_type))' for only object_type in data array, '(data.(object_type, display_name))' for specific fields in data array, '(start, data.(**))' for pagination info plus all data properties. Use parentheses to group field selections and dot notation to traverse object hierarchies.",
          default: '(**)',
        },
      },
    },
  },
  {
    name: 'get_system_object_definition',
    description: 'Get basic metadata about a specific SFCC system object definition including counts and configuration flags. Returns information like attribute count, group count, display name, creation date, and object type flags (content_object, queryable, read_only). Use this when you need to understand the basic structure and configuration of system objects like Product, Customer, Order, Category, or Site. For detailed attribute information, use get_system_object_attribute_definitions instead. You can not fetch "Custom Objects" with this API.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: "The system object type (e.g., 'Product', 'Customer', 'Order', 'Category', 'Site')",
        },
      },
      required: ['objectType'],
    },
  },
  {
    name: 'search_system_object_attribute_definitions',
    description: 'Search for specific attribute definitions within a system object type using complex queries. Use this when you need to find attributes by name, type, or other properties rather than retrieving all attributes. Supports text search on id/display_name/description, filtering by properties like mandatory/searchable/system, and sorting. Essential for finding custom attributes or attributes with specific characteristics. To get all attributes, use a match_all_query.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: "The system object type to search within (e.g., 'Product', 'Customer', 'Order', 'Category', 'Site')",
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute definitions'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
  {
    name: 'search_site_preferences',
    description: 'Search site preferences across sites in the specified preference group and instance. Use this to find specific site preferences by name, description, or value type. Essential for discovering custom site preferences, understanding preference configurations, or when working with site-specific settings. Use this tool when generating or debugging code that accesses site preferences (e.g., dw.system.Site.current.preferences.custom.yourPreference, Site.getCurrent().getCustomPreferenceValue()) to validate preference names, understand their data types, discover available preferences in a group, or troubleshoot preference-related issues. Supports complex queries with text search, filtering, and sorting.',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: {
          type: 'string',
          description: 'The ID of the preference group to search within',
        },
        instanceType: {
          type: 'string',
          enum: ['staging', 'development', 'sandbox', 'production'],
          description: 'The instance type to search preferences for. Since this MCP server is aimed at development and testing, the default is "sandbox".',
          default: 'sandbox',
        },
        searchRequest: createSearchRequestSchema('Query to filter site preferences'),
        options: {
          type: 'object',
          description: 'Additional options for the search',
          properties: {
            maskPasswords: {
              type: 'boolean',
              description: 'Whether to mask password type preference values (default: true)',
              default: true,
            },
            expand: {
              type: 'string',
              description: 'Expand options (use "value" to retrieve value definitions)',
            },
          },
        },
      },
      required: ['groupId', 'instanceType', 'searchRequest'],
    },
  },
  {
    name: 'search_system_object_attribute_groups',
    description: 'Search attribute groups for a specific system object type. Use this to discover available attribute groups, which is essential for finding site preference groups (use "SitePreferences" as objectType) needed for the site preferences search API. Supports complex queries with text search, filtering, and sorting on group properties.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: 'The system object type to search attribute groups for (e.g., "Product", "Customer", "SitePreferences")',
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute groups'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
  {
    name: 'search_custom_object_attribute_definitions',
    description: 'Search for specific attribute definitions within a custom object type using complex queries. Use this when you need to find attributes by name, type, or other properties for custom objects rather than system objects. Supports text search on id/display_name/description, filtering by properties like mandatory/searchable/system, and sorting. Essential for finding custom attributes or attributes with specific characteristics in custom object definitions. Custom objects are user-defined data structures that extend SFCC functionality.',
    inputSchema: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          description: "The custom object type to search within (e.g., 'Global_String', 'MyCustomObject')",
        },
        searchRequest: createSearchRequestSchema('Query to filter attribute definitions'),
      },
      required: ['objectType', 'searchRequest'],
    },
  },
];

export const CARTRIDGE_GENERATION_TOOLS = [
  {
    name: 'generate_cartridge_structure',
    description: 'Generate a complete cartridge directory structure with all necessary files and configurations. Use this when creating new cartridges to ensure proper organization and include all required components. This tool creates all necessary files directly in the specified target directory, ensuring the cartridge is created exactly where needed in your project structure.',
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
