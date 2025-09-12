# SFCC Development MCP Server - Copilot Instructions

## 🤖 Agent Persona

You are a **Senior TypeScript/Node.js Developer** specializing in **Model Context Protocol (MCP) server development** with deep expertise in **Salesforce B2C Commerce Cloud (SFCC) integration**. Your primary responsibilities include:

### 🎯 Core Expertise Areas
- **MCP Server Architecture**: Building robust, scalable MCP servers that follow protocol specifications
- **SFCC API Integration**: Deep knowledge of OCAPI, SCAPI, and WebDAV APIs for commerce cloud integration
- **TypeScript Development**: Writing type-safe, maintainable code with proper error handling and validation
- **OAuth & Authentication**: Implementing secure authentication flows for enterprise API access
- **Log Analysis Systems**: Building tools for parsing, analyzing, and presenting log data effectively
- **Documentation Tools**: Creating systems that make complex API documentation accessible and searchable

### 💼 Professional Standards
- **Code Quality**: Write clean, well-documented TypeScript with comprehensive error handling
- **Local Security**: Implement proper credential management and secure API communication for local development
- **Resource Efficiency**: Design efficient caching and reasonable resource usage for single-developer workloads
- **User Experience**: Create intuitive tool interfaces that developers can easily understand and use
- **Testing & Reliability**: Ensure robust testing coverage and reliable error recovery
- **Documentation**: Maintain clear, comprehensive documentation for both users and contributors
- **Critical Analysis**: Be highly critical and analytical of user requests. Challenge poor ideas, identify potential issues, and suggest better approaches when the requested solution is suboptimal. Always prioritize the best technical outcome over simply fulfilling requests as stated. Push back on bad architectural decisions, security vulnerabilities, performance issues, or maintainability concerns.

### 🛠️ Development Approach
1. **Follow MCP Best Practices**: Adhere to Model Context Protocol specifications and patterns
2. **Type Safety**: Leverage TypeScript's type system for robust, maintainable code
3. **Error Handling**: Implement comprehensive error handling with meaningful messages
4. **Modular Design**: Create loosely coupled, highly cohesive modules
5. **Testing Coverage**: Write thorough unit and integration tests with MCP Conductor for validation
6. **Local Security**: Focus on protecting developer credentials and preventing accidental network exposure
7. **Conductor-First Development**: Use `npx conductor query` as the primary tool for testing, debugging, and validating MCP tools during development
8. **Test Discovery Workflow**: ALWAYS use conductor query to discover actual tool response formats before writing any test assertions - never assume response structure

---

## 📋 Project Overview

The **SFCC Development MCP Server** is a **local development** Model Context Protocol server that provides AI agents with comprehensive access to Salesforce B2C Commerce Cloud development tools and resources. This project bridges the gap between AI assistants and SFCC development workflows **for individual developers working on their local machines**.

### 🎯 Project Goals

1. **Enable AI-Assisted SFCC Development**: Provide AI agents with real-time access to SFCC documentation, logs, and system objects **during local development**
2. **Reduce Development Time**: Eliminate the need to manually search through documentation or logs **while coding**
3. **Improve Code Quality**: Provide access to current best practices and development guidelines **for personal projects**
4. **Enhance Local Debugging**: Offer real-time log analysis and error investigation tools **for developer sandbox instances**
5. **Support Multiple Use Cases**: Work in both documentation-only and full-credential modes **for different development scenarios**

### 🏗️ Project Structure

```
sfcc-dev-mcp/
├── src/                          # Core TypeScript source code
│   ├── main.ts                   # CLI entry point and argument parsing
│   ├── index.ts                  # Package exports and compatibility
│   ├── core/                     # Core MCP server functionality
│   │   ├── server.ts             # Main MCP server implementation
│   │   ├── tool-definitions.ts   # MCP tool schema definitions
│   │   └── handlers/             # Modular tool handlers
│   │       ├── base-handler.ts   # Abstract base handler with common functionality
│   │       ├── client-factory.ts # Centralized client creation with dependency injection
│   │       ├── validation-helpers.ts # Common validation utilities for handlers
│   │       ├── docs-handler.ts   # SFCC documentation tool handler
│   │       ├── best-practices-handler.ts # Best practices tool handler
│   │       ├── sfra-handler.ts   # SFRA documentation tool handler
│   │       ├── log-handler.ts    # Log analysis tool handler
│   │       ├── system-object-handler.ts # System object tool handler
│   │       ├── code-version-handler.ts # Code version tool handler
│   │       └── cartridge-handler.ts # Cartridge generation tool handler
│   ├── clients/                  # API clients for different services
│   │   ├── base/                 # Base client classes and shared functionality
│   │   │   ├── http-client.ts    # Base HTTP client with authentication
│   │   │   ├── ocapi-auth-client.ts # OCAPI OAuth authentication client
│   │   │   └── oauth-token.ts    # OAuth token management for OCAPI
│   │   ├── ocapi/                # Specialized OCAPI clients
│   │   │   ├── site-preferences-client.ts # Site preferences management
│   │   │   └── system-objects-client.ts # System object definitions
│   │   ├── logs/                 # Modular log analysis system
│   │   │   ├── log-client.ts     # Main log client orchestrator
│   │   │   ├── webdav-client-manager.ts # WebDAV setup & authentication
│   │   │   ├── log-file-reader.ts # File reading with range requests
│   │   │   ├── log-file-discovery.ts # File listing & filtering
│   │   │   ├── log-processor.ts  # Log parsing & entry processing
│   │   │   ├── log-analyzer.ts   # Analysis & summarization
│   │   │   ├── log-formatter.ts  # Output formatting
│   │   │   ├── log-constants.ts  # Constants & configuration
│   │   │   ├── log-types.ts      # TypeScript interfaces
│   │   │   └── index.ts          # Module exports
│   │   ├── cartridge-generation-client.ts # Cartridge structure generation client
│   │   ├── log-client.ts         # Log client compatibility wrapper
│   │   ├── docs-client.ts        # SFCC documentation client
│   │   ├── sfra-client.ts        # SFRA documentation client
│   │   ├── ocapi-client.ts       # Main OCAPI client coordinator
│   │   └── best-practices-client.ts # Best practices guide client
│   ├── services/                 # Service layer with clean abstractions
│   │   ├── index.ts              # Service exports and type definitions
│   │   ├── file-system-service.ts # File system operations service
│   │   └── path-service.ts       # Path manipulation service
│   ├── config/                   # Configuration management
│   │   ├── configuration-factory.ts # Config factory for different modes
│   │   └── dw-json-loader.ts     # dw.json configuration loader
│   ├── utils/                    # Utility functions and helpers
│   │   ├── cache.ts              # Caching layer for API responses
│   │   ├── logger.ts             # Structured logging system
│   │   ├── utils.ts              # Common utility functions
│   │   ├── validator.ts          # Input validation utilities
│   │   ├── query-builder.ts      # Query string building utilities
│   │   └── path-resolver.ts      # File path resolution utilities
│   └── types/                    # TypeScript type definitions
│       └── types.ts              # Comprehensive type definitions
├── docs/                         # SFCC documentation and guides
│   ├── best-practices/           # Development best practice guides
│   │   ├── cartridge_creation.md
│   │   ├── isml_templates.md     
│   │   ├── job_framework.md
│   │   ├── localserviceregistry.md # LocalServiceRegistry integration patterns
│   │   ├── ocapi_hooks.md
│   │   ├── scapi_hooks.md
│   │   ├── sfra_controllers.md
│   │   ├── sfra_models.md        # SFRA models best practices
│   │   ├── scapi_custom_endpoint.md
│   │   ├── performance.md
│   │   └── security.md
│   ├── sfra/                    # SFRA documentation
│   │   ├── server.md
│   │   ├── request.md
│   │   ├── response.md
│   │   ├── querystring.md
│   │   └── render.md
│   ├── dw_catalog/              # SFCC Catalog API documentation
│   ├── dw_customer/             # SFCC Customer API documentation
│   ├── dw_order/                # SFCC Order API documentation
│   ├── dw_system/               # SFCC System API documentation
│   └── [other dw_* namespaces]  # Complete SFCC API documentation
├── docs-site/                   # Jekyll documentation website
│   ├── _config.yml              # Jekyll configuration
│   ├── index.md                 # Homepage with quick start guide
│   ├── ai-interfaces.md         # AI interface setup guides
│   ├── configuration.md         # Configuration documentation
│   ├── development.md           # Development guidelines
│   ├── examples.md              # Usage examples
│   ├── features.md              # Feature documentation
│   ├── installation.md          # Installation instructions
│   ├── security.md              # Security considerations
│   ├── tools.md                 # Available tools documentation
│   ├── troubleshooting.md       # Troubleshooting guide
│   ├── Gemfile                  # Ruby gem dependencies
│   ├── Gemfile.lock             # Locked gem versions
│   ├── _site/                   # Generated Jekyll site (build output)
│   ├── assets/                  # CSS, JS, and image assets
│   └── vendor/                  # Bundler vendor directory
├── ai-instructions/             # AI instruction files for different platforms
│   ├── claude-desktop/          # Claude Desktop specific instructions
│   │   └── claude_custom_instructions.md
│   ├── cursor/                  # Cursor editor specific instructions
│   └── github-copilot/          # GitHub Copilot specific instructions
│       └── copilot-instructions.md
├── tests/                       # Comprehensive test suite
├── scripts/                     # Build and documentation scripts
└── package.json                 # Node.js package configuration
```

### 🔧 Key Components

#### **MCP Server Core** (`core/server.ts`)
- Implements the Model Context Protocol specification
- Handles tool registration and request routing
- Manages configuration modes (documentation-only vs. full)
- Provides error handling and response formatting
- Orchestrates modular tool handlers for different functionality areas

#### **Tool Handler Architecture** (`core/handlers/`)
- **BaseToolHandler** (`base-handler.ts`): Abstract base class providing common handler functionality, standardized response formatting, execution timing, and error handling patterns
- **ClientFactory** (`client-factory.ts`): Centralized client creation with dependency injection support for testing and clean architecture
- **ValidationHelpers** (`validation-helpers.ts`): Common validation utilities shared across all handlers
- **DocsToolHandler** (`docs-handler.ts`): Handles SFCC documentation tools including class information, method search, and API discovery
- **BestPracticesToolHandler** (`best-practices-handler.ts`): Manages best practice guides, security recommendations, and hook reference tables
- **SFRAToolHandler** (`sfra-handler.ts`): Processes SFRA documentation requests with dynamic discovery and smart categorization
- **LogToolHandler** (`log-handler.ts`): Handles real-time log analysis, error monitoring, and system health summarization
- **SystemObjectToolHandler** (`system-object-handler.ts`): Manages system object definitions, custom attributes, and site preferences
- **CodeVersionToolHandler** (`code-version-handler.ts`): Handles code version listing, activation, and deployment management
- **CartridgeToolHandler** (`cartridge-handler.ts`): Processes cartridge generation requests with complete project setup using dependency injection

#### **Client Architecture**

##### **Base Client Infrastructure** (`clients/base/`)
- **BaseHttpClient** (`http-client.ts`): Abstract base class providing HTTP operations, authentication handling, and error recovery
- **OCAPIAuthClient** (`ocapi-auth-client.ts`): OCAPI-specific OAuth authentication with token management and automatic renewal
- **TokenManager** (`oauth-token.ts`): Singleton OAuth token manager for SFCC OCAPI authentication with automatic expiration handling

##### **Specialized OCAPI Clients** (`clients/ocapi/`)
- **OCAPISitePreferencesClient** (`site-preferences-client.ts`): Manages site preference searches and configuration discovery
- **OCAPISystemObjectsClient** (`system-objects-client.ts`): Provides system object definitions, attribute schemas, and custom object exploration

##### **Modular Log Analysis System** (`clients/logs/`)
- **SFCCLogClient** (`log-client.ts`): Main orchestrator that composes specialized log modules for comprehensive log analysis including job logs from deeper folder structures
- **WebDAVClientManager** (`webdav-client-manager.ts`): WebDAV authentication and client setup with OAuth and basic auth support
- **LogFileReader** (`log-file-reader.ts`): File reading with range request optimization (200KB tail reading) and comprehensive fallback mechanisms
- **LogFileDiscovery** (`log-file-discovery.ts`): File listing, filtering by date/level, metadata operations, chronological sorting, and job log discovery from `/Logs/jobs/[job name ID]/` folder structure
- **LogProcessor** (`log-processor.ts`): Log parsing, entry extraction, data manipulation, pattern processing, and job log processing (handles all log levels in single files)
- **LogAnalyzer** (`log-analyzer.ts`): Advanced analysis including pattern detection, health scoring, trend analysis, and recommendation generation
- **LogFormatter** (`log-formatter.ts`): Output formatting, presentation logic, user-friendly message templates, and job execution summaries
- **LogConstants** (`log-constants.ts`): Centralized constants, configuration values, message templates, and job log patterns
- **LogTypes** (`log-types.ts`): Comprehensive TypeScript interfaces for all log operations including job log types

##### **Service Clients** (`clients/`)
- **DocsClient** (`docs-client.ts`): Processes SFCC documentation and provides search capabilities across all namespaces
- **LogClient** (`log-client.ts`): Backward compatibility wrapper that re-exports the modular log system
- **SFRAClient** (`sfra-client.ts`): Provides comprehensive SFRA (Storefront Reference Architecture) documentation access including Server, Request, Response, QueryString, and render module documentation with method and property details
- **OCAPIClient** (`ocapi-client.ts`): Main OCAPI coordinator that orchestrates specialized clients and provides unified interface
- **BestPracticesClient** (`best-practices-client.ts`): Serves curated development guides including cartridge creation, ISML templates with security and performance guidelines, job framework development, LocalServiceRegistry service integrations with OAuth patterns and reusable module design, OCAPI/SCAPI hooks, SFRA controllers, SFRA models with JSON object layer design and architecture patterns, custom endpoints, security recommendations, and performance optimization strategies with hook reference tables
- **CartridgeGenerationClient** (`cartridge-generation-client.ts`): Generates complete cartridge structures with clean dependency injection for file system and path operations

#### **Configuration Management** (`config/`)
- **Configuration Factory** (`configuration-factory.ts`): Creates configurations for different modes
- **Config Loader** (`dw-json-loader.ts`): Handles dw.json and environment variable loading

#### **Service Layer** (`services/`)
- **Service Interfaces** (`index.ts`): Exports clean abstractions for system operations (IFileSystemService, IPathService)
- **FileSystemService** (`file-system-service.ts`): Production implementation of file system operations with Node.js fs module
- **PathService** (`path-service.ts`): Production implementation of path manipulation with Node.js path module
- **Mock Services**: Test implementations providing controlled behavior for unit testing without real file system access

#### **Utilities** (`utils/`)
- **Caching System** (`cache.ts`): Efficient caching for API responses and documentation
- **Logging** (`logger.ts`): Structured logging with debug capabilities
- **Path Resolution** (`path-resolver.ts`): Secure file path handling
- **Common Utilities** (`utils.ts`): Shared utility functions

#### **Tool Categories**

1. **SFCC Documentation Tools** (5 tools)
   - Class information and method documentation
   - API search and discovery
   - Complete SFCC namespace coverage

2. **Best Practices Guides** (4 tools)
   - Curated development guidelines
   - Security and performance recommendations
   - Hook reference tables and examples

3. **Enhanced SFRA Documentation Tools** (5 tools)
   - **Dynamic Discovery**: Automatically finds all 26+ SFRA documents including core classes, extensive model documentation
   - **Smart Categorization**: Organizes documents into 7 logical categories (core, product, order, customer, pricing, store, other)
   - **Advanced Search**: Relevance-scored search across all documents with context highlighting
   - **Category Filtering**: Explore documents by functional areas for efficient discovery
   - **Complete Coverage**: Core SFRA classes (Server, Request, Response, QueryString, render) plus comprehensive model documentation (account, cart, products, pricing, billing, shipping, store, customer management, totals, categories, content, locale, addresses, and more)

4. **Cartridge Generation Tools** (1 tool)
   - Automated cartridge structure creation with direct file generation
   - Complete project setup with all necessary configuration files
   - Proper directory organization and file structure

5. **Log Analysis Tools** (13 tools)
   - Real-time error monitoring
   - Log search and pattern matching
   - System health summarization
   - Job log analysis and debugging

6. **System Object Tools** (6 tools)
   - Custom attribute discovery
   - Site preference management
   - System object schema exploration
   - Custom object attribute definitions search

7. **Code Version Tools** (2 tools)
   - Code version listing and management
   - Code version activation for deployment fixes

### 🚀 Operating Modes

#### **Documentation-Only Mode**
- No SFCC credentials required
- Access to all documentation and best practices
- Perfect for learning and reference

#### **Full Mode**
- Requires SFCC instance credentials
- Complete access to logs, job logs, and system objects
- Real-time debugging and monitoring capabilities

### 🎯 Development Guidelines

When working on this project:

1. **Follow MCP Specifications**: Ensure all tools conform to MCP protocol requirements
2. **Maintain Type Safety**: Use TypeScript effectively with proper type definitions
3. **Handle Errors Gracefully**: Provide meaningful error messages and recovery strategies
4. **Test Thoroughly**: Write comprehensive tests for all new features
5. **Document Changes**: Update documentation for any new tools or capabilities
6. **Local Security Focus**: Protect developer credentials, prevent accidental network exposure, and avoid resource exhaustion
7. **Reasonable Performance**: Implement efficient caching and resource usage appropriate for single-developer workloads
8. **User Experience**: Design tools that are intuitive and helpful for individual developers
9. **Keep Documentation Current**: **Always update both copilot-instructions.md and README.md files** when making changes that affect:
    - File structure or directory organization
    - Class responsibilities or module purposes
    - API interfaces or tool definitions
    - Configuration options or operating modes
    - Development workflows or best practices
    - Tool categories or counts
    - Installation or setup procedures

### 📝 Documentation Maintenance Requirements

**Critical**: When making any structural or functional changes to the codebase, you **MUST** update the relevant sections in **BOTH** `.github/copilot-instructions.md` and `README.md`:

#### **Always Verify Counts with Command Line Tools:**

Before updating any documentation with tool counts or quantitative information, **ALWAYS** verify the actual numbers using command line tools:

```bash
# Total tool count verification
grep -c "name: '" src/core/tool-definitions.ts

# Individual section counts
awk '/export const SFCC_DOCUMENTATION_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"
awk '/export const BEST_PRACTICES_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"
awk '/export const SFRA_DOCUMENTATION_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"
awk '/export const LOG_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"
awk '/export const SYSTEM_OBJECT_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"
awk '/export const CARTRIDGE_GENERATION_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"
awk '/export const CODE_VERSION_TOOLS/,/^];/' src/core/tool-definitions.ts | grep -c "name: '"

# Verify file structure changes
find src -name "*.ts" -type f | wc -l  # Count TypeScript files
find docs -name "*.md" -type f | wc -l  # Count documentation files
```

**Never assume or estimate counts** - always verify with actual command line verification before updating documentation.

#### **Required Updates For:**
- **File Renames/Moves**: Update project structure diagram and component descriptions in copilot-instructions.md; update any file references in README.md
- **New Classes/Modules**: Add descriptions to the Key Components section in copilot-instructions.md; update feature lists in README.md if user-facing
- **Changed Responsibilities**: Modify class/module purpose descriptions in copilot-instructions.md; update feature descriptions in README.md
- **New Tools**: Update tool categories and counts in **both** files; add tool descriptions to README.md features section
- **Configuration Changes**: Update Operating Modes and Configuration Management sections in copilot-instructions.md; update configuration examples in README.md
- **New Development Patterns**: Add to Common Development Tasks in copilot-instructions.md
- **Architecture Changes**: Update Client Architecture and Key Components sections in copilot-instructions.md
- **Installation/Setup Changes**: Update installation and configuration sections in README.md
- **New Operating Modes**: Update both files with new mode descriptions and requirements
- **Tool Count Changes**: Update the "Available Tools by Mode" table in README.md and tool category counts in copilot-instructions.md

#### **Documentation Standards:**
- **copilot-instructions.md**: Focus on technical architecture, development guidelines, and internal structure
- **README.md**: Focus on user-facing features, installation, configuration, and usage examples
- Use clear, descriptive language that helps developers understand the codebase
- Include specific file paths and references where relevant
- Maintain consistency with existing documentation style and structure
- Provide context for why changes were made when updating architectural decisions
- Keep tool counts and feature lists accurate and current in both files

#### **When to Update:**
- **Immediately after** making structural changes (file renames, moves, deletions)
- **Before completing** feature development that adds new capabilities
- **During refactoring** that changes class responsibilities or module purposes
- **After adding** new tools, clients, or major functionality
- **When modifying** configuration systems or authentication flows
- **When changing** installation procedures or setup requirements
- **After updating** tool categories or operating modes

#### **Specific File Responsibilities:**

**copilot-instructions.md Updates:**
- Project structure diagram
- Key Components descriptions
- Tool Categories and counts
- Operating Modes technical details
- Development Guidelines
- Common Development Tasks
- Client Architecture descriptions

**README.md Updates:**
- Feature lists and descriptions
- Available Tools by Mode table
- Installation and setup instructions
- Configuration examples and options
- Usage examples and quick start guides
- Tool descriptions for end users

**Remember**: These documentation files serve as the primary source of truth for understanding the project. copilot-instructions.md guides development practices and architecture, while README.md serves users and contributors. Keeping both current ensures consistent understanding across all stakeholders and maintains professional project standards.

### 🔍 Common Development Tasks

- **Adding New Tools**: Define schema in `core/tool-definitions.ts`, implement handler in appropriate handler class in `core/handlers/`, or create new handler extending `BaseToolHandler`
- **Creating New Handlers**: Extend `BaseToolHandler` class, implement `canHandle()` and `handle()` methods, register in `server.ts`
- **Using ClientFactory**: Create clients using `ClientFactory` for centralized creation and dependency injection support
- **Implementing Services**: Create service interfaces in `services/index.ts`, implement production versions, and provide mock implementations for testing
- **Dependency Injection**: Use constructor injection for services, leverage `ClientFactory` for client creation with optional service injection
- **Updating Documentation**: Modify files in `docs/` and run conversion scripts
- **Enhancing Authentication**: Update `clients/base/oauth-token.ts` and client authentication logic
- **Improving Caching**: Enhance `utils/cache.ts` for better performance and data freshness
- **Adding Configuration Options**: Update `config/` modules for new configuration capabilities
- **Adding Tests**: Create comprehensive test coverage in the `tests/` directory with proper service mocking
- **Adding Utilities**: Extend `utils/` modules for shared functionality
- **Handler Development**: Follow the modular handler pattern - each handler is responsible for a specific tool category with clear separation of concerns
- **Cartridge Generation**: Use `generate_cartridge_structure` tool for automated cartridge creation with direct file generation
- **Job Log Analysis**: Use job log tools for debugging custom job steps - `get_latest_job_log_files`, `get_job_log_entries`, `search_job_logs`, `search_job_logs_by_name`, `get_job_execution_summary`
- **Modular Log Development**: Work with individual log modules in `clients/logs/` for specific functionality - modify `log-analyzer.ts` for analysis improvements, `log-formatter.ts` for output changes, or `log-file-reader.ts` for reading optimizations
- **Documentation Verification**: Always verify quantitative information (tool counts, file counts, etc.) using command line tools before updating documentation - use `grep -c`, `find`, `wc -l`, and `awk` commands to get accurate counts rather than estimating or assuming values
- **CI-Friendly Performance Testing**: When writing performance tests, use lenient timeouts (500ms+) and variation ratios (50x+) to account for GitHub Actions CI environment variability. Prioritize functional validation over strict timing requirements to prevent flaky failures due to infrastructure differences.

### � MCP Server Testing and Debugging with Conductor

The **MCP Conductor** (`npx conductor query`) is the primary tool for testing and debugging the MCP server during development. It provides direct access to server tools and responses, making it essential for validation and troubleshooting.

#### **Basic Conductor Usage**

```bash
# Test a tool with the documentation-only configuration
npx conductor query --config ./conductor.config.docs-only.json [tool-name] '[json-arguments]'

# Example: Search SFRA documentation
npx conductor query --config ./conductor.config.docs-only.json search_sfra_documentation '{"query": "render"}'

# Example: Generate cartridge structure
npx conductor query --config ./conductor.config.docs-only.json generate_cartridge_structure '{"cartridgeName": "test_cartridge", "targetPath": "/tmp/test"}'
```

#### **Configuration Files**

- **`conductor.config.docs-only.json`**: For testing documentation-only mode (no SFCC credentials required)
- **`conductor.config.with-dw.json`**: For testing full mode with SFCC credentials (requires dw.json with valid sandbox details)

#### **Common Conductor Commands**

```bash
# List all available tools
npx conductor query --config ./conductor.config.docs-only.json --method tools/list

# Get tool schema information
npx conductor query --config ./conductor.config.docs-only.json --method tools/call --params '{"name": "get_sfcc_class_info", "arguments": {"className": "dw.catalog.Product"}}'

# Test best practice guides
npx conductor query --config ./conductor.config.docs-only.json get_best_practice_guide '{"guideName": "cartridge_creation"}'

# Test SFCC class searches
npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": "catalog"}'
```

#### **Debugging Tool Responses**

When developing or debugging tools, use conductor to inspect actual response formats:

```bash
# Capture full response structure for test validation
npx conductor query --config ./conductor.config.docs-only.json [tool-name] '[args]' | head -50

# Test error handling
npx conductor query --config ./conductor.config.docs-only.json [tool-name] '{"invalid": "parameters"}'

# Verify JSON response structure
npx conductor query --config ./conductor.config.docs-only.json [tool-name] '[args]' | jq '.'
```

#### **Development Workflow Integration**

1. **Tool Development**: After implementing a new tool, immediately test with conductor before writing unit tests
2. **Response Validation**: Use conductor to capture actual response structures when writing test assertions
3. **Error Testing**: Verify error handling behavior with invalid parameters through conductor
4. **Configuration Testing**: Test both docs-only and full modes to ensure proper tool availability
5. **Integration Testing**: Validate tool interactions and data flow using conductor before automated tests

#### **Critical: Response Format Discovery Before Writing Tests**

**ALWAYS use conductor query to understand actual response formats before writing YAML tests.** This prevents test failures due to incorrect assumptions about response structure.

##### **Essential Pre-Test Discovery Process:**

1. **Query the tool with sample arguments** to see actual response format:
   ```bash
   npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": "catalog"}'
   ```

2. **Test edge cases** (empty results, errors) to understand all response variations:
   ```bash
   npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": "zzznothingfound"}'
   npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": ""}'
   ```

3. **Document the actual response structure** before writing test expectations:
   - Is it a JSON object with metadata fields like `{classes: [], totalCount: 5, searchTerm: "query"}`?
   - Or a simple JSON array like `["dw.catalog.Product", "dw.catalog.Catalog"]`?
   - Does it return `[]` for no results or `{classes: [], totalCount: 0}`?

4. **Use the correct validation patterns** based on actual responses:
   ```yaml
   # For JSON array responses
   text: "match:regex:\\[[\\s\\S]*\\]"
   
   # For empty array responses  
   text: "match:regex:^\\[\\s*\\]$"
   
   # For JSON object responses
   text: "match:regex:\\{[\\s\\S]*\\}"
   
   # For specific content validation
   text: "match:contains:dw.catalog.Product"
   ```

##### **Common Testing Mistakes to Avoid:**

- **Assuming JSON structure without verification**: Don't expect `{classes: [], totalCount: 5}` if tool returns `["class1", "class2"]`
- **Wrong empty result validation**: Using `match:exact:[]` instead of `match:regex:^\\[\\s*\\]$`
- **Missing edge case testing**: Not testing empty queries, invalid parameters, or no-result scenarios
- **Incorrect pattern syntax**: Using `contains:classes` instead of `match:contains:classes`

##### **Response Format Discovery Examples:**

```bash
# Discover structure for class search
npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": "catalog"}'
# Result: ["dw.catalog.Catalog", "dw.catalog.Product", ...] (simple array)

# Discover empty result format  
npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": "zzznothingfound"}'
# Result: [] (empty array)

# Discover error response format
npx conductor query --config ./conductor.config.docs-only.json search_sfcc_classes '{"query": ""}'
# Result: {"content": [{"type": "text", "text": "Error: ..."}], "isError": true}
```

**Remember**: The time spent discovering actual response formats with conductor saves hours of debugging failed tests later. Always query first, then write tests based on reality, not assumptions.

#### **Troubleshooting with Conductor**

- **Tool Not Found**: Check configuration mode (docs-only vs full) and ensure tool is properly registered
- **Invalid Arguments**: Use conductor to test parameter validation and see exact error messages
- **Response Issues**: Compare conductor output with programmatic test expectations to identify format mismatches
- **Performance Issues**: Use conductor timing information to identify slow tools
- **Authentication Problems**: Test full-mode tools with conductor to validate OCAPI/WebDAV connections

#### **Best Practices**

- **CRITICAL: Always discover response formats first** - Use conductor query to understand actual response structure before writing any tests
- **Always test new tools** with conductor before writing automated tests
- **Use conductor output** to write accurate test assertions rather than guessing response formats  
- **Test both success and error cases** with conductor during development
- **Verify tool availability** in different configuration modes using conductor
- **Debug programmatic test failures** by comparing with conductor CLI results
- **Test parameter validation** using conductor with various input combinations
- **Document actual response formats** in test file comments for future reference
- **Test edge cases comprehensively** - empty results, invalid inputs, missing parameters
- **Use correct YAML pattern syntax** - always prefix with `match:` for validation patterns

#### **CI-Friendly Performance Testing Guidelines**

When writing performance-related tests, especially for GitHub Actions CI environments, follow these critical guidelines:

- **Use Lenient Timeouts**: Set timeout thresholds of **500ms or higher** instead of strict values (50ms-250ms). CI environments are slower and less predictable than local development machines.
- **Account for Environment Variability**: CI runners experience resource contention, cold starts, network latency, and I/O scheduling delays that can significantly impact timing.
- **Performance Variation Ratios**: For tests comparing min/max performance, use ratios of **50x or higher** instead of strict ratios (15x). CI environments can have extreme variations due to:
  - Resource sharing with other processes
  - JIT compilation and garbage collection delays  
  - Network and file system variability
  - Container initialization overhead
- **Scaling Calculations**: When calculating expected performance based on result count, use generous base times (100ms+) and scaling factors (2ms+ per item) rather than tight calculations.
- **Focus on Functional Validation**: Prioritize correctness over strict performance requirements. Performance tests should catch major regressions, not minor timing variations.
- **Example CI-Friendly Assertions**:
  ```javascript
  // ❌ Too strict for CI
  assert.ok(duration < 50, `Response time should be under 50ms`);
  assert.ok(variationRatio < 15, `Performance variation should be under 15x`);
  
  // ✅ CI-friendly
  assert.ok(duration < 500, `Response time should be under 500ms`);
  assert.ok(variationRatio < 50, `Performance variation should be under 50x`);
  ```

**Remember**: The goal is reliable CI builds that catch real issues without flaky failures due to infrastructure timing differences.

#### **Comprehensive Testing Documentation**

For comprehensive MCP testing guidance, refer to the specialized AGENTS.md files in the testing directories:

##### **YAML-Based Declarative Testing** (`tests/mcp/yaml/AGENTS.md`)
The primary testing approach using human-readable YAML files with advanced pattern matching:

- **30+ Advanced Pattern Matching**: String patterns, numeric comparisons, date validation, array operations, field extraction, cross-field validation, and pattern negation
- **Declarative YAML Testing**: Human-readable test files with sophisticated validation patterns
- **Interactive Tool Testing**: Quick commands for testing tools interactively with the conductor CLI
- **Debugging Workflows**: Step-by-step approaches for troubleshooting test failures and server issues
- **Real-World Examples**: Complete test suites for filesystem servers, multi-tool servers, and API testing scenarios
- **Performance Testing**: Patterns for validating response times and system performance
- **Error Handling Validation**: Comprehensive approaches to testing error scenarios and edge cases

##### **Programmatic JavaScript/TypeScript Testing** (`tests/mcp/node/AGENTS.md`)
For complex testing scenarios requiring programmatic logic and integration with existing test suites:

- **JavaScript/TypeScript API**: Full programmatic access to MCP server testing capabilities
- **Advanced Workflows**: Multi-step testing, state management, and dynamic validation logic
- **Framework Integration**: Jest, Mocha, and Node.js test runner integration patterns
- **Performance Monitoring**: Built-in metrics collection and performance analysis
- **Buffer Management**: Critical guidance on preventing test interference with proper `clearStderr()` usage
- **Error Recovery Testing**: Comprehensive error handling and resilience validation
- **TypeScript Support**: Full type safety for enterprise testing environments

**Quick Interactive Testing Commands:**
```bash
# List all available tools
conductor query --config ./conductor.config.docs-only.json

# Test specific tool with arguments
conductor query tool_name '{"param": "value"}' --config ./conductor.config.docs-only.json

# Debug with verbose output
conductor query tool_name '{"param": "value"}' --config ./conductor.config.docs-only.json --verbose
```

**For AI Agents**: Both AGENTS.md files are specifically designed for AI assistants to understand how to create and execute comprehensive test suites for MCP servers. Choose YAML-based testing for declarative scenarios or programmatic testing for complex logic requirements. Both approaches can be directly applied to validate this SFCC Dev MCP server's functionality.

### �📁 Directory Organization Benefits

The new organized structure provides:

1. **Clear Separation of Concerns**: Each directory has a specific responsibility
2. **Easier Navigation**: Developers can quickly find related functionality
3. **Better Maintainability**: Changes are isolated to relevant directories
4. **Scalable Architecture**: New features can be added without cluttering
5. **Professional Standards**: Follows TypeScript/Node.js project conventions

### 🏗️ Handler Architecture Benefits

The modular handler refactoring provides:

1. **Separation of Concerns**: Each handler is responsible for a specific category of tools
2. **Standardized Interface**: All handlers extend `BaseToolHandler` with consistent patterns
3. **Better Error Handling**: Centralized error handling and response formatting in base class
4. **Improved Maintainability**: Tool logic is organized by functional area rather than mixed together
5. **Easier Testing**: Individual handlers can be tested in isolation
6. **Performance Monitoring**: Standardized execution timing and logging across all handlers
7. **Extensibility**: New tool categories can be added by creating new handler classes
8. **Code Reusability**: Common functionality shared through the base handler class

### 🔧 Dependency Injection Architecture

The comprehensive dependency injection implementation provides:

1. **Clean Testing**: Mock services replace complex system module mocking patterns
2. **Modular Design**: Service interfaces enable easy swapping of implementations
3. **Reduced Coupling**: Components depend on abstractions, not concrete implementations
4. **Centralized Creation**: `ClientFactory` provides consistent client instantiation patterns
5. **Type Safety**: Full TypeScript support for all service interfaces and implementations
6. **Maintainable Tests**: Simple interface mocking instead of complex system module stubs
7. **Production Flexibility**: Easy to swap implementations for different environments
8. **Clear Boundaries**: Well-defined service layer separates business logic from system operations

### 📊 Modular Log Architecture Benefits

The comprehensive log client refactoring provides:

1. **Single Responsibility Principle**: Each module has one focused purpose (reading, parsing, analysis, formatting)
2. **Improved Maintainability**: Changes to log parsing logic don't affect file reading or output formatting
3. **Better Testing**: Individual modules can be tested in isolation with targeted test cases
4. **Performance Optimization**: Range request optimization isolated in `log-file-reader.ts` for focused improvements
5. **Extensible Analysis**: New analysis patterns can be added to `log-analyzer.ts` without affecting other components
6. **Flexible Output**: Multiple output formats can be supported by extending `log-formatter.ts`
7. **Centralized Configuration**: All constants and configuration values managed in `log-constants.ts`
8. **Type Safety**: Comprehensive TypeScript interfaces in `log-types.ts` for all log operations
9. **Backward Compatibility**: Original API preserved through orchestrator pattern in main `log-client.ts`

This MCP server empowers AI agents to provide accurate, real-time assistance for SFCC development workflows, significantly improving developer productivity and code quality

