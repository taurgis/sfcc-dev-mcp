/**
 * MCP Server for SFCC Development
 *
 * This module implements the Model Context Protocol (MCP) server for accessing
 * Salesforce B2C Commerce Cloud development features. It provides a standardized interface
 * for AI assistants to interact with SFCC development tools and data.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SFCCConfig } from '../types/types.js';
import { SFCCLogClient } from '../clients/log-client.js';
import { SFCCDocumentationClient } from '../clients/docs-client.js';
import { SFCCBestPracticesClient } from '../clients/best-practices-client.js';
import { OCAPIClient } from '../clients/ocapi-client.js';
import { Logger } from '../utils/logger.js';
import { ConfigurationFactory } from '../config/configuration-factory.js';
import {
  SFCC_DOCUMENTATION_TOOLS,
  BEST_PRACTICES_TOOLS,
  LOG_TOOLS,
  SYSTEM_OBJECT_TOOLS,
} from './tool-definitions.js';

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
    this.logger = new Logger('Server', true, debug);
    this.logMethodEntry('constructor', { hostname: config.hostname, debug });

    this.capabilities = ConfigurationFactory.getCapabilities(config);
    this.initializeClients(config);
    this.initializeServer();
    this.setupToolHandlers();

    this.logMethodExit('constructor');
  }

  private initializeClients(config: SFCCConfig): void {
    // Always available clients
    this.docsClient = new SFCCDocumentationClient();
    this.bestPracticesClient = new SFCCBestPracticesClient();

    // Conditional clients based on capabilities
    if (this.capabilities.canAccessLogs) {
      this.logClient = new SFCCLogClient(config);
      this.logger.debug('Log client initialized');
    }

    if (this.capabilities.canAccessOCAPI) {
      this.ocapiClient = new OCAPIClient({
        hostname: config.hostname!,
        clientId: config.clientId!,
        clientSecret: config.clientSecret!,
        version: 'v23_2',
      });
      this.logger.debug('OCAPI client initialized');
    }
  }

  private initializeServer(): void {
    this.server = new Server(
      {
        name: 'SFCC Development MCP Server',
        version: '1.0.9',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );
  }

  private logMethodEntry(methodName: string, params?: any): void {
    this.logger.methodEntry(methodName, params);
  }

  private logMethodExit(methodName: string, result?: any): void {
    this.logger.methodExit(methodName, result);
  }

  /**
   * Helper method to validate client availability and throw consistent error messages
   */
  private validateClientAvailability(clientType: 'log' | 'ocapi'): void {
    if (clientType === 'log' && !this.logClient) {
      throw new Error('Log client not available. SFCC credentials are required for log analysis tools. Please provide hostname, username, and password via dw.json or environment variables.');
    }
    if (clientType === 'ocapi' && !this.ocapiClient) {
      throw new Error('OCAPI client not available. OAuth credentials (clientId and clientSecret) are required for system object definition tools.');
    }
  }

  /**
   * Helper method to create consistent response format
   */
  private createResponse(data: any, isText: boolean = true): any {
    return {
      content: [
        {
          type: 'text',
          text: isText ? JSON.stringify(data) : data,
        },
      ],
    };
  }

  /**
   * Helper method to handle tool execution with consistent logging and timing
   */
  private async executeToolHandler<T>(
    toolName: string,
    startTime: number,
    handler: () => Promise<T>,
    logMessage?: string,
  ): Promise<any> {
    if (logMessage) {
      this.logger.debug(logMessage);
    }
    const result = await handler();
    this.logger.timing(toolName, startTime);
    return this.createResponse(result);
  }

  /**
   * Handle log-related tools with common pattern
   */
  private async handleLogTool(
    toolName: string,
    args: any,
    startTime: number,
  ): Promise<any> {
    this.validateClientAvailability('log');

    const limit = (args?.limit as number) || (toolName === 'search_logs' ? 20 : 10);
    const date = args?.date as string;

    let logMessage: string;
    let result: any;

    switch (toolName) {
      case 'get_latest_errors':
      case 'get_latest_warnings':
      case 'get_latest_info':
      case 'get_latest_debug': {
        const level = toolName.replace('get_latest_', '') === 'warnings' ? 'warn' : toolName.replace('get_latest_', '');
        logMessage = `Fetching latest ${level} logs with limit: ${limit}, date: ${date || 'today'}`;
        result = await this.logClient!.getLatestLogs(level as any, limit, date);
        break;
      }
      case 'summarize_logs':
        logMessage = `Summarizing logs for date: ${date || 'today'}`;
        result = await this.logClient!.summarizeLogs(date);
        break;
      case 'search_logs':
        if (!args?.pattern) {throw new Error('Pattern is required for log search');}
        logMessage = `Searching logs for pattern: "${args.pattern}", logLevel: ${args.logLevel ?? 'all'}, limit: ${limit}`;
        result = await this.logClient!.searchLogs(args.pattern as string, args.logLevel, limit, date);
        break;
      case 'list_log_files':
        logMessage = 'Listing all available log files';
        result = await this.logClient!.listLogFiles();
        break;
      default:
        throw new Error(`Unknown log tool: ${toolName}`);
    }

    return this.executeToolHandler(toolName, startTime, async () => result, logMessage);
  }

  /**
   * Handle documentation-related tools with common pattern
   */
  private async handleDocsTool(toolName: string, args: any, startTime: number): Promise<any> {
    let logMessage: string;
    let result: any;

    switch (toolName) {
      case 'get_sfcc_class_info':
      {
        if (!args?.className) {
          throw new Error('className is required');
        }
        const expand = args?.expand as boolean ?? false;
        logMessage = `Getting class info for: "${args.className}", expand: ${expand}`;
        result = await this.docsClient.getClassDetailsExpanded(args.className as string, expand);
        if (!result) {throw new Error(`Class "${args.className}" not found`);}
        this.logger.debug(`Retrieved class info with ${result.methods?.length ?? 0} methods and ${result.properties?.length ?? 0} properties`);
        break;
      }
      case 'search_sfcc_classes':
        if (!args?.query) {throw new Error('query is required');}
        logMessage = `Searching SFCC classes for query: "${args.query}"`;
        result = await this.docsClient.searchClasses(args.query as string);
        this.logger.debug(`Found ${result.length} matching classes`);
        break;
      case 'get_sfcc_class_methods':
        if (!args?.className) {throw new Error('className is required');}
        logMessage = `Getting methods for class: "${args.className}"`;
        result = await this.docsClient.getClassMethods(args.className as string);
        this.logger.debug(`Retrieved ${result.length} methods for class "${args.className}"`);
        break;
      case 'get_sfcc_class_properties':
        if (!args?.className) {throw new Error('className is required');}
        logMessage = `Getting properties for class: "${args.className}"`;
        result = await this.docsClient.getClassProperties(args.className as string);
        this.logger.debug(`Retrieved ${result.length} properties for class "${args.className}"`);
        break;
      case 'search_sfcc_methods':
        if (!args?.methodName) {throw new Error('methodName is required');}
        logMessage = `Searching for methods with name: "${args.methodName}"`;
        result = await this.docsClient.searchMethods(args.methodName as string);
        this.logger.debug(`Found ${result.length} methods matching "${args.methodName}"`);
        break;
      case 'list_sfcc_classes':
        logMessage = 'Listing all available SFCC classes';
        result = await this.docsClient.getAvailableClasses();
        this.logger.debug(`Retrieved ${result.length} available classes`);
        break;
      case 'get_sfcc_class_documentation':
        if (!args?.className) {throw new Error('className is required');}
        logMessage = `Getting raw documentation for class: "${args.className}"`;
        result = await this.docsClient.getClassDocumentation(args.className as string);
        if (!result) {throw new Error(`Documentation for class "${args.className}" not found`);}
        this.logger.debug(`Retrieved documentation for "${args.className}" (${result.length} characters)`);
        return this.executeToolHandler(toolName, startTime, async () => result, logMessage);
      default:
        throw new Error(`Unknown docs tool: ${toolName}`);
    }

    return this.executeToolHandler(toolName, startTime, async () => result, logMessage);
  }

  /**
   * Handle best practices tools with common pattern
   */
  private async handleBestPracticesTool(toolName: string, args: any, startTime: number): Promise<any> {
    let logMessage: string;
    let result: any;

    switch (toolName) {
      case 'get_available_best_practice_guides':
        logMessage = 'Getting list of available best practice guides';
        result = await this.bestPracticesClient.getAvailableGuides();
        break;
      case 'get_best_practice_guide':
        if (!args?.guideName) {throw new Error('guideName is required');}
        logMessage = `Getting best practice guide: "${args.guideName}"`;
        result = await this.bestPracticesClient.getBestPracticeGuide(args.guideName as string);
        break;
      case 'search_best_practices':
        if (!args?.query) {throw new Error('query is required');}
        logMessage = `Searching best practices for query: "${args.query}"`;
        result = await this.bestPracticesClient.searchBestPractices(args.query as string);
        break;
      case 'get_hook_reference':
        if (!args?.guideName) {throw new Error('guideName is required');}
        logMessage = `Getting hook reference for: "${args.guideName}"`;
        result = await this.bestPracticesClient.getHookReference(args.guideName as string);
        break;
      default:
        throw new Error(`Unknown best practices tool: ${toolName}`);
    }

    return this.executeToolHandler(toolName, startTime, async () => result, logMessage);
  }

  /**
   * Handle system object tools with common pattern
   */
  private async handleSystemObjectTool(toolName: string, args: any, startTime: number): Promise<any> {
    this.validateClientAvailability('ocapi');

    let logMessage: string;
    let result: any;

    switch (toolName) {
      case 'get_system_object_definitions':
        logMessage = `Getting all system object definitions with start: ${args?.start ?? 0}, count: ${args?.count ?? 200}, select: ${args?.select ?? '(**)'}`;
        result = await this.ocapiClient?.getSystemObjectDefinitions({
          start: args?.start as number,
          count: args?.count as number,
          select: args?.select as string,
        });
        this.logger.debug(`Retrieved ${(result.total ?? result.data?.length) ?? 0} system object definitions`);
        break;
      case 'get_system_object_definition':
        if (!args?.objectType) {throw new Error('objectType is required');}
        logMessage = `Getting system object definition for: "${args.objectType}"`;
        result = await this.ocapiClient?.getSystemObjectDefinition(args.objectType as string);
        this.logger.debug(`Retrieved system object definition for "${args.objectType}" with ${result.attribute_definition_count ?? 0} attributes`);
        break;
      case 'get_system_object_attribute_definitions':
        if (!args?.objectType) {throw new Error('objectType is required');}
        logMessage = `Getting system object attribute definitions for: "${args.objectType}"`;
        result = await this.ocapiClient?.getSystemObjectAttributeDefinitions(args.objectType as string, {
          start: args?.start as number,
          count: args?.count as number,
          select: args?.select as string,
        });
        this.logger.debug(`Retrieved ${result.length} attribute definitions for object type "${args.objectType}"`);
        break;
      case 'search_system_object_attribute_definitions':
        if (!args?.objectType) {throw new Error('objectType is required');}
        if (!args?.searchRequest) {throw new Error('searchRequest is required');}
        logMessage = `Searching attribute definitions for object type: "${args.objectType}"`;
        result = await this.ocapiClient?.searchSystemObjectAttributeDefinitions(
          args.objectType as string,
          args.searchRequest,
        );
        this.logger.debug(`Found ${result.total ?? result.hits?.length ?? 0} matching attribute definitions for object type "${args.objectType}"`);
        break;
      case 'search_site_preferences':
        if (!args?.groupId) {throw new Error('groupId is required');}
        if (!args?.instanceType) {throw new Error('instanceType is required');}
        if (!args?.searchRequest) {throw new Error('searchRequest is required');}
        logMessage = `Searching site preferences for group: "${args.groupId}", instance: "${args.instanceType}"`;
        result = await this.ocapiClient?.searchSitePreferences(
          args.groupId as string,
          args.instanceType as 'staging' | 'development' | 'sandbox' | 'production',
          args.searchRequest,
          args.options,
        );
        this.logger.debug(`Found ${result.total ?? result.hits?.length ?? 0} matching site preferences for group "${args.groupId}" in ${args.instanceType} instance`);
        break;
      case 'search_system_object_attribute_groups':
        if (!args?.objectType) {throw new Error('objectType is required');}
        if (!args?.searchRequest) {throw new Error('searchRequest is required');}
        logMessage = `Searching attribute groups for object type: "${args.objectType}"`;
        result = await this.ocapiClient?.searchSystemObjectAttributeGroups(
          args.objectType as string,
          args.searchRequest,
        );
        this.logger.debug(`Found ${result.total ?? result.hits?.length ?? 0} matching attribute groups for object type "${args.objectType}"`);
        break;
      default:
        throw new Error(`Unknown system object tool: ${toolName}`);
    }

    return this.executeToolHandler(toolName, startTime, async () => result, logMessage);
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

        // Route to appropriate handler based on tool category
        if (['get_latest_errors', 'get_latest_warnings', 'get_latest_info', 'get_latest_debug',
          'summarize_logs', 'search_logs', 'list_log_files'].includes(name)) {
          result = await this.handleLogTool(name, args, startTime);
        } else if (['get_sfcc_class_info', 'search_sfcc_classes', 'get_sfcc_class_methods',
          'get_sfcc_class_properties', 'search_sfcc_methods', 'list_sfcc_classes',
          'get_sfcc_class_documentation'].includes(name)) {
          result = await this.handleDocsTool(name, args, startTime);
        } else if (['get_available_best_practice_guides', 'get_best_practice_guide',
          'search_best_practices', 'get_hook_reference'].includes(name)) {
          result = await this.handleBestPracticesTool(name, args, startTime);
        } else if (['get_system_object_definitions', 'get_system_object_definition',
          'get_system_object_attribute_definitions', 'search_system_object_attribute_definitions',
          'search_site_preferences', 'search_system_object_attribute_groups'].includes(name)) {
          result = await this.handleSystemObjectTool(name, args, startTime);
        } else {
          this.logger.error(`Unknown tool requested: ${name}`);
          throw new Error(`Unknown tool: ${name}`);
        }

        // Log the full response in debug mode
        this.logger.debug(`Full response for ${name}:`, {
          contentType: result.content?.[0]?.type,
          contentLength: result.content?.[0]?.text?.length ?? 0,
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
              type: 'text',
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
    this.logger.log('SFCC Development MCP server running on stdio');
  }
}
