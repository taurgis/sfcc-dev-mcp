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
  private logger: Logger;

  /**
   * Initialize the SFCC Development MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   */
  constructor(config: SFCCConfig) {
    this.logClient = new SFCCLogClient(config);
    this.docsClient = new SFCCDocumentationClient();
    this.bestPracticesClient = new SFCCBestPracticesClient();
    this.logger = new Logger("Server");
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

      try {
        switch (name) {
          // Log-related tools
          case "get_latest_errors":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.logClient.getLatestLogs("error", (args?.limit as number) || 10, args?.date as string),
                    null,
                    2
                  ),
                },
              ],
            };

          case "get_latest_warnings":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.logClient.getLatestLogs("warn", (args?.limit as number) || 10, args?.date as string),
                    null,
                    2
                  ),
                },
              ],
            };

          case "get_latest_info":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.logClient.getLatestLogs("info", (args?.limit as number) || 10, args?.date as string),
                    null,
                    2
                  ),
                },
              ],
            };

          case "summarize_logs":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.logClient.summarizeLogs(args?.date as string),
                    null,
                    2
                  ),
                },
              ],
            };

          case "search_logs":
            if (!args?.pattern) {
              throw new Error("Pattern is required for log search");
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.logClient.searchLogs(
                      args.pattern as string,
                      args.logLevel as LogLevel,
                      (args.limit as number) || 20,
                      args.date as string
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "list_log_files":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.logClient.listLogFiles(),
                    null,
                    2
                  ),
                },
              ],
            };

          // Documentation-related tools
          case "get_sfcc_class_info":
            if (!args?.className) {
              throw new Error("className is required");
            }
            const expand = args?.expand as boolean || false;
            const classDetails = await this.docsClient.getClassDetailsExpanded(args.className as string, expand);
            if (!classDetails) {
              throw new Error(`Class "${args.className}" not found`);
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(classDetails, null, 2),
                },
              ],
            };

          case "search_sfcc_classes":
            if (!args?.query) {
              throw new Error("query is required");
            }
            const searchResults = await this.docsClient.searchClasses(args.query as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(searchResults, null, 2),
                },
              ],
            };

          case "get_sfcc_class_methods":
            if (!args?.className) {
              throw new Error("className is required");
            }
            const methods = await this.docsClient.getClassMethods(args.className as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(methods, null, 2),
                },
              ],
            };

          case "get_sfcc_class_properties":
            if (!args?.className) {
              throw new Error("className is required");
            }
            const properties = await this.docsClient.getClassProperties(args.className as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(properties, null, 2),
                },
              ],
            };

          case "search_sfcc_methods":
            if (!args?.methodName) {
              throw new Error("methodName is required");
            }
            const methodResults = await this.docsClient.searchMethods(args.methodName as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(methodResults, null, 2),
                },
              ],
            };

          case "list_sfcc_classes":
            const allClasses = await this.docsClient.getAvailableClasses();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allClasses, null, 2),
                },
              ],
            };

          case "get_sfcc_class_documentation":
            if (!args?.className) {
              throw new Error("className is required");
            }
            const documentation = await this.docsClient.getClassDocumentation(args.className as string);
            if (!documentation) {
              throw new Error(`Documentation for class "${args.className}" not found`);
            }
            return {
              content: [
                {
                  type: "text",
                  text: documentation,
                },
              ],
            };

          // Best Practices-related tools
          case "get_available_best_practice_guides":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.bestPracticesClient.getAvailableGuides(),
                    null,
                    2
                  ),
                },
              ],
            };

          case "get_best_practice_guide":
            if (!args?.guideName) {
              throw new Error("guideName is required");
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.bestPracticesClient.getBestPracticeGuide(args.guideName as string),
                    null,
                    2
                  ),
                },
              ],
            };

          case "search_best_practices":
            if (!args?.query) {
              throw new Error("query is required");
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.bestPracticesClient.searchBestPractices(args.query as string),
                    null,
                    2
                  ),
                },
              ],
            };

          case "get_hook_reference":
            if (!args?.guideName) {
              throw new Error("guideName is required");
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.bestPracticesClient.getHookReference(args.guideName as string),
                    null,
                    2
                  ),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
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
