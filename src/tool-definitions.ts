/**
 * MCP Tool Definitions for SFCC Development
 *
 * This module contains all the tool definitions organized by category
 * to keep the main server file clean and maintainable.
 */

export const SFCC_DOCUMENTATION_TOOLS = [
  {
    name: "get_sfcc_class_info",
    description: "Get detailed information about an SFCC class including properties, methods, and description. This is specifically for SFCC server-side code used within cartridges (controllers, scripts, templates, rest-apis) and covers the dw.* API available in the SFCC Rhino environment.",
    inputSchema: {
      type: "object",
      properties: {
        className: {
          type: "string",
          description: "The SFCC class name (e.g., 'Catalog', 'dw.catalog.Catalog')",
        },
        expand: {
          type: "boolean",
          description: "Whether to include detailed information about referenced types used by this class (default: false)",
          default: false,
        },
      },
      required: ["className"],
    },
  },
  {
    name: "search_sfcc_classes",
    description: "Search for SFCC classes by name. These are server-side classes available in SFCC cartridge code (controllers, scripts, templates, rest-apis) within the Rhino JavaScript environment.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for class names",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_sfcc_class_methods",
    description: "Get all methods for a specific SFCC class. This covers server-side API methods available in cartridge code (controllers, scripts, templates, rest-apis) using the dw.* namespace.",
    inputSchema: {
      type: "object",
      properties: {
        className: {
          type: "string",
          description: "The SFCC class name",
        },
      },
      required: ["className"],
    },
  },
  {
    name: "get_sfcc_class_properties",
    description: "Get all properties for a specific SFCC class. This covers server-side API properties available in cartridge code (controllers, scripts, templates, rest-apis) using the dw.* namespace.",
    inputSchema: {
      type: "object",
      properties: {
        className: {
          type: "string",
          description: "The SFCC class name",
        },
      },
      required: ["className"],
    },
  },
  {
    name: "search_sfcc_methods",
    description: "Search for methods across all SFCC classes. This searches server-side API methods available in cartridge code (controllers, scripts, templates, rest-apis) within the SFCC Rhino environment.",
    inputSchema: {
      type: "object",
      properties: {
        methodName: {
          type: "string",
          description: "Method name to search for",
        },
      },
      required: ["methodName"],
    },
  },
  {
    name: "list_sfcc_classes",
    description: "List all available SFCC classes. These are server-side classes available in cartridge code (controllers, scripts, templates, rest-apis) within the SFCC Rhino JavaScript environment.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_sfcc_class_documentation",
    description: "Get the raw documentation content for an SFCC class. This provides detailed documentation for server-side classes used in cartridge code (controllers, scripts, templates, rest-apis) within the SFCC Rhino environment.",
    inputSchema: {
      type: "object",
      properties: {
        className: {
          type: "string",
          description: "The SFCC class name",
        },
      },
      required: ["className"],
    },
  },
];

export const BEST_PRACTICES_TOOLS = [
  {
    name: "get_available_best_practice_guides",
    description: "Get a list of all available SFCC best practice and how to guides including Cartridge Creation, OCAPI hooks, SCAPI hooks, SFRA controllers, and custom SCAPI endpoints",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_best_practice_guide",
    description: "Get a complete best practice and how to guide with all sections and content. These guides cover specific areas of SFCC development such as Cartridge Creation, OCAPI hooks, SCAPI hooks, SFRA controllers, and custom SCAPI endpoints. Always check these guides when creating new code or implementing features in any of these areas.",
    inputSchema: {
      type: "object",
      properties: {
        guideName: {
          type: "string",
          description: "The guide name (e.g., 'cartridge_creation', 'ocapi_hooks', 'scapi_hooks', 'sfra_controllers', 'scapi_custom_endpoint')",
          enum: ["cartridge_creation", "ocapi_hooks", "scapi_hooks", "sfra_controllers", "scapi_custom_endpoint"],
        },
      },
      required: ["guideName"],
    },
  },
  {
    name: "search_best_practices",
    description: "Search across all best practice and how to guides for specific terms or concepts",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term or concept (e.g., 'validation', 'security', 'performance')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_hook_reference",
    description: "Get comprehensive hook reference tables for OCAPI or SCAPI hooks including endpoints and extension points",
    inputSchema: {
      type: "object",
      properties: {
        guideName: {
          type: "string",
          description: "The hook guide name",
          enum: ["ocapi_hooks", "scapi_hooks"],
        },
      },
      required: ["guideName"],
    },
  },
];

export const LOG_TOOLS = [
  {
    name: "get_latest_errors",
    description: "Get the latest error messages from SFCC logs. Use this when debugging failed operations, investigating crashes, exceptions, or when code is not working as expected. Essential for troubleshooting critical issues, API failures, database connection problems, or when users report bugs. Errors indicate something went wrong and needs immediate attention.",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date in YYYYMMDD format (default: today)",
        },
        limit: {
          type: "number",
          description: "Number of error entries to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_latest_warnings",
    description: "Get the latest warning messages from SFCC logs. Use this to identify potential issues, deprecated features being used, performance concerns, or configurations that might cause problems later. Warnings help prevent future errors and optimize code quality. Check warnings when code works but performance is slow or when preparing for production deployment.",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date in YYYYMMDD format (default: today)",
        },
        limit: {
          type: "number",
          description: "Number of warning entries to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_latest_info",
    description: "Get the latest info messages from SFCC logs. Use this to understand application flow, verify that operations completed successfully, track business logic execution, or monitor normal system behavior. Info logs help confirm that features are working correctly and provide context about what the system is doing during normal operation.",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date in YYYYMMDD format (default: today)",
        },
        limit: {
          type: "number",
          description: "Number of info entries to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_latest_debug",
    description: "Get the latest debug messages from SFCC logs. Use this for detailed troubleshooting when you need to trace code execution step-by-step, inspect variable values, understand complex business logic flow, or investigate subtle bugs. Debug logs provide the most detailed information and are essential when standard error logs don't provide enough context to solve the problem.",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date in YYYYMMDD format (default: today)",
        },
        limit: {
          type: "number",
          description: "Number of debug entries to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "summarize_logs",
    description: "Get a comprehensive overview of all log activity with counts and key issues for a specific date. Use this as the first step when investigating problems to quickly understand the overall health of the system, identify the most frequent errors, and get a high-level view before diving into specific log types. Perfect for daily health checks, incident response, or when you need to quickly assess if there are any major issues.",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date in YYYYMMDD format (default: today)",
        },
      },
    },
  },
  {
    name: "search_logs",
    description: "Search for specific patterns, keywords, or error messages across SFCC logs. Use this when you know what you're looking for - specific error messages, function names, API calls, user IDs, order numbers, or any custom identifiers. Essential for tracking down specific issues, following a transaction through the system, or finding all instances of a particular problem pattern.",
    inputSchema: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "Search pattern or keyword to find in logs",
        },
        logLevel: {
          type: "string",
          enum: ["error", "warn", "info", "debug"],
          description: "Restrict search to specific log level for more focused results",
        },
        date: {
          type: "string",
          description: "Date in YYYYMMDD format (default: today)",
        },
        limit: {
          type: "number",
          description: "Number of matching entries to return (default: 20)",
          default: 20,
        },
      },
      required: ["pattern"],
    },
  },
  {
    name: "list_log_files",
    description: "List all available log files with metadata including sizes and modification dates. Use this to understand what log data is available, check if logs are being generated properly, or when you need to investigate issues from specific time periods. Helpful for determining log retention and identifying the best date range for investigation.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

export const SYSTEM_OBJECT_TOOLS = [
  {
    name: "get_system_object_definitions",
    description: "Get all system object definitions from SFCC. This returns a list of all system objects with their metadata, useful for discovering what system objects exist and their custom attributes. Requires OAuth credentials.",
    inputSchema: {
      type: "object",
      properties: {
        start: {
          type: "number",
          description: "Optional start index for retrieving items from a given index (default: 0)",
          default: 0,
        },
        count: {
          type: "number",
          description: "Optional count for retrieving only a subset of items (default: 200)",
          default: 200,
        },
        select: {
          type: "string",
          description: "The property selector (e.g., '(**)' for all properties)",
        },
      },
    },
  },
  {
    name: "get_system_object_definition",
    description: "Get detailed information about a specific SFCC system object definition by object type. This returns comprehensive metadata including all attributes, useful for inspecting custom attributes added to standard SFCC objects like Product, Customer, Order, etc. Requires OAuth credentials.",
    inputSchema: {
      type: "object",
      properties: {
        objectType: {
          type: "string",
          description: "The system object type (e.g., 'Product', 'Customer', 'Order', 'Category', 'Site')",
        },
      },
      required: ["objectType"],
    },
  },
  {
    name: "get_system_object_attribute_definitions",
    description: "Get detailed attribute definitions for a specific SFCC system object type. This returns comprehensive information about all attributes including custom attributes with their types, constraints, and metadata. This provides more detailed attribute information than the basic system object definition.",
    inputSchema: {
      type: "object",
      properties: {
        objectType: {
          type: "string",
          description: "The system object type (e.g., 'Product', 'Customer', 'Order', 'Category', 'Site')",
        },
        start: {
          type: "number",
          description: "Optional start index for retrieving items from a given index (default: 0)",
          default: 0,
        },
        count: {
          type: "number",
          description: "Optional count for retrieving only a subset of items (default: 200)",
          default: 200,
        },
        select: {
          type: "string",
          description: "The property selector (e.g., '(**)' for all properties)",
        },
      },
      required: ["objectType"],
    },
  },
];
