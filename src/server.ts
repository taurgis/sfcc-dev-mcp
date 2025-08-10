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
import { ConfigurationFactory } from "./configuration-factory.js";
import { SERVER_INFO } from "./constants.js";
import {
  SFCC_DOCUMENTATION_TOOLS,
  BEST_PRACTICES_TOOLS,
  LOG_TOOLS,
  SYSTEM_OBJECT_TOOLS
} from "./tool-definitions.js";

/**
 * MCP Server implementation for SFCC development assistance
 *
 * This class sets up the MCP server, defines available tools, and handles
 * requests from MCP clients (like AI assistants) to interact with SFCC development features.
 */
export class SFCCDevServer {
  private server!: Server;
  private logClient: SFCCLogClient | null = null;
  private docsClient!: SFCCDocumentationClient;
  private bestPracticesClient!: SFCCBestPracticesClient;
  private ocapiClient: OCAPIClient | null = null;
  private logger: Logger;
  private capabilities: ReturnType<typeof ConfigurationFactory.getCapabilities>;

  /**
   * Initialize the SFCC Development MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   * @param debug - Whether to enable debug logging (default: true)
   */
  constructor(config: SFCCConfig, debug: boolean = false) {
    this.logger = new Logger("Server", true, debug);
    this.logMethodEntry("constructor", { hostname: config.hostname, debug });

    this.capabilities = ConfigurationFactory.getCapabilities(config);
    this.initializeClients(config);
    this.initializeServer();
    this.setupToolHandlers();

    this.logMethodExit("constructor");
  }

  private initializeClients(config: SFCCConfig): void {
    // Always available clients
    this.docsClient = new SFCCDocumentationClient();
    this.bestPracticesClient = new SFCCBestPracticesClient();

    // Conditional clients based on capabilities
    if (this.capabilities.canAccessLogs) {
      this.logClient = new SFCCLogClient(config);
      this.logger.debug("Log client initialized");
    }

    if (this.capabilities.canAccessOCAPI) {
      this.ocapiClient = new OCAPIClient({
        hostname: config.hostname,
        clientId: config.clientId!,
        clientSecret: config.clientSecret!,
        version: "v23_2"
      });
      this.logger.debug("OCAPI client initialized");
    }
  }

  private initializeServer(): void {
    this.server = new Server(
      {
        name: SERVER_INFO.NAME,
        version: SERVER_INFO.VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  private logMethodEntry(methodName: string, params?: any): void {
    this.logger.methodEntry(methodName, params);
  }

  private logMethodExit(methodName: string, result?: any): void {
    this.logger.methodExit(methodName, result);
  }

  /**
   * Set up MCP tool handlers for SFCC operations
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];

      // Always available tools
      tools.push(...SFCC_DOCUMENTATION_TOOLS);
      tools.push(...BEST_PRACTICES_TOOLS);

      // Conditional tools based on available clients
      if (this.logClient) {
        tools.push(...LOG_TOOLS);
      }

      if (this.ocapiClient) {
        tools.push(...SYSTEM_OBJECT_TOOLS);
      }

      return { tools };
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
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
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
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
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
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
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

          case "get_latest_debug":
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
            this.logger.debug(`Fetching latest debug logs with limit: ${(args?.limit as number) || 10}, date: ${args?.date || 'today'}`);
            const debugResult = await this.logClient.getLatestLogs("debug", (args?.limit as number) || 10, args?.date as string);
            this.logger.timing(`get_latest_debug`, startTime);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(debugResult, null, 2),
                },
              ],
            };
            break;

          case "summarize_logs":
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
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
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
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
            if (!this.logClient) {
              throw new Error("Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.");
            }
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
