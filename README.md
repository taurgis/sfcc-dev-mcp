# SFCC Development MCP Server

An MCP (Model Context Protocol) server that provides comprehensive access to Salesforce B2C Commerce Cloud development features. This allows AI agents to assist with SFCC development tasks including log analysis, debugging, monitoring, and more.

## Features

### Log Analysis & Monitoring
- **Get Latest Errors**: Retrieve the most recent error messages from SFCC logs
- **Get Latest Warnings**: Fetch recent warning messages
- **Get Latest Info**: Access recent info-level log entries  
- **Summarize Logs**: Get an overview of log activity with error counts and key issues
- **Search Logs**: Search for specific patterns across log files
- **List Log Files**: View available log files with metadata

### Future Development Features
This server is designed to be extensible and will support additional SFCC development assistance features such as:
- Code analysis and suggestions
- Cartridge dependency management
- Business Manager configuration assistance
- Performance optimization recommendations
- And more...

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration with AI Assistants

### GitHub Copilot Configuration

To use this MCP server with GitHub Copilot, add it to your MCP settings:

1. Open your GitHub Copilot settings
2. Navigate to the MCP servers configuration
3. Add a new server entry:

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": [
        "/path/to/sfcc-dev-mcp/dist/index.js",
        "--hostname", "your-instance.dx.commercecloud.salesforce.com",
        "--username", "your-username",
        "--password", "your-password"
      ],
      "env": {}
    }
  }
}
```

For OAuth authentication, use:
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": [
        "/path/to/sfcc-dev-mcp/dist/index.js",
        "--hostname", "your-instance.dx.commercecloud.salesforce.com",
        "--api-key", "your-api-key",
        "--api-secret", "your-api-secret"
      ],
      "env": {}
    }
  }
}
```

### Claude Desktop Configuration

To use this MCP server with Claude Desktop, edit your `claude_desktop_config.json` file:

**Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Configuration with Basic Auth:**
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": [
        "/absolute/path/to/sfcc-dev-mcp/dist/index.js",
        "--hostname", "your-instance.dx.commercecloud.salesforce.com",
        "--username", "your-username",
        "--password", "your-password"
      ]
    }
  }
}
```

**Configuration with OAuth:**
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": [
        "/absolute/path/to/sfcc-dev-mcp/dist/index.js",
        "--hostname", "your-instance.dx.commercecloud.salesforce.com",
        "--api-key", "your-api-key",
        "--api-secret", "your-api-secret"
      ]
    }
  }
}
```

**Important Notes:**
- Use absolute paths in the configuration
- Replace `your-instance.dx.commercecloud.salesforce.com` with your actual SFCC hostname
- Replace credentials with your actual SFCC credentials
- Restart Claude Desktop after making configuration changes

### Environment Variables (Recommended)

For better security, you can use environment variables for credentials:

1. Create a `.env` file in your project directory:
```bash
SFCC_HOSTNAME=your-instance.dx.commercecloud.salesforce.com
SFCC_USERNAME=your-username
SFCC_PASSWORD=your-password
# OR for OAuth:
# SFCC_API_KEY=your-api-key
# SFCC_API_SECRET=your-api-secret
```

2. Modify your configuration to use environment variables:
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": [
        "/absolute/path/to/sfcc-dev-mcp/dist/index.js",
        "--hostname", "${SFCC_HOSTNAME}",
        "--username", "${SFCC_USERNAME}",
        "--password", "${SFCC_PASSWORD}"
      ],
      "env": {
        "SFCC_HOSTNAME": "your-instance.dx.commercecloud.salesforce.com",
        "SFCC_USERNAME": "your-username",
        "SFCC_PASSWORD": "your-password"
      }
    }
  }
}
```

## Usage

### Using dw.json Configuration (Recommended)

The easiest way to configure the server is using an existing `dw.json` file from your SFCC project:

```bash
node dist/index.js --dw-json ./dw.json
```

**Example dw.json file:**
```json
{
    "hostname": "zzxx-006.sandbox.us03.dx.commercecloud.salesforce.com",
    "username": "user@forward.eu",
    "password": "your-password",
    "code-version": "SFRA_AP_01_24_2024",
    "client-id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "client-secret": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

**Required fields in dw.json:**
- `hostname`: Your SFCC instance hostname
- `username`: Your SFCC username  
- `password`: Your SFCC password

**Optional fields:**
- `client-id` and `client-secret`: If present, these will be used as API credentials for OAuth authentication
- `code-version`: Not used by the MCP server but commonly present in SFCC projects

### Manual Configuration

Alternatively, you can specify credentials directly via command-line arguments:

### Basic Authentication
```bash
node dist/index.js --hostname your-instance.dx.commercecloud.salesforce.com --username your-username --password your-password
```

### OAuth Authentication (API Key/Secret)
```bash
node dist/index.js --hostname your-instance.dx.commercecloud.salesforce.com --api-key your-api-key --api-secret your-api-secret
```

### Development Mode
```bash
npm run dev -- --dw-json ./dw.json
```

**Note:** When using `--dw-json`, it takes precedence over individual command-line options.

## Configuration

The server requires the following parameters:

- `--hostname`: Your SFCC instance hostname (e.g., `zziu-006.dx.commercecloud.salesforce.com`)
- Authentication (choose one):
  - `--username` and `--password`: For basic authentication
  - `--api-key` and `--api-secret`: For OAuth authentication

## MCP Tools

### Log Analysis Tools

### get_latest_errors
Get the latest error messages from SFCC logs.

**Parameters:**
- `limit` (number, optional): Number of entries to return (default: 10)
- `date` (string, optional): Date in YYYYMMDD format (default: today)

### get_latest_warnings
Get the latest warning messages from SFCC logs.

**Parameters:**
- `limit` (number, optional): Number of entries to return (default: 10)
- `date` (string, optional): Date in YYYYMMDD format (default: today)

### get_latest_info
Get the latest info messages from SFCC logs.

**Parameters:**
- `limit` (number, optional): Number of entries to return (default: 10)
- `date` (string, optional): Date in YYYYMMDD format (default: today)

### summarize_logs
Provide a summary of log activity including error counts and key issues.

**Parameters:**
- `date` (string, optional): Date in YYYYMMDD format (default: today)

### search_logs
Search for specific patterns in the logs.

**Parameters:**
- `pattern` (string, required): Search pattern or keyword
- `logLevel` (string, optional): Log level to search in (error, warn, info)
- `limit` (number, optional): Number of matching entries to return (default: 20)
- `date` (string, optional): Date in YYYYMMDD format (default: today)

### list_log_files
List all available log files with metadata.

**Parameters:** None

## Log File Format

The server expects SFCC log files in the standard format:
- Filename pattern: `{level}-{pod}-{server}-{date}.log`
- Example: `error-odspod-0-appserver-20250807.log`

Log entries are parsed based on the GMT timestamp and log level format:
```
[2025-08-07 07:23:30.552 GMT] ERROR main system.core - - - - 1084480730520973312 - Error message here
```

## WebDAV Access

The server connects to the SFCC WebDAV endpoint for various development features:
```
https://{hostname}/on/demandware.servlet/webdav/Sites/
```

Ensure your credentials have appropriate permissions to access the required directories.

## Troubleshooting

1. **Authentication Errors**: Verify your credentials and ensure they have WebDAV access permissions
2. **Connection Issues**: Check the hostname format and network connectivity
3. **No Data Found**: Ensure the date format is correct and data exists for the specified date
4. **Permission Denied**: Verify your user account has access to the required WebDAV directories

## Development

To modify or extend the server:

1. Edit the TypeScript source files in the `src/` directory
2. Build with `npm run build`
3. Test with `npm run dev`

The server is designed to be modular and extensible. New SFCC development features can be easily added by:
- Adding new tool definitions in `server.ts`
- Implementing the corresponding functionality
- Following the established patterns for authentication and WebDAV access

## License

ISC
