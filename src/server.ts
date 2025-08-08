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

/**
 * MCP Server implementation for SFCC development assistance
 *
 * This class sets up the MCP server, defines available tools, and handles
 * requests from MCP clients (like AI assistants) to interact with SFCC development features.
 */
export class SFCCLogsServer {
  private server: Server;
  private logClient: SFCCLogClient;

  /**
   * Initialize the SFCC Logs MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   */
  constructor(config: SFCCConfig) {
    this.logClient = new SFCCLogClient(config);
    this.server = new Server(
      {
        name: "sfcc-logs-server",
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
   * Set up MCP tool handlers for log operations
   * Defines all available tools and their request/response handling
   *
   * @private
   */
  private setupToolHandlers(): void {
    // Define available tools for the MCP client
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_latest_errors",
          description: "Get the latest error messages from SFCC logs",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Number of error entries to return (default: 10)",
                default: 10,
              },
              date: {
                type: "string",
                description: "Date in YYYYMMDD format (default: today)",
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
              limit: {
                type: "number",
                description: "Number of warning entries to return (default: 10)",
                default: 10,
              },
              date: {
                type: "string",
                description: "Date in YYYYMMDD format (default: today)",
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
              limit: {
                type: "number",
                description: "Number of info entries to return (default: 10)",
                default: 10,
              },
              date: {
                type: "string",
                description: "Date in YYYYMMDD format (default: today)",
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
                description: "Log level to search in (error, warn, info)",
                enum: ["error", "warn", "info"],
              },
              limit: {
                type: "number",
                description: "Number of matching entries to return (default: 20)",
                default: 20,
              },
              date: {
                type: "string",
                description: "Date in YYYYMMDD format (default: today)",
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
      ],
    }));

    // Handle tool execution requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_latest_errors":
            return await this.handleGetLatestLogs("error", args);
          case "get_latest_warnings":
            return await this.handleGetLatestLogs("warn", args);
          case "get_latest_info":
            return await this.handleGetLatestLogs("info", args);
          case "summarize_logs":
            return await this.handleSummarizeLogs(args);
          case "search_logs":
            return await this.handleSearchLogs(args);
          case "list_log_files":
            return await this.handleListLogFiles();
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
        };
      }
    });
  }

  /**
   * Handle requests for latest logs of a specific level
   *
   * @param level - Log level to fetch
   * @param args - Request arguments containing limit and date
   * @returns MCP response with log content
   * @private
   */
  private async handleGetLatestLogs(level: LogLevel, args: any) {
    const limit = args?.limit || 10;
    const date = args?.date;
    const result = await this.logClient.getLatestLogs(level, limit, date);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  /**
   * Handle log summarization requests
   *
   * @param args - Request arguments containing date
   * @returns MCP response with log summary
   * @private
   */
  private async handleSummarizeLogs(args: any) {
    const date = args?.date;
    const result = await this.logClient.summarizeLogs(date);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  /**
   * Handle log search requests
   *
   * @param args - Request arguments containing pattern, logLevel, limit, and date
   * @returns MCP response with search results
   * @private
   */
  private async handleSearchLogs(args: any) {
    const pattern = args?.pattern;
    const logLevel = args?.logLevel as LogLevel | undefined;
    const limit = args?.limit || 20;
    const date = args?.date;

    if (!pattern) {
      throw new Error("Search pattern is required");
    }

    const result = await this.logClient.searchLogs(pattern, logLevel, limit, date);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  /**
   * Handle log file listing requests
   *
   * @returns MCP response with log file list
   * @private
   */
  private async handleListLogFiles() {
    const result = await this.logClient.listLogFiles();

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  /**
   * Start the MCP server
   * Connects to stdio transport and begins handling requests
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("SFCC Logs MCP server running on stdio");
  }
}
