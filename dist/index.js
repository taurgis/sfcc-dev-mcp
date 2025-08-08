#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "webdav";
import { Command } from "commander";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
class SFCCLogsServer {
    server;
    config;
    webdavClient;
    constructor(config) {
        this.config = config;
        this.server = new Server({
            name: "sfcc-logs-server",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupWebDAVClient();
        this.setupToolHandlers();
    }
    setupWebDAVClient() {
        const webdavUrl = `https://${this.config.hostname}/on/demandware.servlet/webdav/Sites/Logs/`;
        let authConfig = {};
        if (this.config.username && this.config.password) {
            // Basic authentication
            authConfig = {
                username: this.config.username,
                password: this.config.password,
            };
        }
        else if (this.config.apiKey && this.config.apiSecret) {
            // OAuth authentication (using API key as username and secret as password for WebDAV)
            authConfig = {
                username: this.config.apiKey,
                password: this.config.apiSecret,
            };
        }
        else {
            throw new Error("Either username/password or apiKey/apiSecret must be provided");
        }
        this.webdavClient = createClient(webdavUrl, authConfig);
    }
    setupToolHandlers() {
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
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case "get_latest_errors":
                        return await this.getLatestLogs("error", args?.limit || 10, args?.date);
                    case "get_latest_warnings":
                        return await this.getLatestLogs("warn", args?.limit || 10, args?.date);
                    case "get_latest_info":
                        return await this.getLatestLogs("info", args?.limit || 10, args?.date);
                    case "summarize_logs":
                        return await this.summarizeLogs(args?.date);
                    case "search_logs":
                        return await this.searchLogs(args?.pattern, args?.logLevel, args?.limit || 20, args?.date);
                    case "list_log_files":
                        return await this.listLogFiles();
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
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
    async getLogFiles(date) {
        const targetDate = date || this.getCurrentDate();
        const contents = await this.webdavClient.getDirectoryContents("/");
        return contents
            .filter((item) => item.type === "file" &&
            item.filename.includes(targetDate) &&
            item.filename.endsWith(".log"))
            .map((item) => item.filename);
    }
    async getLatestLogs(level, limit, date) {
        const targetDate = date || this.getCurrentDate();
        const logFiles = await this.getLogFiles(targetDate);
        // Fix the filtering logic to handle paths that start with "/" and match the level
        const levelFiles = logFiles.filter(file => {
            const filename = file.startsWith('/') ? file.substring(1) : file;
            return filename.startsWith(level + '-');
        });
        if (levelFiles.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No ${level} log files found for date ${targetDate}. Available files: ${logFiles.map(f => f.replace('/', '')).join(', ')}`,
                    },
                ],
            };
        }
        // Get the most recent log file (sort by filename, latest timestamp should be last)
        const latestFile = levelFiles.sort().pop();
        const logContent = await this.webdavClient.getFileContents(latestFile, { format: "text" });
        const logEntries = this.parseLogEntries(logContent, level.toUpperCase());
        const latestEntries = logEntries.slice(-limit).reverse();
        return {
            content: [
                {
                    type: "text",
                    text: `Latest ${limit} ${level} messages from ${latestFile?.replace('/', '')}:\n\n${latestEntries.join('\n\n---\n\n')}`,
                },
            ],
        };
    }
    async summarizeLogs(date) {
        const targetDate = date || this.getCurrentDate();
        const logFiles = await this.getLogFiles(targetDate);
        if (logFiles.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No log files found for date ${targetDate}`,
                    },
                ],
            };
        }
        const summary = {
            date: targetDate,
            errorCount: 0,
            warningCount: 0,
            infoCount: 0,
            keyIssues: [],
            files: logFiles,
        };
        // Count errors and warnings
        for (const file of logFiles) {
            try {
                const content = await this.webdavClient.getFileContents(file, { format: "text" });
                const lines = content.split('\n');
                for (const line of lines) {
                    if (line.includes(' ERROR '))
                        summary.errorCount++;
                    if (line.includes(' WARN '))
                        summary.warningCount++;
                    if (line.includes(' INFO '))
                        summary.infoCount++;
                }
                // Extract key error patterns - fix the file path checking
                const filename = file.startsWith('/') ? file.substring(1) : file;
                if (filename.startsWith('error-')) {
                    const errors = this.parseLogEntries(content, 'ERROR');
                    const uniqueErrors = this.extractUniqueErrors(errors);
                    summary.keyIssues.push(...uniqueErrors);
                }
            }
            catch (error) {
                console.error(`Error reading file ${file}:`, error);
            }
        }
        // Deduplicate key issues
        summary.keyIssues = [...new Set(summary.keyIssues)];
        return {
            content: [
                {
                    type: "text",
                    text: `Log Summary for ${targetDate}:\n\n` +
                        `📊 Counts:\n` +
                        `- Errors: ${summary.errorCount}\n` +
                        `- Warnings: ${summary.warningCount}\n` +
                        `- Info: ${summary.infoCount}\n\n` +
                        `📁 Log Files (${summary.files.length}):\n` +
                        `${summary.files.map((f) => `- ${f}`).join('\n')}\n\n` +
                        `🔥 Key Issues:\n` +
                        `${summary.keyIssues.length > 0 ? summary.keyIssues.map((issue) => `- ${issue}`).join('\n') : 'No major issues detected'}`,
                },
            ],
        };
    }
    async searchLogs(pattern, logLevel, limit = 20, date) {
        const targetDate = date || this.getCurrentDate();
        const logFiles = await this.getLogFiles(targetDate);
        let filesToSearch = logFiles;
        if (logLevel) {
            // Fix the search filtering to handle paths with "/" and match level pattern
            filesToSearch = logFiles.filter(file => {
                const filename = file.startsWith('/') ? file.substring(1) : file;
                return filename.startsWith(logLevel + '-');
            });
        }
        const matchingEntries = [];
        for (const file of filesToSearch) {
            try {
                const content = await this.webdavClient.getFileContents(file, { format: "text" });
                const lines = content.split('\n');
                for (const line of lines) {
                    if (line.toLowerCase().includes(pattern.toLowerCase()) && matchingEntries.length < limit) {
                        matchingEntries.push(`[${file.replace('/', '')}] ${line.trim()}`);
                    }
                }
            }
            catch (error) {
                console.error(`Error searching file ${file}:`, error);
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: matchingEntries.length > 0
                        ? `Found ${matchingEntries.length} matches for "${pattern}":\n\n${matchingEntries.join('\n\n')}`
                        : `No matches found for "${pattern}" in logs for ${targetDate}`,
                },
            ],
        };
    }
    async listLogFiles() {
        try {
            const contents = await this.webdavClient.getDirectoryContents("/");
            const logFiles = contents
                .filter((item) => item.type === "file" && item.filename.endsWith(".log"))
                .map((item) => ({
                name: item.filename,
                size: item.size,
                lastModified: item.lastmod,
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: `Available log files:\n\n${logFiles.map((file) => `📄 ${file.name}\n   Size: ${this.formatBytes(file.size)}\n   Modified: ${file.lastModified}`).join('\n\n')}`,
                    },
                ],
            };
        }
        catch (error) {
            throw new Error(`Failed to list log files: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    parseLogEntries(content, level) {
        const lines = content.split('\n');
        const entries = [];
        let currentEntry = '';
        for (const line of lines) {
            if (line.includes(`] ${level} `) && line.includes('GMT]')) {
                if (currentEntry) {
                    entries.push(currentEntry.trim());
                }
                currentEntry = line;
            }
            else if (currentEntry && line.trim()) {
                currentEntry += '\n' + line;
            }
        }
        if (currentEntry) {
            entries.push(currentEntry.trim());
        }
        return entries;
    }
    extractUniqueErrors(errors) {
        const patterns = new Set();
        for (const error of errors) {
            // Extract main error message after the class name
            const match = error.match(/] ERROR [^-]+ - (.+?)(?:\n|$)/);
            if (match) {
                patterns.add(match[1].trim());
            }
        }
        return Array.from(patterns).slice(0, 10); // Limit to top 10 unique errors
    }
    getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("SFCC Logs MCP server running on stdio");
    }
}
function loadDwJsonConfig(dwJsonPath) {
    const resolvedPath = resolve(dwJsonPath);
    if (!existsSync(resolvedPath)) {
        throw new Error(`dw.json file not found at: ${resolvedPath}`);
    }
    try {
        const dwJsonContent = readFileSync(resolvedPath, 'utf-8');
        const dwConfig = JSON.parse(dwJsonContent);
        // Validate required fields
        if (!dwConfig.hostname || !dwConfig.username || !dwConfig.password) {
            throw new Error('dw.json must contain hostname, username, and password fields');
        }
        // Map dw.json config to SFCCConfig
        const config = {
            hostname: dwConfig.hostname,
            username: dwConfig.username,
            password: dwConfig.password,
        };
        // If client-id and client-secret are present, use them as API credentials
        if (dwConfig["client-id"] && dwConfig["client-secret"]) {
            config.apiKey = dwConfig["client-id"];
            config.apiSecret = dwConfig["client-secret"];
        }
        return config;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in dw.json file: ${error.message}`);
        }
        throw error;
    }
}
async function main() {
    const program = new Command();
    program
        .name("sfcc-logs-mcp")
        .description("MCP server for Salesforce B2C Commerce Cloud logs")
        .option("--dw-json <path>", "Path to dw.json file (alternative to individual options)")
        .option("--hostname <hostname>", "SFCC hostname (e.g., zziu-006.dx.commercecloud.salesforce.com)")
        .option("--username <username>", "Username for basic authentication")
        .option("--password <password>", "Password for basic authentication")
        .option("--api-key <apiKey>", "API key for OAuth authentication")
        .option("--api-secret <apiSecret>", "API secret for OAuth authentication");
    program.parse();
    const options = program.opts();
    let config;
    // Priority: dw.json file takes precedence over individual options
    if (options.dwJson) {
        try {
            config = loadDwJsonConfig(options.dwJson);
            console.error(`✅ Loaded configuration from: ${resolve(options.dwJson)}`);
        }
        catch (error) {
            console.error(`❌ Error loading dw.json: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
    else {
        // Fall back to individual command-line options
        if (!options.hostname) {
            console.error("Error: Either --dw-json or --hostname is required");
            process.exit(1);
        }
        if ((!options.username || !options.password) && (!options.apiKey || !options.apiSecret)) {
            console.error("Error: Either --username/--password or --api-key/--api-secret must be provided");
            process.exit(1);
        }
        config = {
            hostname: options.hostname,
            username: options.username,
            password: options.password,
            apiKey: options.apiKey,
            apiSecret: options.apiSecret,
        };
    }
    const server = new SFCCLogsServer(config);
    await server.run();
}
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map