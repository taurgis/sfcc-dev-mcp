/**
 * MCP Server for SFCC Development
 *
 * This module implements the Model Context Protocol (MCP) server for accessing
 * Salesforce B2C Commerce Cloud development features. It provides a standardized interface
 * for AI assistants to interact with SFCC development tools and data.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SFCCConfig, LogLevel } from "./types.js";
import { SFCCLogClient } from "./log-client.js";
import { SFCCDocumentationClient } from "./docs-client.js";
import { SFCCBestPracticesClient } from "./best-practices-client.js";
import { OCAPIClient } from "./ocapi-client.js";
import { Logger } from "./logger.js";

/**
 * MCP Server implementation for SFCC development assistance
 *
 * This class sets up the MCP server, defines available tools, and handles
 * requests from MCP clients (like AI assistants) to interact with SFCC development features.
 */
export class SFCCDevServer {
  private server: Server;
  private logClient: SFCCLogClient;
  private docsClient: SFCCDocumentationClient;
  private bestPracticesClient: SFCCBestPracticesClient;
  private ocapiClient: OCAPIClient | null = null;
  private logger: Logger;

  /**
   * Initialize the SFCC Development MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   * @param debug - Whether to enable debug logging (default: true)
   */
  constructor(config: SFCCConfig, debug: boolean = false) {
    this.logger = new Logger("Server", true, debug);
    this.logger.methodEntry("constructor", { hostname: config.hostname, hasAuth: !!(config.username || config.clientId), debug });

    this.logClient = new SFCCLogClient(config);
    this.docsClient = new SFCCDocumentationClient();
    this.bestPracticesClient = new SFCCBestPracticesClient();

    // Initialize OCAPI client if OAuth credentials are available
    if (config.clientId && config.clientSecret) {
      this.ocapiClient = new OCAPIClient({
        hostname: config.hostname,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        version: "v23_2" // Use latest version for system object definitions
      });
      this.logger.debug("OCAPI client initialized with OAuth credentials");
    } else if (config.apiKey && config.apiSecret) {
      this.ocapiClient = new OCAPIClient({
        hostname: config.hostname,
        clientId: config.apiKey,
        clientSecret: config.apiSecret,
        version: "v23_2"
      });
      this.logger.debug("OCAPI client initialized with API key credentials");
    } else {
      this.logger.debug("OCAPI client not initialized - OAuth credentials not provided");
    }

    this.server = new Server(
      {
        name: "sfcc-dev-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.logger.methodExit("constructor");
  }

  /**
   * Set up MCP tool handlers for SFCC operations
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // SFCC Log Tools
          {
            name: "get_latest_errors",
            description: "Get the latest error messages from SFCC logs",
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
            description: "Get the latest warning messages from SFCC logs",
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
            description: "Get the latest info messages from SFCC logs",
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
            name: "summarize_logs",
            description: "Summarize the latest logs with error counts and key issues",
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
            description: "Search for specific patterns in the logs",
            inputSchema: {
              type: "object",
              properties: {
                pattern: {
                  type: "string",
                  description: "Search pattern or keyword",
                },
                logLevel: {
                  type: "string",
                  enum: ["error", "warn", "info"],
                  description: "Log level to search in",
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
            description: "List available log files",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          // SFCC Documentation Tools
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
          // SFCC System Object Definition Tools
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
          // SFCC Best Practices Tools
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
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const startTime = Date.now();

      this.logger.methodEntry(`handleToolRequest:${name}`, args);

      try {
        let result: any;
        switch (name) {
          // Log-related tools
          case "get_latest_errors":
            this.logger.debug(`Fetching latest errors with limit: ${(args?.limit as number) || 10}, date: ${args?.date || 'today'}`);
            const errorResult = await this.logClient.getLatestLogs("error", (args?.limit as number) || 10, args?.date as string);
            this.logger.timing(`get_latest_errors`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(errorResult, null, 2),
                },
              ],
            };
            break;

          case "get_latest_warnings":
            this.logger.debug(`Fetching latest warnings with limit: ${(args?.limit as number) || 10}, date: ${args?.date || 'today'}`);
            const warningResult = await this.logClient.getLatestLogs("warn", (args?.limit as number) || 10, args?.date as string);
            this.logger.timing(`get_latest_warnings`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(warningResult, null, 2),
                },
              ],
            };
            break;

          case "get_latest_info":
            this.logger.debug(`Fetching latest info logs with limit: ${(args?.limit as number) || 10}, date: ${args?.date || 'today'}`);
            const infoResult = await this.logClient.getLatestLogs("info", (args?.limit as number) || 10, args?.date as string);
            this.logger.timing(`get_latest_info`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(infoResult, null, 2),
                },
              ],
            };
            break;

          case "summarize_logs":
            this.logger.debug(`Summarizing logs for date: ${args?.date || 'today'}`);
            const summaryResult = await this.logClient.summarizeLogs(args?.date as string);
            this.logger.timing(`summarize_logs`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(summaryResult, null, 2),
                },
              ],
            };
            break;

          case "search_logs":
            if (!args?.pattern) {
              throw new Error("Pattern is required for log search");
            }
            this.logger.debug(`Searching logs for pattern: "${args.pattern}", logLevel: ${args.logLevel || 'all'}, limit: ${(args.limit as number) || 20}`);
            const searchResult = await this.logClient.searchLogs(
              args.pattern as string,
              args.logLevel as LogLevel,
              (args.limit as number) || 20,
              args.date as string
            );
            this.logger.timing(`search_logs`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(searchResult, null, 2),
                },
              ],
            };
            break;

          case "list_log_files":
            this.logger.debug("Listing all available log files");
            const logFilesResult = await this.logClient.listLogFiles();
            this.logger.timing(`list_log_files`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(logFilesResult, null, 2),
                },
              ],
            };
            break;

          // Documentation-related tools
          case "get_sfcc_class_info":
            if (!args?.className) {
              throw new Error("className is required");
            }
            const expand = args?.expand as boolean || false;
            this.logger.debug(`Getting class info for: "${args.className}", expand: ${expand}`);
            const classDetails = await this.docsClient.getClassDetailsExpanded(args.className as string, expand);
            if (!classDetails) {
              throw new Error(`Class "${args.className}" not found`);
            }
            this.logger.timing(`get_sfcc_class_info`, startTime);
            this.logger.debug(`Retrieved class info with ${classDetails.methods?.length || 0} methods and ${classDetails.properties?.length || 0} properties`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(classDetails, null, 2),
                },
              ],
            };
            break;

          case "search_sfcc_classes":
            if (!args?.query) {
              throw new Error("query is required");
            }
            this.logger.debug(`Searching SFCC classes for query: "${args.query}"`);
            const searchResults = await this.docsClient.searchClasses(args.query as string);
            this.logger.timing(`search_sfcc_classes`, startTime);
            this.logger.debug(`Found ${searchResults.length} matching classes`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(searchResults, null, 2),
                },
              ],
            };
            break;

          case "get_sfcc_class_methods":
            if (!args?.className) {
              throw new Error("className is required");
            }
            this.logger.debug(`Getting methods for class: "${args.className}"`);
            const methods = await this.docsClient.getClassMethods(args.className as string);
            this.logger.timing(`get_sfcc_class_methods`, startTime);
            this.logger.debug(`Retrieved ${methods.length} methods for class "${args.className}"`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(methods, null, 2),
                },
              ],
            };
            break;

          case "get_sfcc_class_properties":
            if (!args?.className) {
              throw new Error("className is required");
            }
            this.logger.debug(`Getting properties for class: "${args.className}"`);
            const properties = await this.docsClient.getClassProperties(args.className as string);
            this.logger.timing(`get_sfcc_class_properties`, startTime);
            this.logger.debug(`Retrieved ${properties.length} properties for class "${args.className}"`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(properties, null, 2),
                },
              ],
            };
            break;

          case "search_sfcc_methods":
            if (!args?.methodName) {
              throw new Error("methodName is required");
            }
            this.logger.debug(`Searching for methods with name: "${args.methodName}"`);
            const methodResults = await this.docsClient.searchMethods(args.methodName as string);
            this.logger.timing(`search_sfcc_methods`, startTime);
            this.logger.debug(`Found ${methodResults.length} methods matching "${args.methodName}"`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(methodResults, null, 2),
                },
              ],
            };
            break;

          case "list_sfcc_classes":
            this.logger.debug("Listing all available SFCC classes");
            const allClasses = await this.docsClient.getAvailableClasses();
            this.logger.timing(`list_sfcc_classes`, startTime);
            this.logger.debug(`Retrieved ${allClasses.length} available classes`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allClasses, null, 2),
                },
              ],
            };
            break;

          case "get_sfcc_class_documentation":
            if (!args?.className) {
              throw new Error("className is required");
            }
            this.logger.debug(`Getting raw documentation for class: "${args.className}"`);
            const documentation = await this.docsClient.getClassDocumentation(args.className as string);
            if (!documentation) {
              throw new Error(`Documentation for class "${args.className}" not found`);
            }
            this.logger.timing(`get_sfcc_class_documentation`, startTime);
            this.logger.debug(`Retrieved documentation for "${args.className}" (${documentation.length} characters)`);
            result = {
              content: [
                {
                  type: "text",
                  text: documentation,
                },
              ],
            };
            break;

          // Best Practices-related tools
          case "get_available_best_practice_guides":
            this.logger.debug("Getting list of available best practice guides");
            const guidesResult = await this.bestPracticesClient.getAvailableGuides();
            this.logger.timing(`get_available_best_practice_guides`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(guidesResult, null, 2),
                },
              ],
            };
            break;

          case "get_best_practice_guide":
            if (!args?.guideName) {
              throw new Error("guideName is required");
            }
            this.logger.debug(`Getting best practice guide: "${args.guideName}"`);
            const guideResult = await this.bestPracticesClient.getBestPracticeGuide(args.guideName as string);
            this.logger.timing(`get_best_practice_guide`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(guideResult, null, 2),
                },
              ],
            };
            break;

          case "search_best_practices":
            if (!args?.query) {
              throw new Error("query is required");
            }
            this.logger.debug(`Searching best practices for query: "${args.query}"`);
            const practicesResult = await this.bestPracticesClient.searchBestPractices(args.query as string);
            this.logger.timing(`search_best_practices`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(practicesResult, null, 2),
                },
              ],
            };
            break;

          case "get_hook_reference":
            if (!args?.guideName) {
              throw new Error("guideName is required");
            }
            this.logger.debug(`Getting hook reference for: "${args.guideName}"`);
            const hookResult = await this.bestPracticesClient.getHookReference(args.guideName as string);
            this.logger.timing(`get_hook_reference`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(hookResult, null, 2),
                },
              ],
            };
            break;

          // System Object Definition-related tools
          case "get_system_object_definitions":
            if (!this.ocapiClient) {
              throw new Error("OCAPI client not available. OAuth credentials (clientId and clientSecret) are required for system object definition tools.");
            }
            this.logger.debug(`Getting all system object definitions with start: ${args?.start || 0}, count: ${args?.count || 25}, select: ${args?.select || 'default'}`);
            const allSystemObjects = await this.ocapiClient.getSystemObjectDefinitions({
              start: args?.start as number,
              count: args?.count as number,
              select: args?.select as string
            });
            this.logger.timing(`get_system_object_definitions`, startTime);
            this.logger.debug(`Retrieved ${allSystemObjects.total || allSystemObjects.data?.length || 0} system object definitions`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allSystemObjects, null, 2),
                },
              ],
            };
            break;

          case "get_system_object_definition":
            if (!this.ocapiClient) {
              throw new Error("OCAPI client not available. OAuth credentials (clientId and clientSecret) are required for system object definition tools.");
            }
            if (!args?.objectType) {
              throw new Error("objectType is required");
            }
            this.logger.debug(`Getting system object definition for: "${args.objectType}"`);
            const systemObjectDef = await this.ocapiClient.getSystemObjectDefinition(args.objectType as string);
            this.logger.timing(`get_system_object_definition`, startTime);
            this.logger.debug(`Retrieved system object definition for "${args.objectType}" with ${systemObjectDef.attribute_definition_count || 0} attributes`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(systemObjectDef, null, 2),
                },
              ],
            };
            break;

          case "get_system_object_attribute_definitions":
            if (!this.ocapiClient) {
              throw new Error("OCAPI client not available. OAuth credentials (clientId and clientSecret) are required for system object definition tools.");
            }
            if (!args?.objectType) {
              throw new Error("objectType is required");
            }
            this.logger.debug(`Getting system object attribute definitions for: "${args.objectType}"`);
            const attributeDefsResult = await this.ocapiClient.getSystemObjectAttributeDefinitions(args.objectType as string, {
              start: args?.start as number,
              count: args?.count as number,
              select: args?.select as string
            });
            this.logger.timing(`get_system_object_attribute_definitions`, startTime);
            this.logger.debug(`Retrieved ${attributeDefsResult.length} attribute definitions for object type "${args.objectType}"`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(attributeDefsResult, null, 2),
                },
              ],
            };
            break;

          case "search_system_object_definitions":
            if (!this.ocapiClient) {
              throw new Error("OCAPI client not available. OAuth credentials (clientId and clientSecret) are required for system object definition tools.");
            }
            this.logger.debug(`Searching system object definitions with query: ${JSON.stringify(args?.query)}, start: ${args?.start || 0}, count: ${args?.count || 25}`);
            const searchRequest: any = {};

            if (args?.query) {
              searchRequest.query = args.query;
            }
            if (args?.sorts) {
              searchRequest.sorts = args.sorts;
            }
            if (args?.start !== undefined) {
              searchRequest.start = args.start;
            }
            if (args?.count !== undefined) {
              searchRequest.count = args.count;
            }
            if (args?.select) {
              searchRequest.select = args.select;
            }

            const searchSystemObjectsResult = await this.ocapiClient.searchSystemObjectDefinitions(searchRequest);
            this.logger.timing(`search_system_object_definitions`, startTime);
            this.logger.debug(`Found ${searchSystemObjectsResult.total || searchSystemObjectsResult.hits?.length || 0} matching system object definitions`);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(searchSystemObjectsResult, null, 2),
                },
              ],
            };
            break;

          default:
            this.logger.error(`Unknown tool requested: ${name}`);
            throw new Error(`Unknown tool: ${name}`);
        }

        // Log the full response in debug mode
        this.logger.debug(`Full response for ${name}:`, {
          contentType: result.content?.[0]?.type,
          contentLength: result.content?.[0]?.text?.length || 0,
          responsePreview: result.content?.[0]?.text?.substring(0, 200) + (result.content?.[0]?.text?.length > 200 ? '...' : ''),
          fullResponse: result.content?.[0]?.text,
        });

        return result;
      } catch (error) {
        this.logger.error(`Error handling tool "${name}":`, error);
        this.logger.timing(`${name}_error`, startTime);
        const errorResult = {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };

        // Log error response in debug mode
        this.logger.debug(`Error response for ${name}:`, errorResult);

        return errorResult;
      } finally {
        this.logger.methodExit(`handleToolRequest:${name}`);
      }
    });
  }

  /**
   * Start the MCP server
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.log("SFCC Development MCP server running on stdio");
  }
}
