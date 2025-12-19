# AGENTS.md – SFCC Development MCP Server (AI Coding Agent Instructions)

This file provides authoritative, agent-focused operational guidelines. It complements `README.md` by documenting build/test workflows, architectural conventions, and maintenance rules that would clutter a human-facing introduction.

Goals of `AGENTS.md`:
- Give any AI coding agent (Copilot, Cursor, Claude, Gemini, Aider, Factory, Ona, Devin, Zed, etc.) a predictable place to load project instructions
- Separate contributor onboarding (README) from deep operational detail (here)
- Encourage portable, open, plain-Markdown instructions (no proprietary schema)

Agent Operating Principles (Quick Commit Rules):
1. Verify reality first (counts, structures) with commands—never guess
2. Make surgical diffs—no drive‑by formatting or unrelated refactors
3. Validate after every substantive change (build + lint + relevant tests)
4. Prefer explicit, readable code & docs over clever abstractions
5. Surface ambiguity or risky instructions with safer alternatives
6. Keep `AGENTS.md` ↔ `README.md` in sync where they overlap (update both or neither)
7. Discover actual tool response formats with `npx aegis query` before writing tests
8. Treat security (credentials, paths, network) as a first‑class concern—assume local but protect anyway
9. Defer performance tuning unless a measurable issue exists; avoid premature micro‑optimizations
10. Fail loud & clear: actionable error messages, user vs system error distinction


## 🤖 Unified Engineering Principles & Persona
Operate as a senior TypeScript / Node.js engineer with deep MCP + SFCC (OCAPI, SCAPI, WebDAV, logs, system objects, preferences) domain knowledge. Apply the following unified principles (consolidates former Persona, Professional Standards, Development Approach, and Development Guidelines):

### Core Competencies
- MCP protocol compliance & tool schema rigor
- SFCC integration breadth: logs, job logs, OCAPI auth, system objects, site preferences
- Strong TypeScript typing, safe narrowing, interface-driven design
- OAuth + token lifecycle correctness
- Log & job execution analysis (parsing, summarization, health signals)
- Documentation ingestion (scan → parse → resolve → extract types)
- Multi-layer test strategy: Jest (unit) + Aegis YAML (declarative) + Node programmatic (stateful)

### Quality & Safety
- Intentional, maintainable code; small reversible changes
- Security first: never leak credentials, avoid accidental network exfiltration, sanitize paths
- Explicit error modeling: distinguish user input errors vs system/internal failures
- Deterministic + cache-aware logic; avoid hidden side effects
- Respect local dev constraints—opt for lightweight operations

### Documentation Discipline
- Update BOTH `AGENTS.md` & `README.md` for: tool count changes, new handlers, structural moves, added operating modes, configuration shifts
- Quantify before asserting (grep / awk / find) – no hand-waved counts
- Keep architectural diagrams & tool categories consistent with `src/core/tool-definitions.ts`

### Testing Strategy
- Always discover real response shape with `npx aegis query` (success, empty, error variants) before writing tests
- Unit tests: core utilities, parsing, validation, token & client logic
- YAML tests: broad tool surface, schema/shape validation, edge cases
- Programmatic tests: multi-step flows, stderr management, stateful sequences
- Performance assertions: CI‑tolerant (<500ms typical, variation <50×) – functional correctness first

### Implementation Workflow
1. Define or adjust tool schema (if new) in `core/tool-definitions.ts`
2. Implement / extend handler (or add new) with clear separation of concerns
3. Add / update clients & services with DI-friendly patterns (`ClientFactory` + interfaces)
4. Run targeted Aegis discovery (success + edge) to capture real output
5. Write/adjust tests (unit + YAML/programmatic where appropriate)
6. Verify counts & update docs (both files) atomically
7. Run lint + tests; address failures before further edits
8. Commit with concise, scope-focused message

### YAML Test Development (Critical Process)
**MANDATORY for all YAML test modifications**: Before writing or modifying ANY YAML test:

1. **Discovery First**: Use `npx aegis query [tool_name] '[params]' --config "[config.json]"` to discover actual response formats
2. **Test Success & Failure**: Query both successful and failure scenarios to understand all response variations
3. **Document Findings**: Add comments to YAML tests showing discovery commands and expected formats
4. **Choose Correct Patterns**: Use patterns that match the actual response structure, not assumptions

**Common Mistakes to Avoid**:
- Using `arrayLength` on JSON strings instead of actual arrays
- Complex regex patterns instead of simpler `contains` or `regex` patterns
- Assuming response structure without verification
- Writing tests before understanding what the tool actually returns

**Example Discovery Process**:
```bash
# Discover actual response
npx aegis query get_available_best_practice_guides '{}' --config "./aegis.config.docs-only.json"
# Response: {"content": [{"type": "text", "text": "[{\"name\":\"guide1\",...}]"}], "isError": false}
# Pattern: text: "match:contains:guide1" (not arrayLength since it's a JSON string)
```

### Performance & Stability
- Optimize only after measuring; instrument where ambiguity exists
- Use caching deliberately; document invalidation triggers
- Keep handler execution time predictable; stream or range-read logs where possible

### When In Doubt
- Pause and gather empirical data
- Prefer minimal, additive change over speculative refactor
- Escalate ambiguity via explicit options rather than guessing

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
│   │   ├── tool-definitions.ts   # Re-exports tool schemas from modular files
│   │   ├── tool-schemas/         # Modular tool schema definitions
│   │   │   ├── index.ts          # Aggregates and re-exports all tool schemas
│   │   │   ├── shared-schemas.ts # Reusable schema components (query, pagination, etc.)
│   │   │   ├── documentation-tools.ts # SFCC documentation tools (5 tools)
│   │   │   ├── best-practices-tools.ts # Best practices tools (4 tools)
│   │   │   ├── sfra-tools.ts     # SFRA documentation tools (5 tools)
│   │   │   ├── isml-tools.ts     # ISML documentation tools (5 tools)
│   │   │   ├── log-tools.ts      # Log + Job log tools (8 + 5 tools)
│   │   │   ├── system-object-tools.ts # System object tools (6 tools)
│   │   │   ├── cartridge-tools.ts # Cartridge generation tools (1 tool)
│   │   │   └── code-version-tools.ts # Code version tools (2 tools)
│   │   └── handlers/             # Modular tool handlers
│   │       ├── base-handler.ts   # Abstract base handler with common functionality
│   │       ├── abstract-client-handler.ts # Abstract handler for client-based tools
│   │       ├── simple-client-handler.ts # Simple handler for single-client tools
│   │       ├── client-factory.ts # Centralized client creation with dependency injection
│   │       ├── validation-helpers.ts # Common validation utilities for handlers
│   │       ├── docs-handler.ts   # SFCC documentation tool handler
│   │       ├── best-practices-handler.ts # Best practices tool handler
│   │       ├── sfra-handler.ts   # SFRA documentation tool handler
│   │       ├── isml-handler.ts   # ISML documentation tool handler
│   │       ├── log-handler.ts    # Log analysis tool handler
│   │       ├── job-log-handler.ts # Job log analysis tool handler
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
│   │   ├── docs/                 # Modular SFCC documentation system
│   │   │   ├── documentation-scanner.ts # Documentation file discovery and class listing
│   │   │   ├── class-content-parser.ts # Markdown parsing and content extraction
│   │   │   ├── class-name-resolver.ts # Class name normalization and resolution
│   │   │   ├── referenced-types-extractor.ts # Type extraction from documentation content
│   │   │   └── index.ts          # Module exports
│   │   ├── cartridge/            # Cartridge generation system
│   │   │   ├── cartridge-generation-client.ts # Main cartridge structure generator
│   │   │   ├── cartridge-structure.ts # Directory structure definitions
│   │   │   ├── cartridge-templates.ts # File content templates
│   │   │   └── index.ts          # Module exports
│   │   ├── log-client.ts         # Log client compatibility wrapper
│   │   ├── docs-client.ts        # SFCC documentation client orchestrator
│   │   ├── sfra-client.ts        # SFRA documentation client
│   │   ├── isml-client.ts        # ISML element documentation client
│   │   ├── ocapi-client.ts       # Main OCAPI client coordinator
│   │   └── best-practices-client.ts # Best practices guide client
│   ├── services/                 # Service layer with clean abstractions
│   │   ├── index.ts              # Service exports and type definitions
│   │   ├── file-system-service.ts # File system operations service
│   │   └── path-service.ts       # Path manipulation service
│   ├── config/                   # Configuration management
│   │   ├── configuration-factory.ts # Config factory for different modes
│   │   └── dw-json-loader.ts     # dw.json configuration loader
│   ├── constants/                # Application constants
│   │   ├── index.ts              # Constants exports
│   │   └── best-practices-guides.ts # Best practices guide definitions
│   ├── tool-configs/             # Tool configuration definitions
│   │   ├── best-practices-tool-config.ts # Best practices tools configuration
│   │   ├── cartridge-tool-config.ts # Cartridge generation tools configuration
│   │   ├── code-version-tool-config.ts # Code version tools configuration
│   │   ├── docs-tool-config.ts   # Documentation tools configuration
│   │   ├── job-log-tool-config.ts # Job log tools configuration
│   │   ├── log-tool-config.ts    # Log analysis tools configuration
│   │   ├── sfra-tool-config.ts   # SFRA documentation tools configuration
│   │   └── system-object-tool-config.ts # System object tools configuration
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
│   │   ├── sfra_client_side_js.md # SFRA client-side JavaScript patterns
│   │   ├── sfra_scss.md           # SFRA SCSS override and theming guidance
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
├── docs-site/                   # React documentation website
│   ├── App.tsx                  # Main React application component
│   ├── main.tsx                 # React application entry point
│   ├── index.html               # HTML template with SEO and structured data
│   ├── constants.tsx            # Application constants and configuration
│   ├── metadata.json            # Site metadata configuration
│   ├── types.ts                 # TypeScript type definitions
│   ├── package.json             # Node.js dependencies and scripts
│   ├── vite.config.ts           # Vite build configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── README.md                # Documentation site specific README
│   ├── components/              # Reusable React components
│   │   ├── Badge.tsx            # Badge component for status/categories
│   │   ├── CodeBlock.tsx        # Syntax highlighted code blocks
│   │   ├── Collapsible.tsx      # Collapsible content sections
│   │   ├── ConfigBuilder.tsx    # Configuration builder component
│   │   ├── ConfigHero.tsx       # Configuration page hero section
│   │   ├── ConfigModeTabs.tsx   # Configuration mode tab switcher
│   │   ├── Layout.tsx           # Main layout wrapper component
│   │   ├── NewcomerCTA.tsx      # Call-to-action for new users
│   │   ├── NextStepsStrip.tsx   # Next steps guidance component
│   │   ├── OnThisPage.tsx       # Table of contents component
│   │   ├── Search.tsx           # Search functionality component
│   │   ├── Sidebar.tsx          # Site navigation sidebar
│   │   ├── ToolCard.tsx         # Tool display card component
│   │   ├── ToolFilters.tsx      # Tool filtering controls
│   │   ├── Typography.tsx       # Typography components (H1, H2, etc.)
│   │   ├── VersionBadge.tsx     # Version display badge
│   │   └── icons.tsx            # Icon components library
│   ├── pages/                   # Page components for routing
│   │   ├── HomePage.tsx         # Homepage with quick start guide
│   │   ├── AIInterfacesPage.tsx # AI interface setup guides
│   │   ├── ConfigurationPage.tsx # Configuration documentation
│   │   ├── DevelopmentPage.tsx  # Development guidelines
│   │   ├── ExamplesPage.tsx     # Usage examples
│   │   ├── FeaturesPage.tsx     # Feature documentation
│   │   ├── SecurityPage.tsx     # Security considerations
│   │   ├── ToolsPage.tsx        # Available tools documentation
│   │   └── TroubleshootingPage.tsx # Troubleshooting guide
│   ├── src/                     # Source assets and generated files
│   │   ├── generated-search-index.ts # Generated search index
│   │   └── styles/              # CSS and styling files
│   ├── utils/                   # Utility functions
│   │   ├── search.ts            # Search functionality utilities
│   │   └── toolsData.ts         # Tools data management
│   ├── scripts/                 # Build and utility scripts
│   │   ├── generate-search-index.js # Search index generation script
│   │   ├── generate-sitemap.js  # Sitemap generation script
│   │   └── search-dev.js        # Development search utilities
│   ├── public/                  # Static assets
│   │   ├── 404.html             # Custom 404 error page
│   │   ├── robots.txt           # Search engine crawling instructions
│   │   ├── sitemap.xml          # Site map for search engines
│   │   ├── llms.txt             # LLM-specific instructions
│   │   ├── favicon.ico          # Website favicon
│   │   ├── favicon-16x16.png    # 16x16 favicon variant
│   │   ├── favicon-32x32.png    # 32x32 favicon variant
│   │   ├── apple-touch-icon.png # Apple touch icon
│   │   ├── android-chrome-192x192.png # Android Chrome icon 192x192
│   │   ├── android-chrome-512x512.png # Android Chrome icon 512x512
│   │   ├── site.webmanifest     # Web app manifest
│   │   ├── index.css            # Global CSS styles
│   │   ├── explain-product-pricing-methods.png # Demo screenshot with MCP
│   │   └── explain-product-pricing-methods-no-mcp.png # Demo screenshot without MCP
│   ├── dist/                    # Built website output (Vite build)
│   └── node_modules/            # Node.js dependencies
├── ai-instructions/             # AI instruction files for different platforms
│   ├── claude-desktop/          # Claude Desktop specific instructions
│   │   └── claude_custom_instructions.md
│   ├── cursor/                  # Cursor editor specific instructions
│   └── github-copilot/          # GitHub Copilot specific instructions
│       └── copilot-instructions.md
├── tests/                       # Comprehensive test suite
│   ├── __mocks__/               # Mock implementations for testing
│   │   └── src/                 # Source code mocks
│   ├── mcp/                     # MCP-specific testing tools
│   │   ├── node/                # Programmatic JavaScript/TypeScript testing
│   │   ├── yaml/                # YAML-based declarative testing
│   │   └── test-fixtures/       # Test fixtures and sample data
│   ├── servers/                 # Test server implementations
│   │   └── webdav/              # WebDAV server mocks
│   ├── *.test.ts                # Individual test files for components
│   └── [various test files]     # Unit and integration tests
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
- **AbstractClientHandler** (`abstract-client-handler.ts`): Abstract handler for tools that require client instantiation
- **SimpleClientHandler** (`simple-client-handler.ts`): Simplified handler for single-client tools with less boilerplate
- **ClientFactory** (`client-factory.ts`): Centralized client creation with dependency injection support for testing and clean architecture
- **ValidationHelpers** (`validation-helpers.ts`): Common validation utilities shared across all handlers
- **DocsToolHandler** (`docs-handler.ts`): Handles SFCC documentation tools including class information, method search, and API discovery
- **BestPracticesToolHandler** (`best-practices-handler.ts`): Manages best practice guides, security recommendations, and hook reference tables
- **SFRAToolHandler** (`sfra-handler.ts`): Processes SFRA documentation requests with dynamic discovery and smart categorization
- **ISMLToolHandler** (`isml-handler.ts`): Handles ISML element documentation, search, and category browsing
- **LogToolHandler** (`log-handler.ts`): Handles real-time log analysis, error monitoring, and system health summarization
- **JobLogToolHandler** (`job-log-handler.ts`): Handles job log analysis, debugging, and execution summaries
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

##### **Modular SFCC Documentation System** (`clients/docs/`)
- **DocumentationScanner** (`documentation-scanner.ts`): File discovery and class listing across all SFCC namespaces, scanning Markdown documentation files and building comprehensive class inventories
- **ClassContentParser** (`class-content-parser.ts`): Markdown parsing and content extraction, processing class documentation to extract methods, properties, constants, and inheritance information
- **ClassNameResolver** (`class-name-resolver.ts`): Class name normalization and resolution, handling various naming patterns and ensuring consistent class identification across the documentation system
- **ReferencedTypesExtractor** (`referenced-types-extractor.ts`): Type extraction from documentation content with circular reference protection, identifying SFCC types used in method signatures and class relationships

##### **Service Clients** (`clients/`)
- **DocsClient** (`docs-client.ts`): Main orchestrator for SFCC documentation processing that coordinates specialized modules for documentation scanning, content parsing, class name resolution, and type extraction across all namespaces
- **LogClient** (`log-client.ts`): Backward compatibility wrapper that re-exports the modular log system
- **SFRAClient** (`sfra-client.ts`): Provides comprehensive SFRA (Storefront Reference Architecture) documentation access including Server, Request, Response, QueryString, and render module documentation with method and property details
- **ISMLClient** (`isml-client.ts`): Provides ISML element documentation, category-based browsing, and search functionality for template development
- **OCAPIClient** (`ocapi-client.ts`): Main OCAPI coordinator that orchestrates specialized clients and provides unified interface
- **BestPracticesClient** (`best-practices-client.ts`): Serves curated development guides including cartridge creation, ISML templates with security and performance guidelines, job framework development, LocalServiceRegistry service integrations with OAuth patterns and reusable module design, OCAPI/SCAPI hooks, SFRA controllers, SFRA models with JSON object layer design and architecture patterns, SFRA client-side JavaScript architecture (AJAX flows, validation, accessibility), custom endpoints, security recommendations, and performance optimization strategies with hook reference tables

##### **Cartridge Generation** (`clients/cartridge/`)
- **CartridgeGenerationClient** (`cartridge-generation-client.ts`): Generates complete cartridge structures with clean dependency injection for file system and path operations
- **CartridgeStructure** (`cartridge-structure.ts`): Defines standard SFCC cartridge directory structure
- **CartridgeTemplates** (`cartridge-templates.ts`): Contains file templates for controllers, models, scripts, and configurations

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
   - SFRA client-side JavaScript architecture (AJAX, validation, accessibility)
   - Hook reference tables and examples

3. **Enhanced SFRA Documentation Tools** (5 tools)
   - **Dynamic Discovery**: Automatically finds all 26+ SFRA documents including core classes, extensive model documentation
   - **Smart Categorization**: Organizes documents into 7 logical categories (core, product, order, customer, pricing, store, other)
   - **Advanced Search**: Relevance-scored search across all documents with context highlighting
   - **Category Filtering**: Explore documents by functional areas for efficient discovery
   - **Complete Coverage**: Core SFRA classes (Server, Request, Response, QueryString, render) plus comprehensive model documentation (account, cart, products, pricing, billing, shipping, store, customer management, totals, categories, content, locale, addresses, and more)

4. **ISML Documentation Tools** (5 tools)
   - Complete ISML element reference and documentation
   - Control flow elements (isif, isloop, isnext, etc.)
   - Output formatting (isprint) and includes (isinclude, iscomponent, isslot)
   - Scripting elements (isscript, isset) and caching (iscache)
   - Category-based browsing and advanced search capabilities

5. **Cartridge Generation Tools** (1 tool)
   - Automated cartridge structure creation with direct file generation
   - Complete project setup with all necessary configuration files
   - Proper directory organization and file structure

6. **Log Analysis Tools** (8 tools)
   - Real-time error monitoring
   - Log search and pattern matching
   - System health summarization

7. **Job Log Tools** (5 tools)
   - Job log analysis and debugging
   - Job execution summaries
   - Custom job step monitoring

8. **System Object Tools** (6 tools)
   - Custom attribute discovery
   - Site preference management
   - System object schema exploration
   - Custom object attribute definitions search

9. **Code Version Tools** (2 tools)
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
See Unified Engineering Principles section above for the authoritative guidelines covering:
- Configuration options and operating modes
- Development workflows and best practices
- Tool categories and counts
- Installation and setup procedures

### 📝 Documentation Maintenance Requirements

**Critical**: When making any structural or functional changes to the codebase, you **MUST** update the relevant sections in **BOTH** `AGENTS.md` and `README.md`:

#### **Always Verify Counts with Command Line Tools:**

Before updating any documentation with tool counts or quantitative information, **ALWAYS** verify the actual numbers using command line tools:

```bash
# Total tool count verification (41 tools across all categories)
grep -c "name: '" src/core/tool-schemas/*.ts | grep -v ":0" | awk -F: '{sum+=$2} END {print "Total tools:", sum}'

# Individual category counts (from modular schema files)
echo "Documentation tools:" && grep -c "name: '" src/core/tool-schemas/documentation-tools.ts
echo "Best practices tools:" && grep -c "name: '" src/core/tool-schemas/best-practices-tools.ts
echo "SFRA tools:" && grep -c "name: '" src/core/tool-schemas/sfra-tools.ts
echo "ISML tools:" && grep -c "name: '" src/core/tool-schemas/isml-tools.ts
echo "Log + Job log tools:" && grep -c "name: '" src/core/tool-schemas/log-tools.ts
echo "System object tools:" && grep -c "name: '" src/core/tool-schemas/system-object-tools.ts
echo "Cartridge tools:" && grep -c "name: '" src/core/tool-schemas/cartridge-tools.ts
echo "Code version tools:" && grep -c "name: '" src/core/tool-schemas/code-version-tools.ts

# Verify file structure changes
find src -name "*.ts" -type f | wc -l  # Count TypeScript files
find docs -name "*.md" -type f | wc -l  # Count documentation files
```

**Never assume or estimate counts** - always verify with actual command line verification before updating documentation.

#### **Required Updates For:**
- **File Renames/Moves**: Update project structure diagram and component descriptions in AGENTS.md; update any file references in README.md
- **New Classes/Modules**: Add descriptions to the Key Components section in AGENTS.md; update feature lists in README.md if user-facing
- **Changed Responsibilities**: Modify class/module purpose descriptions in AGENTS.md; update feature descriptions in README.md
- **New Tools**: Update tool categories and counts in **both** files; add tool descriptions to README.md features section
- **Configuration Changes**: Update Operating Modes and Configuration Management sections in AGENTS.md; update configuration examples in README.md
- **New Development Patterns**: Add to Common Development Tasks in AGENTS.md
- **Architecture Changes**: Update Client Architecture and Key Components sections in AGENTS.md
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

**AGENTS.md Updates:**
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

**Remember**: These documentation files serve as the primary source of truth for understanding the project. `AGENTS.md` guides development practices and architecture, while `README.md` serves users and contributors. Keeping both current ensures consistent understanding across all stakeholders and maintains professional project standards.

### 🔧 Common Development Tasks (Streamlined)

- **Adding New Tools**: Define schema in `core/tool-schemas/[category]-tools.ts`, add to exports in `core/tool-schemas/index.ts`, implement handler in appropriate handler class in `core/handlers/`, or create new handler extending `BaseToolHandler`
- **Creating New Handlers**: Extend `BaseToolHandler` class, implement `canHandle()` and `handle()` methods, register in `server.ts`
- **Using ClientFactory**: Create clients using `ClientFactory` for centralized creation and dependency injection support
- **Implementing Services**: Create service interfaces in `services/index.ts`, implement production versions, and provide mock implementations for testing
- **Dependency Injection**: Use constructor injection for services, leverage `ClientFactory` for client creation with optional service injection
- **Updating Documentation**: Modify files in `docs/` and run conversion scripts
- **Enhancing Authentication**: Update `clients/base/oauth-token.ts` and client authentication logic
- **Improving Caching**: Enhance `utils/cache.ts` for better performance and data freshness
- **Adding Configuration Options**: Update `config/` modules for new configuration capabilities
- **Adding Tests**: Create comprehensive test coverage in the `tests/` directory with proper service mocking
- **MCP Test Execution**: Use `node --test` for individual MCP programmatic tests, NOT `npm test -- file.js` (which runs Jest)
- **Test Types**: Jest for unit tests (`tests/` directory), Node.js test runner for MCP programmatic tests (`tests/mcp/node/`), Aegis for YAML tests (`tests/mcp/yaml/`)
- **Adding Utilities**: Extend `utils/` modules for shared functionality
- **Handler Development**: Follow the modular handler pattern - each handler is responsible for a specific tool category with clear separation of concerns
- **Cartridge Generation**: Use `generate_cartridge_structure` tool for automated cartridge creation with direct file generation
- **Job Log Analysis**: Use job log tools for debugging custom job steps - `get_latest_job_log_files`, `get_job_log_entries`, `search_job_logs`, `search_job_logs_by_name`, `get_job_execution_summary`
- **Modular Log Development**: Work with individual log modules in `clients/logs/` for specific functionality - modify `log-analyzer.ts` for analysis improvements, `log-formatter.ts` for output changes, or `log-file-reader.ts` for reading optimizations
- **Modular Documentation Development**: Work with individual documentation modules in `clients/docs/` for specific functionality - modify `documentation-scanner.ts` for file discovery improvements, `class-content-parser.ts` for parsing enhancements, `class-name-resolver.ts` for name resolution logic, or `referenced-types-extractor.ts` for type extraction algorithms
- **Documentation Verification**: Use verification commands (see Maintenance) before changing numeric counts or structure claims
- **CI-Friendly Performance Testing**: When writing performance tests, use lenient timeouts (500ms+) and variation ratios (50x+) to account for GitHub Actions CI environment variability. Prioritize functional validation over strict timing requirements to prevent flaky failures due to infrastructure differences.

### 🔍 Testing & Validation (Consolidated Summary)
Detailed testing guidance lives in:
- `tests/mcp/AGENTS.md` (umbrella & decision matrix)
- `tests/mcp/yaml/AGENTS.md` (YAML discovery-first workflow & pattern catalog)
- `tests/mcp/node/AGENTS.md` (programmatic multi-step, stderr management, performance tolerances)

Essentials:
- Always discover success + empty/no-result + error responses with `npx aegis query` before writing tests.
- Prefer YAML for broad coverage; use programmatic tests for stateful or multi-step logic.
- Keep performance assertions lenient (<500ms typical; <50× variance) unless you have empirical baselines.

Cheat Sheet:
```bash
# List tools
npx aegis query --config ./aegis.config.docs-only.json

# Discovery examples
npx aegis query search_sfcc_classes 'query:catalog' --config ./aegis.config.docs-only.json
npx aegis query get_sfra_document 'documentName:server' --config ./aegis.config.docs-only.json
npx aegis query get_system_object_definitions '' --config ./aegis.config.with-dw.json

# Complex dotted parameters
npx aegis query search_system_object_attribute_definitions 'objectType:Product|searchRequest.query.match_all_query:{}' --config ./aegis.config.with-dw.json

# Test suites
npm run test:mcp:yaml        # YAML (docs-only)
npm run test:mcp:yaml:full   # YAML (full mode)
npm run test:mcp:node        # Programmatic
jest                        # Unit tests
npm test                    # Full suite

# Single programmatic test
node --test tests/mcp/node/get-latest-debug.full-mode.programmatic.test.js
```

Troubleshooting Quick Tips:
- Mismatch schema: re-run discovery; update both test + docs.
- Flaky stderr assertions: ensure `client.clearStderr()` in programmatic tests (see node guide).
- Empty arrays vs objects: record actual shape before choosing regex pattern.

#### **Debugging Tool Responses**

When developing or debugging tools, use aegis to inspect actual response formats:

```bash
# Capture full response structure for test validation (pipe format)
npx aegis query search_sfcc_classes 'query:catalog' --config ./aegis.config.docs-only.json | head -50

# Traditional method format (still supported)
npx aegis query --config ./aegis.config.docs-only.json --method "tools/call" --params '{"name": "[tool-name]", "arguments": [args]}' | head -50

# Test error handling (pipe format)
npx aegis query search_sfcc_classes 'query:' --config ./aegis.config.docs-only.json

# Verify JSON response structure (pipe format)
npx aegis query get_sfcc_class_info 'className:dw.catalog.Product' --config ./aegis.config.docs-only.json | jq '.'
```

#### **Development Workflow Integration**

1. **Tool Development**: After implementing a new tool, immediately test with aegis before writing unit tests
2. **Response Validation**: Use aegis to capture actual response structures when writing test assertions
3. **Error Testing**: Verify error handling behavior with invalid parameters through aegis
4. **Configuration Testing**: Test both docs-only and full modes to ensure proper tool availability
5. **Integration Testing**: Validate tool interactions and data flow using aegis before automated tests

#### **Critical: Response Format Discovery Before Writing Tests**

**ALWAYS use aegis query to understand actual response formats before writing YAML tests.** This prevents test failures due to incorrect assumptions about response structure.

##### **Essential Pre-Test Discovery Process:**

1. **Query the tool with sample arguments** to see actual response format:
   ```bash
   npx aegis query search_sfcc_classes 'query:catalog' --config ./aegis.config.docs-only.json
   ```

2. **Test edge cases** (empty results, errors) to understand all response variations:
   ```bash
   npx aegis query search_sfcc_classes 'query:zzznothingfound' --config ./aegis.config.docs-only.json
   npx aegis query search_sfcc_classes 'query:' --config ./aegis.config.docs-only.json
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
# Discover structure for class search (pipe format)
npx aegis query search_sfcc_classes 'query:catalog' --config ./aegis.config.docs-only.json
# Result: ["dw.catalog.Catalog", "dw.catalog.Product", ...] (simple array)

# Discover empty result format (pipe format)
npx aegis query search_sfcc_classes 'query:zzznothingfound' --config ./aegis.config.docs-only.json
# Result: [] (empty array)

# Discover error response format (pipe format)
npx aegis query search_sfcc_classes 'query:' --config ./aegis.config.docs-only.json
# Result: {"content": [{"type": "text", "text": "Error: ..."}], "isError": true}
```

**Remember**: The time spent discovering actual response formats with aegis saves hours of debugging failed tests later. Always query first, then write tests based on reality, not assumptions.

#### **Troubleshooting with Aegis**

- **Tool Not Found**: Check configuration mode (docs-only vs full) and ensure tool is properly registered
- **Invalid Arguments**: Use aegis to test parameter validation and see exact error messages
- **Response Issues**: Compare aegis output with programmatic test expectations to identify format mismatches
- **Performance Issues**: Use aegis timing information to identify slow tools
- **Authentication Problems**: Test full-mode tools with aegis to validate OCAPI/WebDAV connections

#### **Best Practices**

- **CRITICAL: Always discover response formats first** - Use aegis query to understand actual response structure before writing any tests
- **Always test new tools** with aegis before writing automated tests
- **Use aegis output** to write accurate test assertions rather than guessing response formats  
- **Test both success and error cases** with aegis during development
- **Verify tool availability** in different configuration modes using aegis
- **Debug programmatic test failures** by comparing with aegis CLI results
- **Test parameter validation** using aegis with various input combinations
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

##### **YAML-Based Declarative Testing**
The primary testing approach using human-readable YAML files with advanced pattern matching:

- **30+ Advanced Pattern Matching**: String patterns, numeric comparisons, date validation, array operations, field extraction, cross-field validation, and pattern negation
- **Declarative YAML Testing**: Human-readable test files with sophisticated validation patterns
- **Interactive Tool Testing**: Quick commands for testing tools interactively with the aegis CLI
- **Debugging Workflows**: Step-by-step approaches for troubleshooting test failures and server issues
- **Real-World Examples**: Complete test suites for filesystem servers, multi-tool servers, and API testing scenarios
- **Performance Testing**: Patterns for validating response times and system performance
- **Error Handling Validation**: Comprehensive approaches to testing error scenarios and edge cases

##### **Programmatic JavaScript/TypeScript Testing** 
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
aegis query --config ./aegis.config.docs-only.json

# Test specific tool with arguments - Multiple formats supported:

# Pipe format (recommended for CLI)
aegis query read_file 'path:test.txt' --config ./aegis.config.docs-only.json
aegis query calculator 'operation:add|a:5|b:3' --config ./aegis.config.docs-only.json

# JSON format (complex structures)
aegis query complex_tool '{"config": {"host": "localhost"}, "data": [1,2,3]}' --config ./aegis.config.docs-only.json

# Method syntax with pipe format
aegis query --method tools/call --params 'name:read_file|arguments.path:test.txt' --config ./aegis.config.docs-only.json

# Debug with verbose output
aegis query read_file 'path:test.txt' --config ./aegis.config.docs-only.json --verbose
```

**For AI Agents**: Both AGENTS.md files are specifically designed for AI assistants to understand how to create and execute comprehensive test suites for MCP servers. Choose YAML-based testing for declarative scenarios or programmatic testing for complex logic requirements. Both approaches can be directly applied to validate this SFCC Dev MCP server's functionality.

### 🧱 Architecture Advantages (Consolidated)
Unified benefits of the directory structure, handler model, dependency injection, modular log system, and modular documentation system:

| Concern | Key Advantages |
|---------|----------------|
| Directory Structure | Clear ownership, scalable growth, minimal cross-module coupling |
| Handlers | Category isolation, standardized lifecycle (canHandle/handle), centralized error & timing, easy extension |
| Dependency Injection | Swappable services, simplified testing (mock interfaces), boundary clarity, reduced coupling |
| Log Modules | SRP per stage (discover→read→process→analyze→format), range-tail efficiency, extensible analysis & output, backward compatibility wrapper |
| Documentation Modules | Streamlined pipeline (scan→parse→resolve→extract), focused optimizations, circular reference protection, type-safe expansion |

Cross-cutting wins:
- Strong typing across all layers
- Deterministic testability in isolation
- Backward compatibility through orchestrator wrappers (`log-client.ts`, `docs-client.ts`)
- Predictable extension points (add handler, client, or module without ripple)
- Low-risk refactoring zones due to SRP boundaries

Result: Faster iteration, safer modifications, and clearer mental model for both humans and AI agents.

