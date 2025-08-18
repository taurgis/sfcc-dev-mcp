# SFCC Development MCP Server

## 📋 Table of Contents

- [🚀 TL;DR - Quick Setup](#-tldr---quick-setup)
  - [Available Tools by Mode](#available-tools-by-mode)
- [🤖 AI Assistant Integration](#-ai-assistant-integration)
  - [Available AI Interface Instructions](#available-ai-interface-instructions)
  - [Quick Setup for AI Interfaces](#quick-setup-for-ai-interfaces)
- [📦 Installation & Setup](#-installation--setup)
  - [Option 1: Using npx (Recommended)](#option-1-using-npx-recommended---no-installation-required)
  - [Option 2: Global Installation](#option-2-global-installation)
  - [Option 3: Local Development Installation](#option-3-local-development-installation)
- [🎯 AI Interface Setup Guides](#-ai-interface-setup-guides)
  - [GitHub Copilot Setup](#github-copilot-setup)
  - [Claude Desktop Setup](#claude-desktop-setup)
  - [Cursor Setup](#cursor-setup)
- [✨ Features](#features)
  - [SFCC Best Practices Guides](#sfcc-best-practices-guides)
  - [SFCC Documentation Querying](#sfcc-documentation-querying)
  - [Enhanced SFRA Documentation Access](#enhanced-sfra-documentation-access)
  - [SFCC System Object Definitions](#sfcc-system-object-definitions)
  - [Log Analysis & Monitoring](#log-analysis--monitoring)
- [⚙️ Configuration](#configuration)
  - [Overriding the Working Directory](#overriding-the-working-directory)
  - [Using dw.json (Recommended)](#using-dwjson-recommended)
  - [Using Environment Variables](#using-environment-variables)
- [🔧 Data API Configuration](#data-api-configuration)
  - [Business Manager Setup for System Object Definition Tools](#business-manager-setup-for-system-object-definition-tools)
  - [Step 1: Create API Client in Account Manager](#step-1-create-api-client-in-account-manager)
  - [Step 2: Configure Data API Access in Business Manager](#step-2-configure-data-api-access-in-business-manager)
  - [Step 3: Update Your Configuration](#step-3-update-your-configuration)
  - [Troubleshooting Data API Access](#troubleshooting-data-api-access)
- [🚀 Usage](#usage)
  - [Launch Parameters and Command Line Options](#launch-parameters-and-command-line-options)
  - [Starting the Server](#starting-the-server)
  - [Using with npx](#using-with-npx)
  - [MCP Client Configuration](#mcp-client-configuration)
- [🛠️ Available Tools](#available-tools)
  - [SFCC Documentation Tools](#sfcc-documentation-tools)
  - [SFCC Best Practices Tools](#sfcc-best-practices-tools)
  - [SFCC SFRA Documentation Tools](#sfcc-sfra-documentation-tools)
  - [SFCC System Object Definition Tools](#sfcc-system-object-definition-tools)
  - [Log Analysis Tools](#log-analysis-tools)
- [💡 Example AI Assistant Interactions](#example-ai-assistant-interactions)
- [📚 Best Practices Coverage](#best-practices-coverage)
- [📖 Documentation Coverage](#documentation-coverage)
- [🔒 Security Notes](#security-notes)
- [👨‍💻 Development](#development)
  - [Building from Source](#building-from-source)
  - [Running Tests](#running-tests)
- [🐛 Troubleshooting and Debugging](#troubleshooting-and-debugging)
  - [MCP Server Logs](#mcp-server-logs)
  - [Log File Locations by Operating System](#log-file-locations-by-operating-system)
  - [Viewing Logs in Real-Time](#viewing-logs-in-real-time)

---

## 🚀 TL;DR - Quick Setup

To use this MCP server with Claude Desktop or other MCP clients, add the following to your MCP settings file:

**Documentation-Only Mode** (No SFCC credentials needed):
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}
```

**Full Mode** (With SFCC credentials for log analysis and system object tools):
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
    }
  }
}
```

**For Full Mode**, create a `dw.json` file with your SFCC credentials:

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret"
}
```

### Available Tools by Mode

| Tool Category | Documentation-Only Mode | Full Mode |
|---------------|------------------------|-----------|
| **SFCC Documentation** (5 tools) | ✅ Available | ✅ Available |
| **Best Practices Guides** (4 tools) | ✅ Available | ✅ Available |
| **Enhanced SFRA Documentation** (5 tools) | ✅ Available | ✅ Available |
| **Cartridge Generation** (1 tool) | ✅ Available | ✅ Available |
| **Log Analysis** (7 tools) | ❌ Requires credentials | ✅ Available |
| **System Object Definitions** (6 tools) | ❌ Requires OAuth | ✅ Available with OAuth |

**Get started immediately**: The server works without any credentials - just use `npx sfcc-dev-mcp` to access all documentation and best practices tools!

## 🤖 AI Assistant Integration

For optimal AI assistance when working with SFCC projects, this repository includes specialized instruction files for different AI interfaces in the `ai-instructions/` directory.

### Available AI Interface Instructions

| AI Interface | Location | Description |
|--------------|----------|-------------|
| **GitHub Copilot** | `ai-instructions/github-copilot/copilot-instructions.md` | Optimized for inline code suggestions and completions |
| **Claude Desktop** | `ai-instructions/claude-desktop/claude_custom_instructions.md` | Leverages multi-turn conversations and MCP integration |
| **Cursor** | `ai-instructions/cursor/.cursor/rules/` | Modern rule-based system for real-time development |

### Quick Setup for AI Interfaces

Copy the appropriate instruction file to your SFCC project directory and follow the interface-specific setup instructions below.

## 📦 Installation & Setup

### Option 1: Using npx (Recommended - No Installation Required)

The easiest way to use this MCP server is with npx, which automatically handles installation and updates:

```bash
# Test the server (Documentation-only mode)
npx sfcc-dev-mcp

# Use with custom dw.json file
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json
```

### Option 2: Global Installation

Install the package globally for use across multiple projects:

```bash
# Install globally
npm install -g sfcc-dev-mcp

# Run from anywhere
sfcc-dev-mcp --dw-json /path/to/your/dw.json
```

### Option 3: Local Development Installation

For development or local modifications:

```bash
# Clone the repository
git clone https://github.com/your-username/sfcc-dev-mcp.git
cd sfcc-dev-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Run locally
npm start -- --dw-json /path/to/your/dw.json
```

## 🎯 AI Interface Setup Guides

### GitHub Copilot Setup

1. **Copy the instruction file** to your SFCC project root:
   ```bash
   cp ai-instructions/github-copilot/copilot-instructions.md your-sfcc-project/.github/copilot-instructions.md
   ```

2. **Configure the MCP server** (if using MCP-compatible tools):
   ```json
   {
     "mcpServers": {
       "sfcc-dev": {
         "command": "npx",
         "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
       }
     }
   }
   ```

3. **Features enabled:**
   - Inline code suggestions with SFCC context
   - Auto-completion for SFCC APIs and patterns
   - Template generation for controllers, hooks, and components
   - Real-time error detection and fixes

### Claude Desktop Setup

1. **Copy the instruction file** to your SFCC project:
   ```bash
   cp ai-instructions/claude-desktop/claude_custom_instructions.md your-sfcc-project/claude-instructions.md
   ```

2. **Configure Claude Desktop MCP integration**:
   
   **Location of config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

   **Documentation-Only Mode** (No SFCC credentials needed):
   ```json
   {
     "mcpServers": {
       "sfcc-dev": {
         "command": "npx",
         "args": ["sfcc-dev-mcp"]
       }
     }
   }
   ```

   **Full Mode** (With SFCC credentials for log analysis and system objects):
   ```json
   {
     "mcpServers": {
       "sfcc-dev": {
         "command": "npx",
         "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
       }
     }
   }
   ```

3. **Create your dw.json file** for Full Mode:
   ```json
   {
     "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
     "username": "your-username",
     "password": "your-password",
     "client-id": "your-client-id",
     "client-secret": "your-client-secret"
   }
   ```

4. **Features enabled:**
   - Real-time SFCC documentation access
   - Multi-turn debugging conversations
   - Architecture review and planning
   - Complete log analysis and system object exploration

### Cursor Setup

1. **Copy the modern rules structure** to your SFCC project:
   ```bash
   cp -r ai-instructions/cursor/.cursor your-sfcc-project/
   ```

2. **Configure MCP server** (if using MCP-compatible extensions):
   ```json
   {
     "mcpServers": {
       "sfcc-dev": {
         "command": "npx",
         "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
       }
     }
   }
   ```

3. **Available Cursor Rules:**
   - `sfcc-development.mdc` - Core SFCC patterns (always applied)
   - `sfra-controllers.mdc` - Controller development (auto-attached)
   - `hooks-development.mdc` - Hook implementation (auto-attached)
   - `debugging-workflows.mdc` - Debugging guidance (manual: `@debugging-workflows`)
   - `system-objects.mdc` - Data model patterns (auto-attached)
   - `security-patterns.mdc` - Security best practices (manual: `@security-patterns`)
   - `testing-patterns.mdc` - Testing templates (auto-attached)
   - `performance-optimization.mdc` - Performance guidance (manual: `@performance-optimization`)

4. **Features enabled:**
   - Context-aware code completion
   - Real-time validation against SFCC APIs
   - File-aware refactoring across cartridge structures
   - Security-first development patterns

## Features

### Cartridge Generation
- **Generate Complete Cartridge Structure**: Create a complete SFCC cartridge directory structure with all necessary files and configurations using the `generate_cartridge_structure` tool. Includes proper directory organization, package.json, webpack configuration, linting setup, and all standard cartridge subdirectories (controllers, models, templates, client assets). Supports both full project setup (new projects) and cartridge-only setup (adding to existing projects). Creates files directly in the specified target directory for precise control over cartridge placement.

### SFCC Best Practices Guides
- **Get Available Guides**: List all available SFCC best practice guides covering cartridge creation, ISML templates, job framework, LocalServiceRegistry integrations, OCAPI hooks, SCAPI hooks, SFRA controllers, and custom SCAPI endpoints
- **Get Complete Guide**: Retrieve comprehensive best practice guides with structured content for specific SFCC development areas including ISML Templates, LocalServiceRegistry service integrations, and security guidelines
- **Search Best Practices**: Search across all best practice guides for specific terms, concepts, or patterns including service integration patterns, OAuth flows, and API development best practices
- **Get Hook Reference**: Access detailed hook reference tables for OCAPI and SCAPI hooks with endpoints and extension points

### SFCC Documentation Querying
- **Get Class Information**: Retrieve detailed information about any SFCC class including properties, methods, and descriptions
- **Search Classes**: Find SFCC classes by name with partial matching
- **Search Methods**: Find methods across all SFCC classes by name
- **List All Classes**: Get a complete list of available SFCC classes
- **Get Raw Documentation**: Access the complete Markdown documentation for any class

### Enhanced SFRA Documentation Access
- **Get Available SFRA Documents**: List all 26+ available SFRA (Storefront Reference Architecture) documents with smart categorization into 7 logical groups (core, product, order, customer, pricing, store, other)
- **Get SFRA Document**: Retrieve complete SFRA class, module, or model documentation with detailed information about properties, methods, and usage examples. Now supports all 26+ documents including comprehensive model documentation for account, cart, products, pricing, billing, shipping, store management, and more
- **Search SFRA Documentation**: Advanced search across all SFRA documentation with relevance scoring, context highlighting, and category awareness. Find specific functionality across 26+ documents covering core classes, extensive model documentation, and complete SFRA ecosystem
- **Get SFRA Documents by Category**: ⭐ **NEW** - Filter documents by functional category (core, product, order, customer, pricing, store, other) for efficient discovery and exploration of related functionality  
- **Get SFRA Categories**: ⭐ **NEW** - Get all available SFRA document categories with counts and descriptions to understand the organization and scope of SFRA documentation

#### 📂 SFRA Document Categories (26+ documents total):
- **Core** (5 docs): server, request, response, querystring, render - Essential SFRA classes for routing and middleware
- **Product** (5 docs): product-full, product-bundle, product-tile, product-search, product-line-items - Product model documentation
- **Order** (6 docs): cart, order, billing, shipping, payment, totals - Cart and checkout functionality models
- **Customer** (2 docs): account, address - Customer management and profile models
- **Pricing** (3 docs): price-default, price-range, price-tiered - Pricing and discount models
- **Store** (2 docs): store, stores - Store location and management models
- **Other** (3+ docs): categories, content, locale - Additional utility and content models

**Enhanced Features:**
- **Dynamic Discovery**: Automatically finds all SFRA documentation files - no hardcoding required
- **Smart Categorization**: Organizes documents into logical functional groups
- **Performance Optimization**: Intelligent caching with lazy loading for optimal response times  
- **Advanced Search**: Relevance-scored search results with context highlighting and line numbers

### SFCC System Object Definitions
- **Get All System Objects**: Retrieve a complete list of all system object definitions with metadata including attribute counts
- **Get System Object Definition**: Get detailed information about a specific system object (Product, Customer, Order, etc.) including all attributes
- **Search System Object Attribute Definitions**: Search for specific attribute definitions within a system object type using complex queries. Supports text search on id/display_name/description, filtering by properties like mandatory/searchable/system, and sorting. Essential for finding custom attributes or attributes with specific characteristics. To get all attributes for an object, use a match_all_query.
- **Search Site Preferences**: Search site preferences across sites in the specified preference group and instance. Essential for discovering custom site preferences, understanding preference configurations, or when working with site-specific settings. Supports complex queries with text search, filtering, and sorting.
- **Search System Object Attribute Groups**: Search attribute groups for a specific system object type. Essential for discovering site preference groups (use "SitePreferences" as objectType) needed for the site preferences search API. Supports complex queries with text search, filtering, and sorting on group properties.
- **Search Custom Object Attribute Definitions**: Search for specific attribute definitions within a custom object type using complex queries. Use this for custom objects (user-defined data structures) rather than system objects. Supports text search on id/display_name/description, filtering by properties like mandatory/searchable/system, and sorting. Essential for finding custom attributes or attributes with specific characteristics in custom object definitions.

*Note: System object definition tools require OAuth credentials (clientId and clientSecret) and are useful for discovering custom attributes and site preferences added to standard SFCC objects.*

### Log Analysis & Monitoring
- **Get Latest Errors**: Retrieve the most recent error messages from SFCC logs
- **Get Latest Warnings**: Fetch recent warning messages
- **Get Latest Info**: Access recent info-level log entries  
- **Summarize Logs**: Get an overview of log activity with error counts and key issues
- **Search Logs**: Search for specific patterns across log files
- **List Log Files**: View available log files with metadata

## Configuration

### Overriding the Working Directory

The server uses the current working directory (cwd) to locate documentation files. By default, it expects to find a `docs/` folder in the directory where the server is started. If you need to use documentation from a different location, you have several options:

**Option 1: Start the server from the correct directory**
```bash
cd /path/to/sfcc-dev-mcp
npx sfcc-dev-mcp
```

**Option 2: Use the --cwd flag (if your MCP client supports it)**
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"],
      "cwd": "/path/to/sfcc-dev-mcp"
    }
  }
}
```

**Option 3: Create symbolic links**
```bash
# Create a symbolic link to the docs folder in your desired location
ln -s /path/to/sfcc-dev-mcp/docs /your/desired/location/docs
cd /your/desired/location
npx sfcc-dev-mcp
```

**Expected Directory Structure:**
The server expects the following structure relative to the working directory:
```
./docs/
├── best-practices/
│   ├── cartridge_creation.md
│   ├── ocapi_hooks.md
│   ├── scapi_hooks.md
│   └── ...
├── sfra/
│   ├── server.md
│   ├── request.md
│   ├── response.md
│   ├── querystring.md
│   └── render.md
├── dw_catalog/
├── dw_order/
└── ... (other SFCC class documentation folders)
```

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

## 🔧 Data API Configuration

### Business Manager Setup for System Object Definition Tools

To use the system object definition tools (`get_system_object_definitions`, `get_system_object_definition`, `search_system_object_attribute_definitions`, `search_site_preferences`, `search_system_object_attribute_groups`, `search_custom_object_attribute_definitions`), you need to configure Data API access in Business Manager:

#### Step 1: Create API Client in Account Manager

1. Log into **Account Manager** (not Business Manager)
2. Navigate to **API Client** section
3. Click **Add API Client**
4. Configure the API client:
   - **Name**: `SFCC Dev MCP Server` (or any descriptive name)
   - **Password**: Generate a secure password
   - **Scopes**: Select **SFCC** scope
   - **Roles**: Assign appropriate roles for your organization

#### Step 2: Configure Data API Access in Business Manager

1. Log into **Business Manager** for your instance
2. Navigate to **Administration > Site Development > Open Commerce API Settings**
3. Click on **Data API** tab
4. Configure the following settings:

**Client Configuration:**
```json
{
  "_v": "23.2",
  "clients": [
    {
      "client_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "resources": [
        {
          "resource_id": "/system_object_definitions",
          "methods": [
            "get"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definitions/*",
          "methods": [
            "get"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definition_search",
          "methods": [
            "post"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definitions/*/attribute_definition_search",
          "methods": [
            "post"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definitions/*/attribute_group_search",
          "methods": [
            "post"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/custom_object_definitions/*/attribute_definition_search",
          "methods": [
            "post"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/site_preferences/preference_groups/*/*/preference_search",
          "methods": [
            "post"
          ],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        }
      ]
    }
  ]
}
```

**Required Settings:**
- **Client ID**: Your API client ID (e.g., `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)
- **Resource ID**: `/system_object_definitions/*` (allows access to all system object definition endpoints)
- **Resource ID**: `/site_preferences/preference_groups/*/*/preference_search` (allows access to site preferences search)
- **Methods**: `get` and `post` (required for retrieving and searching system objects and preferences)
- **Read Attributes**: `(**)` (allows reading all attributes)
- **Write Attributes**: `(**)` (may be required for some operations)

#### Step 3: Update Your Configuration

Add the client credentials to your `dw.json`:

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "client-secret": "your-api-client-password",
  "code-version": "version1"
}
```

#### Troubleshooting Data API Access

**Common Issues:**
- **403 Forbidden**: Check that your API client has the correct scopes and roles
- **401 Unauthorized**: Verify your client credentials are correct
- **Resource not found**: Ensure the resource ID pattern matches `/system_object_definitions/*` and `/site_preferences/preference_groups/*/*/preference_search`

**Testing Your Configuration:**
You can test your Data API access using the MCP tools:
```json
{
  "tool": "get_system_object_definitions",
  "parameters": {
    "count": 5,
    "select": "(**)"
  }
}
```

**Testing Site Preferences Workflow:**
```json
{
  "tool": "search_system_object_attribute_groups",
  "parameters": {
    "objectType": "SitePreferences",
    "searchRequest": {
      "query": {
        "match_all_query": {}
      },
      "select": "(**)"
    }
  }
}
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

#### `--debug <true|false>`

Control debug logging output to customize the verbosity of server logs:

```bash
# Enable debug logging (shows detailed debug messages, method entry/exit, timing info)
npm start -- --debug true
npm start -- --debug  # shorthand for true

# Disable debug logging (shows only essential info, warnings, and errors)
npm start -- --debug false

# Combine with other options
npm start -- --dw-json ./config/dw.json --debug false
```

**Debug logging includes:**
- Method entry and exit logs
- Detailed timing information for operations
- Full response previews for debugging
- Additional context for troubleshooting

**Production usage:** Use `--debug false` in production environments to reduce log noise and improve performance.

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

## 🛠️ Available Tools

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

3. **`search_sfcc_methods`** - Find methods across all classes
   ```json
   {
     "methodName": "getPrice"
   }
   ```

4. **`list_sfcc_classes`** - List all available SFCC classes

5. **`get_sfcc_class_documentation`** - Get raw documentation
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

### Cartridge Generation Tools

1. **`generate_cartridge_structure`** - Generate a complete cartridge directory structure with all necessary files and configurations
   ```json
   {
     "cartridgeName": "plugin_my_custom_cartridge",
     "targetPath": "/path/to/your/project",
     "fullProjectSetup": true
   }
   ```

### SFCC SFRA Documentation Tools

1. **`get_available_sfra_documents`** - List all available SFRA documents with categorization
   ```json
   {}
   ```

2. **`get_sfra_document`** - Get complete SFRA class, module, or model documentation (supports all 26+ documents)
   ```json
   {
     "documentName": "server"
   }
   ```

3. **`search_sfra_documentation`** - Advanced search across all SFRA documentation with relevance scoring
   ```json
   {
     "query": "middleware"
   }
   ```

4. **`get_sfra_documents_by_category`** ⭐ **NEW** - Filter SFRA documents by functional category
   ```json
   {
     "category": "core"
   }
   ```

5. **`get_sfra_categories`** ⭐ **NEW** - Get all SFRA document categories with counts and descriptions
   ```json
   {}
   ```

### SFCC System Object Definition Tools

1. **`get_system_object_definitions`** - Get all system object definitions
   ```json
   {
     "count": 50,
     "select": "(**)"
   }
   ```

2. **`get_system_object_definition`** - Get specific system object definition
   ```json
   {
     "objectType": "Product"
   }
   ```

3. **`search_system_object_attribute_definitions`** - Search attribute definitions
   ```json
   {
     "objectType": "Product",
     "searchRequest": {
       "query": {
         "text_query": {
           "fields": ["id", "display_name"],
           "search_phrase": "price"
         }
       },
       "select": "(**)"
     }
   }
   ```

4. **`search_site_preferences`** - Search site preferences
   ```json
   {
     "groupId": "MyPreferenceGroup",
     "instanceType": "staging",
     "searchRequest": {
       "query": {
         "text_query": {
           "fields": ["id", "display_name"],
           "search_phrase": "payment"
         }
       },
       "select": "(**)"
     },
     "options": {
       "expand": "value",
       "maskPasswords": true
     }
   }
   ```

5. **`search_system_object_attribute_groups`** - Search attribute groups
   ```json
   {
     "objectType": "SitePreferences",
     "searchRequest": {
       "query": {
         "match_all_query": {}
       },
       "sorts": [{"field": "display_name", "sort_order": "asc"}],
       "select": "(**)"
     }
   }
   ```

6. **`search_custom_object_attribute_definitions`** - Search attribute definitions within a custom object type
   ```json
   {
     "objectType": "custom_object_type",
     "searchRequest": {
       "query": {
         "text_query": {
           "fields": ["id", "display_name"],
           "search_phrase": "custom_attribute"
         }
       },
       "select": "(**)"
     }
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

**"Create a new cartridge called "plugin_example" with a controller and ISML template"**
- The assistant uses `get_best_practice_guide` to retrieve the best practices for cartridge creation.
- It then generates the necessary files and directories based on the best practices, including a controller and ISML template.

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

*"Find all site preference groups available in my SFCC instance"**
- The assistant uses `search_system_object_attribute_groups` with objectType "SitePreferences"
- Returns all available preference groups with their IDs, display names, and descriptions
- Provides the group IDs needed for subsequent site preference searches

**"Search for payment-related site preferences in the PaymentSettings group"**
- The assistant first uses `search_system_object_attribute_groups` to find preference groups related to payment
- Then uses `search_site_preferences` with the discovered group ID and instance type
- Returns specific site preferences related to payment configuration

**"Create a new cartridge called 'plugin_example' with proper structure"**
- The assistant uses `generate_cartridge_structure` with the cartridge name and target path
- Automatically creates the complete cartridge structure with all necessary files
- Sets up all necessary configuration files (package.json, webpack.config.js, etc.)
- Creates the proper directory organization with controllers, models, templates, and static assets

## Best Practices Coverage

The server includes comprehensive best practices guides for all major SFCC development areas:
- **Cartridge Creation** - Complete cartridge development lifecycle and architecture patterns
- **ISML Templates** - Template development with security, performance, and maintainability guidelines
- **Job Framework** - Custom job development with task-oriented and chunk-oriented patterns
- **LocalServiceRegistry** - Server-to-server integrations, service configuration, OAuth flows, and reusable patterns
- **OCAPI Hooks** - Legacy API extension patterns and implementation guidance
- **SCAPI Hooks** - Modern API hooks with transactional integrity and performance considerations
- **SFRA Controllers** - Storefront controller patterns, middleware chains, and extension strategies
- **SFRA Models** - JSON object layer design and model architecture patterns
- **Custom SCAPI Endpoints** - Three-pillar architecture for building new API endpoints
- **Performance Optimization** - Caching strategies, query optimization, and scalability best practices
- **Security Guidelines** - OWASP compliance, input validation, and secure coding practices

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

## Troubleshooting and Debugging

### MCP Server Logs

The server automatically writes all logs to files to avoid interfering with the JSON-RPC protocol and ensure consistent debugging capabilities. This prevents JSON parsing errors and provides reliable log access for troubleshooting.

#### Log File Locations by Operating System

**macOS:**
```
/tmp/sfcc-mcp-logs/
├── sfcc-mcp-info.log      # General information and startup messages
├── sfcc-mcp-warn.log      # Warning messages and deprecation notices
├── sfcc-mcp-error.log     # Error messages and stack traces
└── sfcc-mcp-debug.log     # Detailed debug information (when --debug is enabled)
```

**Windows:**
```
%TEMP%\sfcc-mcp-logs\
├── sfcc-mcp-info.log      # General information and startup messages
├── sfcc-mcp-warn.log      # Warning messages and deprecation notices
├── sfcc-mcp-error.log     # Error messages and stack traces
└── sfcc-mcp-debug.log     # Detailed debug information (when --debug is enabled)
```

**Linux:**
```
/tmp/sfcc-mcp-logs/
├── sfcc-mcp-info.log      # General information and startup messages
├── sfcc-mcp-warn.log      # Warning messages and deprecation notices
├── sfcc-mcp-error.log     # Error messages and stack traces
└── sfcc-mcp-debug.log     # Detailed debug information (when --debug is enabled)
```

#### Viewing Logs in Real-Time

**macOS/Linux:**
```bash
# View all logs in real-time
tail -f /tmp/sfcc-mcp-logs/*.log

# View specific log levels
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-error.log    # Errors only
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-debug.log    # Debug info (if enabled)
```

**Windows (PowerShell):**
```powershell
# View error logs in real-time
Get-Content "$env:TEMP\sfcc-mcp-logs\sfcc-mcp-error.log" -Wait

# View all logs
Get-ChildItem "$env:TEMP\sfcc-mcp-logs" | ForEach-Object { Get-Content $_.FullName -Wait }
```

#### Common Issues and Solutions

**JSON Parsing Errors:**
- **Issue**: `Expected ',' or ']' after array element in JSON at position X`
- **Cause**: Previous versions logged to console, interfering with MCP protocol
- **Solution**: Update to latest version - logs now go to files automatically

**Log Files Not Created:**
- **Issue**: No log files in the expected directory
- **Cause**: Server running has permissions issue
- **Solution**: Check that you're running via MCP client (not directly with `node`) or verify write permissions to temp directory

**Missing Debug Information:**
- **Issue**: Debug log file empty or missing detailed information
- **Cause**: Debug mode not enabled
- **Solution**: Add `--debug true` to your MCP client configuration:
  ```json
  {
    "mcpServers": {
      "sfcc-dev": {
        "command": "npx",
        "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/dw.json", "--debug", "true"]
      }
    }
  }
  ```

**Connection Issues:**
- **Issue**: Server appears to start but tools don't work
- **Cause**: Various configuration or network issues
- **Solution**: Check error logs for specific error messages and verify SFCC credentials

#### Debug Mode

Enable debug mode for detailed troubleshooting information:

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/dw.json", "--debug", "true"]
    }
  }
}
```

Debug mode provides:
- Method entry and exit tracking
- Performance timing information
- Full request/response details
- Configuration loading details
- Client initialization status

#### Log Cleanup

Log files accumulate over time. You can safely delete old log files:

**macOS/Linux:**
```bash
# Remove all log files
rm /tmp/sfcc-mcp-logs/*.log

# Remove logs older than 7 days
find /tmp/sfcc-mcp-logs -name "*.log" -mtime +7 -delete
```

**Windows:**
```powershell
# Remove all log files
Remove-Item "$env:TEMP\sfcc-mcp-logs\*.log"

# Remove logs older than 7 days
Get-ChildItem "$env:TEMP\sfcc-mcp-logs" -Filter "*.log" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item
```

### Documentation Generation

The SFCC documentation is automatically converted from the official SFCC documentation using the included scraping script. 

**Note**: The documentation conversion script requires additional dependencies that are not included in the main package to keep the MCP server lightweight:

```bash
# Install dependencies needed for documentation conversion
npm install axios cheerio

# Convert SFCC documentation (with rate limiting)
node scripts/convert-docs.js

# Test mode (limited conversion)
node scripts/convert-docs.js --test

# Conservative rate limiting
node scripts/convert-docs.js --slow
```

The `axios` and `cheerio` dependencies are only needed for regenerating documentation from the SFCC documentation website and are not required for normal MCP server operation.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Setting up the development environment
- Code style and conventions
- Testing requirements
- Pull request process
- Types of contributions we're looking for

Whether you're fixing bugs, adding features, improving documentation, or enhancing the best practices guides, your contributions help make SFCC development more accessible for everyone.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
