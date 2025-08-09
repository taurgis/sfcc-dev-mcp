# SFCC Development MCP Server

An MCP (Model Context Protocol) server that provides comprehensive access to Salesforce B2C Commerce Cloud development features. This allows AI agents to assist with SFCC development tasks including log analysis, debugging, monitoring, and **SFCC documentation querying**.

## Features

### SFCC Best Practices Guides
- **Get Available Guides**: List all available SFCC best practice guides covering OCAPI hooks, SCAPI hooks, SFRA controllers, and custom SCAPI endpoints
- **Get Complete Guide**: Retrieve comprehensive best practice guides with structured content for specific SFCC development areas
- **Search Best Practices**: Search across all best practice guides for specific terms, concepts, or patterns
- **Get Hook Reference**: Access detailed hook reference tables for OCAPI and SCAPI hooks with endpoints and extension points

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

### Launch Parameters and Command Line Options

The server supports several command line parameters to customize its behavior:

#### `--dw-json <path>`

Specify a custom path to your `dw.json` configuration file:

```bash
# Using npm with custom dw.json path
npm start -- --dw-json /path/to/your/dw.json

# Using npm with relative path
npm start -- --dw-json ./config/dw.json

# Using node directly
node dist/main.js --dw-json /path/to/your/dw.json
```

#### Configuration Loading Priority

The server loads configuration in the following order of preference:

1. **Command line `--dw-json` argument** (highest priority)
   - Allows you to specify a custom path to your dw.json file
   - Useful for different environments or project configurations

2. **`./dw.json` file in current directory**
   - Automatically detected if present in the working directory
   - Standard SFCC development workflow

3. **Environment variables** (lowest priority)
   - Falls back to environment variables if no dw.json is found
   - See the "Using Environment Variables" section below

### Starting the Server

```bash
# Basic start (uses ./dw.json or environment variables)
npm start

# Start with custom dw.json file
npm start -- --dw-json /path/to/custom/dw.json

# Or directly with node
node dist/main.js

# Or with custom configuration
node dist/main.js --dw-json ./config/production.json
```

### Using with npx

You can also run the server directly using npx without installing it locally:

```bash
# Run with npx (uses ./dw.json or environment variables)
npx sfcc-dev-mcp

# Run with npx and custom dw.json file
npx sfcc-dev-mcp --dw-json /path/to/custom/dw.json

# Run with npx and relative path
npx sfcc-dev-mcp --dw-json ./config/dw.json
```

**Note:** When using npx, make sure your `dw.json` file is in the current working directory or specify the full path using the `--dw-json` parameter.

### MCP Client Configuration

Add this server to your MCP client configuration. For example, in Claude Desktop's config:

#### Using Local Installation

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "node",
      "args": ["/path/to/sfcc-dev-mcp/dist/main.js"]
    }
  }
}
```

#### Using npx (Recommended)

You can configure the MCP client to use npx, which automatically handles package installation and updates:

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "sfcc-dev-mcp",
        "--dw-json",
        "/path/to/your/dw.json"
      ]
    }
  }
}
```

**Example configurations:**

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "type": "stdio", 
      "command": "npx",
      "args": [
        "sfcc-dev-mcp",
        "--dw-json",
        "/Users/username/Documents/Projects/my-sfcc-project/dw.json"
      ]
    }
  }
}
```

**For automatic configuration detection (uses ./dw.json in working directory):**

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "type": "stdio",
      "command": "npx",
      "args": ["sfcc-dev-mcp"],
      "cwd": "/path/to/your/sfcc/project"
    }
  }
}
```

**Benefits of using npx in MCP configuration:**
- Automatically installs the latest version if not present
- No need to manually clone or build the project
- Automatic updates when new versions are released
- Consistent behavior across different environments
- Easy to share configurations with team members

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

### SFCC Best Practices Tools

1. **`get_available_best_practice_guides`** - List all available best practice guides
   ```json
   {}
   ```

2. **`get_best_practice_guide`** - Get a complete best practice guide
   ```json
   {
     "guideName": "sfra_controllers"
   }
   ```

3. **`search_best_practices`** - Search across all best practice guides
   ```json
   {
     "query": "validation"
   }
   ```

4. **`get_hook_reference`** - Get hook reference tables for OCAPI/SCAPI
   ```json
   {
     "guideName": "ocapi_hooks"
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

**"How do I implement SFRA controller extensions properly?"**
- The assistant uses `get_best_practice_guide` with "sfra_controllers"
- Returns comprehensive best practices including server.append(), server.prepend(), and server.replace() patterns
- Provides code examples and architectural guidance for SFRA development

**"What are the security best practices for OCAPI hooks?"**
- The assistant calls `search_best_practices` with query "security"
- Finds security-related content across all best practice guides
- Returns specific guidance on input validation, authorization, and data integrity

**"Show me all available SCAPI hook extension points"**
- The assistant uses `get_hook_reference` with "scapi_hooks"
- Returns comprehensive tables of all SCAPI hook endpoints and their available extension points
- Provides structured reference for implementing custom hook logic

## Best Practices Coverage

The server includes comprehensive best practices guides for all major SFCC development areas:
- **OCAPI Hooks** - Legacy API extension patterns and implementation guidance
- **SCAPI Hooks** - Modern API hooks with transactional integrity and performance considerations
- **SFRA Controllers** - Storefront controller patterns, middleware chains, and extension strategies
- **Custom SCAPI Endpoints** - Three-pillar architecture for building new API endpoints

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
