# SFCC Development MCP Server

An MCP (Model Context Protocol) server that provides comprehensive access to Salesforce B2C Commerce Cloud development features. This allows AI agents to assist with SFCC development tasks including log analysis, debugging, monitoring, and **SFCC documentation querying**.

## Features

### SFCC Documentation Querying
- **Get Class Information**: Retrieve detailed information about any SFCC class including properties, methods, and descriptions
- **Search Classes**: Find SFCC classes by name with partial matching
- **Get Class Methods**: List all methods for a specific SFCC class with signatures
- **Get Class Properties**: List all properties for a specific SFCC class with types and modifiers
- **Search Methods**: Find methods across all SFCC classes by name
- **List All Classes**: Get a complete list of available SFCC classes
- **Get Raw Documentation**: Access the complete Markdown documentation for any class

### Log Analysis & Monitoring
- **Get Latest Errors**: Retrieve the most recent error messages from SFCC logs
- **Get Latest Warnings**: Fetch recent warning messages
- **Get Latest Info**: Access recent info-level log entries  
- **Summarize Logs**: Get an overview of log activity with error counts and key issues
- **Search Logs**: Search for specific patterns across log files
- **List Log Files**: View available log files with metadata

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Configuration

### Using dw.json (Recommended)

The server supports the standard SFCC `dw.json` configuration format used by Commerce Cloud development tools. Create a `dw.json` file in your project root:

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret",
  "code-version": "version1"
}
```

**Required fields:**
- `hostname`: Your SFCC instance hostname
- `username`: Your SFCC username
- `password`: Your SFCC password

**Optional fields:**
- `client-id`: OAuth client ID (for API access)
- `client-secret`: OAuth client secret (for API access)
- `code-version`: Code version to use

### Using Environment Variables

Alternatively, you can configure the server using environment variables:

```bash
export SFCC_HOSTNAME="your-instance.sandbox.us01.dx.commercecloud.salesforce.com"
export SFCC_USERNAME="your-username"
export SFCC_PASSWORD="your-password"
export SFCC_CLIENT_ID="your-client-id"
export SFCC_CLIENT_SECRET="your-client-secret"
export SFCC_SITE_ID="RefArch"
```

## Usage

### Starting the Server

```bash
# Using npm
npm start

# Or directly with node
node build/main.js
```

### MCP Client Configuration

Add this server to your MCP client configuration. For example, in Claude Desktop's config:

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": ["/path/to/sfcc-dev-mcp/build/main.js"],
      "cwd": "/path/to/sfcc-dev-mcp"
    }
  }
}
```

## Available Tools

### SFCC Documentation Tools

1. **`get_sfcc_class_info`** - Get comprehensive information about an SFCC class
   ```json
   {
     "className": "Catalog"
   }
   ```

2. **`search_sfcc_classes`** - Search for classes by name
   ```json
   {
     "query": "product"
   }
   ```

3. **`get_sfcc_class_methods`** - Get all methods for a class
   ```json
   {
     "className": "dw.catalog.Product"
   }
   ```

4. **`get_sfcc_class_properties`** - Get all properties for a class
   ```json
   {
     "className": "dw.catalog.Catalog"
   }
   ```

5. **`search_sfcc_methods`** - Find methods across all classes
   ```json
   {
     "methodName": "getPrice"
   }
   ```

6. **`list_sfcc_classes`** - List all available SFCC classes

7. **`get_sfcc_class_documentation`** - Get raw documentation
   ```json
   {
     "className": "dw.catalog.Product"
   }
   ```

### Log Analysis Tools

1. **`get_latest_errors`** - Get recent error messages
2. **`get_latest_warnings`** - Get recent warning messages  
3. **`get_latest_info`** - Get recent info messages
4. **`summarize_logs`** - Get log summary with counts
5. **`search_logs`** - Search for patterns in logs
6. **`list_log_files`** - List available log files

## Example AI Assistant Interactions

With this MCP server, AI assistants can now answer questions like:

**"How does the Catalog class work in SFCC?"**
- The assistant queries `get_sfcc_class_info` for the Catalog class
- Gets back structured information about properties (description, displayName, ID, root) and methods (getDescription, getDisplayName, etc.)
- Provides a comprehensive explanation of the class functionality

**"Find all classes related to products"**
- The assistant uses `search_sfcc_classes` with query "product"
- Returns classes like `dw.catalog.Product`, `dw.catalog.ProductMgr`, `dw.catalog.ProductOption`, etc.

**"What methods are available for managing customers?"**
- The assistant calls `search_sfcc_methods` with "customer"
- Gets back customer-related methods from multiple classes across the SFCC API

## Documentation Coverage

The server includes comprehensive documentation for all SFCC packages:
- `dw.campaign` - Campaign and promotion management
- `dw.catalog` - Product and catalog management
- `dw.content` - Content management
- `dw.customer` - Customer management
- `dw.order` - Order processing
- `dw.system` - System utilities
- `dw.web` - Web framework
- And many more...

## Security Notes

- Store your `dw.json` file securely and never commit it to version control
- Add `dw.json` to your `.gitignore` file
- Use environment variables in production environments
- Ensure your SFCC credentials have appropriate permissions

## Development

### Building from Source

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Documentation Generation

The SFCC documentation is automatically converted from the official SFCC documentation using the included scraping script:

```bash
# Convert SFCC documentation (with rate limiting)
node scripts/convert-docs.js

# Test mode (limited conversion)
node scripts/convert-docs.js --test

# Conservative rate limiting
node scripts/convert-docs.js --slow
```
