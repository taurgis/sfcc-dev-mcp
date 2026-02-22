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
- Always discover response shapes with `npx aegis query` before writing tests (see `.github/skills/mcp-yaml-testing/` for detailed workflow)
- Unit tests (Jest): core utilities, parsing, validation, token & client logic
- YAML tests (Aegis): broad tool surface, schema validation (see `.github/skills/mcp-yaml-testing/`)
- Programmatic tests (Node): multi-step flows, stateful sequences (see `.github/skills/mcp-programmatic-testing/`)
- Performance assertions: CI‑tolerant (<500ms typical) – correctness first

### Implementation Workflow
1. Define or adjust tool schema (if new) in `core/tool-definitions.ts`
2. Implement / extend handler (or add new) with clear separation of concerns
3. Add / update clients & services with DI-friendly patterns (`ClientFactory` + interfaces)
4. Run targeted Aegis discovery (success + edge) to capture real output
5. Write/adjust tests (unit + YAML/programmatic where appropriate)
6. Verify counts & update docs (both files) atomically
7. Run lint + tests; address failures before further edits
8. Commit with concise, scope-focused message

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
│   │   ├── tool-argument-validator.ts # Runtime tool argument validation at MCP boundary
│   │   ├── tool-schemas/         # Modular tool schema definitions
│   │   │   ├── index.ts          # Aggregates and re-exports all tool schemas
│   │   │   ├── shared-schemas.ts # Reusable schema components (query, pagination, etc.)
│   │   │   ├── documentation-tools.ts # SFCC documentation tools (5 tools)
│   │   │   ├── sfra-tools.ts     # SFRA documentation tools (5 tools)
│   │   │   ├── isml-tools.ts     # ISML documentation tools (5 tools)
│   │   │   ├── log-tools.ts      # Log + Job log tools (8 + 5 tools)
│   │   │   ├── system-object-tools.ts # System object tools (6 tools)
│   │   │   ├── cartridge-tools.ts # Cartridge generation tools (1 tool)
│   │   │   ├── code-version-tools.ts # Code version tools (2 tools)
│   │   │   ├── agent-instruction-tools.ts # Agent instruction tools (2 tools)
│   │   │   └── script-debugger-tools.ts # Script debugger tools (1 tool)
│   │   └── handlers/             # Modular tool handlers
│   │       ├── base-handler.ts   # Abstract base handler with common functionality
│   │       ├── abstract-client-handler.ts # Abstract handler for client-based tools
│   │       ├── simple-client-handler.ts # Simple handler for single-client tools
│   │       ├── lifecycle-utils.ts # Shared client lifecycle teardown utility
│   │       ├── client-factory.ts # Centralized client creation with dependency injection
│   │       ├── validation-helpers.ts # Common validation utilities for handlers
│   │       ├── docs-handler.ts   # SFCC documentation tool handler
│   │       ├── sfra-handler.ts   # SFRA documentation tool handler
│   │       ├── isml-handler.ts   # ISML documentation tool handler
│   │       ├── log-handler.ts    # Log analysis tool handler
│   │       ├── job-log-handler.ts # Job log analysis tool handler
│   │       ├── system-object-handler.ts # System object tool handler
│   │       ├── code-version-handler.ts # Code version tool handler
│   │       ├── cartridge-handler.ts # Cartridge generation tool handler
│   │       ├── agent-instructions-handler.ts # Agent instruction tool handler
│   │       └── script-debugger-handler.ts # Script debugger tool handler
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
│   │   ├── script-debugger/       # Script debugger client module
│   │   └── agent-instructions-client.ts # Agent instructions install/sync client
│   ├── services/                 # Service layer with clean abstractions
│   │   ├── index.ts              # Service exports and type definitions
│   │   ├── file-system-service.ts # File system operations service
│   │   └── path-service.ts       # Path manipulation service
│   ├── config/                   # Configuration management
│   │   ├── cli-options.ts        # CLI argument and env credential detection helpers
│   │   ├── configuration-factory.ts # Config factory for different modes
│   │   ├── dw-json-loader.ts     # dw.json configuration loader
│   │   └── path-security-policy.ts # Shared path allow/block policy for config and workspace roots
│   ├── tool-configs/             # Tool configuration definitions
│   │   ├── cartridge-tool-config.ts # Cartridge generation tools configuration
│   │   ├── code-version-tool-config.ts # Code version tools configuration
│   │   ├── docs-tool-config.ts   # Documentation tools configuration
│   │   ├── job-log-tool-config.ts # Job log tools configuration
│   │   ├── log-tool-config.ts    # Log analysis tools configuration
│   │   ├── sfra-tool-config.ts   # SFRA documentation tools configuration
│   │   ├── system-object-tool-config.ts # System object tools configuration
│   │   ├── agent-instructions-tool-config.ts # Agent instruction tool configuration
│   │   └── script-debugger-tool-config.ts # Script debugger tool configuration
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
├── docs-site-v2/                # VitePress documentation website
│   ├── .vitepress/              # VitePress config and theme
│   ├── guide/                   # Getting started and configuration
│   ├── features/                # Feature overview
│   ├── tools/                   # Tools catalog
│   ├── examples/                # Prompt examples
│   ├── script-debugger/         # Script debugger guide
│   ├── skills/                  # Agent skills guide
│   ├── security/                # Security and privacy notes
│   ├── development/             # Development guide
│   ├── troubleshooting/         # Troubleshooting guide
│   ├── public/                  # Static assets
│   └── package.json             # VitePress scripts and dependencies
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
├── scripts/                     # Build, validation, and documentation scripts
│   ├── convert-docs.js
│   ├── test-published-npx.sh    # Post-publish validation against npm package via npx
│   └── validate-server-json.js
└── package.json                 # Node.js package configuration
```

### 🔧 Key Components

#### **MCP Server Core** (`core/server.ts`)
- Implements the Model Context Protocol specification
- Handles tool registration and request routing
- Manages configuration modes (documentation-only vs. full)
- Applies runtime tool argument validation (required fields, type checks, enum checks, integer/numeric ranges, and string patterns/length) before dispatch
- Enforces strict unknown-argument rejection for object schemas that declare properties (at top-level and nested object levels) unless explicitly allowed by schema
- Enforces call-time capability gating so unavailable tools are rejected during `tools/call`, not just hidden from `tools/list`
- Provides error handling and response formatting
- Orchestrates modular tool handlers for different functionality areas
- Issues a one-time advisory when AGENTS.md/skills are missing, pointing clients to the installer tool

#### **Tool Handler Architecture** (`core/handlers/`)
- **BaseToolHandler** (`base-handler.ts`): Abstract base class providing common handler functionality, standardized response formatting, execution timing, and error handling patterns
- **AbstractClientHandler** (`abstract-client-handler.ts`): Abstract handler for tools that require client instantiation
- **ConfiguredClientHandler** (`abstract-client-handler.ts`): Config-driven client handler that removes repetitive createClient/context/tool wiring in concrete handlers
- **SimpleClientHandler** (`simple-client-handler.ts`): Simplified handler for single-client tools with less boilerplate
- **ClientFactory** (`client-factory.ts`): Centralized client creation with dependency injection support for testing and clean architecture
- **ValidationHelpers** (`validation-helpers.ts`): Common validation utilities shared across all handlers
- **DocsToolHandler** (`docs-handler.ts`): Handles SFCC documentation tools including class information, method search, and API discovery
- **SFRAToolHandler** (`sfra-handler.ts`): Processes SFRA documentation requests with dynamic discovery and smart categorization
- **ISMLToolHandler** (`isml-handler.ts`): Handles ISML element documentation, search, and category browsing
- **LogToolHandler** (`log-handler.ts`): Handles real-time log analysis, error monitoring, and system health summarization
- **JobLogToolHandler** (`job-log-handler.ts`): Handles job log analysis, debugging, and execution summaries
- **SystemObjectToolHandler** (`system-object-handler.ts`): Manages system object definitions, custom attributes, and site preferences
- **CodeVersionToolHandler** (`code-version-handler.ts`): Handles code version listing, activation, and deployment management
- **CartridgeToolHandler** (`cartridge-handler.ts`): Processes cartridge generation requests with complete project setup using dependency injection
- **AgentInstructionsToolHandler** (`agent-instructions-handler.ts`): Installs or merges bundled AGENTS.md and skills into workspaces, user home, or temp directories

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
- **AgentInstructionsClient** (`agent-instructions-client.ts`): Plans and installs bundled AI assets (AGENTS.md + skills) into workspaces, user home, or temp directories with merge strategies and missing-only copy support

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

2. **Enhanced SFRA Documentation Tools** (5 tools)
   - **Dynamic Discovery**: Automatically finds all 26+ SFRA documents including core classes, extensive model documentation
   - **Smart Categorization**: Organizes documents into 7 logical categories (core, product, order, customer, pricing, store, other)
   - **Advanced Search**: Relevance-scored search across all documents with context highlighting
   - **Category Filtering**: Explore documents by functional areas for efficient discovery
   - **Complete Coverage**: Core SFRA classes (Server, Request, Response, QueryString, render) plus comprehensive model documentation (account, cart, products, pricing, billing, shipping, store, customer management, totals, categories, content, locale, addresses, and more)

3. **ISML Documentation Tools** (5 tools)
   - Complete ISML element reference and documentation
   - Control flow elements (isif, isloop, isnext, etc.)
   - Output formatting (isprint) and includes (isinclude, iscomponent, isslot)
   - Scripting elements (isscript, isset) and caching (iscache)
   - Category-based browsing and advanced search capabilities

4. **Cartridge Generation Tools** (1 tool)
   - Automated cartridge structure creation with direct file generation
   - `targetPath` writes are constrained to discovered workspace roots (or `cwd` fallback when roots are unavailable), and fallback is blocked when `cwd` resolves to the user home directory to limit filesystem blast radius
   - Complete project setup with all necessary configuration files
   - Proper directory organization and file structure

5. **Log Analysis Tools** (8 tools)
   - Real-time error monitoring
   - Log search and pattern matching
   - System health summarization

6. **Job Log Tools** (5 tools)
   - Job log analysis and debugging
   - Job execution summaries
   - Custom job step monitoring

7. **System Object Tools** (6 tools)
   - Custom attribute discovery
   - Site preference management
   - System object schema exploration
   - Custom object attribute definitions search

8. **Code Version Tools** (2 tools)
   - Code version listing and management
   - Code version activation for deployment fixes

9. **Agent Instruction Tools** (2 tools)
   - Copy or merge AGENTS.md and bundled skills into the current workspace, user home, or a temp directory
   - Supports dry-run planning, append/replace/skip strategies, and missing-only installs

10. **Script Debugger Tools** (1 tool)
   - Invoke script debugger flows for runtime troubleshooting
   - Supports credentialed debugging workflows in full mode

### 🚀 Operating Modes

#### **Configuration Discovery Priority**
The server discovers SFCC credentials in this order (highest to lowest priority):

1. **CLI parameter** (`--dw-json /path/to/dw.json`) - Explicit, highest priority
2. **Environment variables** (`SFCC_HOSTNAME`, `SFCC_USERNAME`, `SFCC_PASSWORD`, `SFCC_CLIENT_ID`, `SFCC_CLIENT_SECRET`)
3. **MCP workspace roots discovery** - Automatically finds `dw.json` in VS Code workspace folders after client connection, and refreshes discovery when the client emits `notifications/roots/list_changed`

`dw.json` authentication supports multiple credential combinations:
- Basic auth (`username` + `password`)
- OAuth (`client-id` + `client-secret`)
- Both pairs together

When `hostname` is present, at least one complete credential pair must be provided.
When credentials are provided, `hostname` is required.

> **Note**: CWD-based auto-discovery is intentionally disabled because MCP servers often start with `cwd` set to the user's home directory, not the project directory. The MCP workspace roots mechanism provides reliable project context.

#### **Documentation-Only Mode**
- No SFCC credentials required
- Access to all documentation, cartridge scaffolding, and agent-instruction tools
- Credentialed tools are rejected at `tools/call` with a structured `TOOL_NOT_AVAILABLE` error
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
# Runtime tool count verification (40 tools across all categories)
npx tsx -e "import {SFCC_DOCUMENTATION_TOOLS,SFRA_DOCUMENTATION_TOOLS,ISML_DOCUMENTATION_TOOLS,LOG_TOOLS,JOB_LOG_TOOLS,SYSTEM_OBJECT_TOOLS,CARTRIDGE_GENERATION_TOOLS,CODE_VERSION_TOOLS,AGENT_INSTRUCTION_TOOLS,SCRIPT_DEBUGGER_TOOLS} from './src/core/tool-definitions.ts'; const total=SFCC_DOCUMENTATION_TOOLS.length+SFRA_DOCUMENTATION_TOOLS.length+ISML_DOCUMENTATION_TOOLS.length+LOG_TOOLS.length+JOB_LOG_TOOLS.length+SYSTEM_OBJECT_TOOLS.length+CARTRIDGE_GENERATION_TOOLS.length+CODE_VERSION_TOOLS.length+AGENT_INSTRUCTION_TOOLS.length+SCRIPT_DEBUGGER_TOOLS.length; console.log('Total tools:', total);"

# Individual category counts (from modular schema files)
echo "Documentation tools:" && grep -c "name: '" src/core/tool-schemas/documentation-tools.ts
echo "SFRA tools:" && grep -c "name: '" src/core/tool-schemas/sfra-tools.ts
echo "ISML tools:" && grep -c "name: '" src/core/tool-schemas/isml-tools.ts
echo "Log + Job log tools:" && grep -c "name: '" src/core/tool-schemas/log-tools.ts
echo "System object tools:" && grep -c "name: '" src/core/tool-schemas/system-object-tools.ts
echo "Cartridge tools:" && grep -c "name: '" src/core/tool-schemas/cartridge-tools.ts
echo "Code version tools:" && grep -c "name: '" src/core/tool-schemas/code-version-tools.ts
echo "Agent instruction tools:" && grep -c "name: '" src/core/tool-schemas/agent-instruction-tools.ts
echo "Script debugger tools:" && grep -c "name: '" src/core/tool-schemas/script-debugger-tools.ts

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

### 🔧 Common Development Tasks

**Code Development:**
- **Adding New Tools**: Define schema in `core/tool-schemas/[category]-tools.ts`, add to `index.ts`, implement in `core/handlers/`
- **Creating New Handlers**: Extend `BaseToolHandler`, implement `canHandle()` and `handle()`, register in `server.ts`
- **Using ClientFactory**: Create clients with `ClientFactory` for centralized creation and DI support
- **Implementing Services**: Create interfaces in `services/index.ts`, implement production + mock versions

**Testing** (see `.github/skills/` for detailed guides):
- **YAML Tests**: Use `mcp-yaml-testing` skill for declarative test creation
- **Programmatic Tests**: Use `mcp-programmatic-testing` skill for complex workflows
- **Unit Tests**: Jest for `tests/` directory; MCP tests use `node --test`
- **Published NPX Validation**: Use `bash ./scripts/test-published-npx.sh [version]` to run MCP tests against the released npm artifact

**SFCC-Specific Tasks** (see `.github/skills/` for detailed guides):
- **Cartridge Generation**: Use `sfcc-cartridge-generation` skill for scaffolding
- **Log Debugging**: Use `sfcc-log-debugging` skill for error investigation
- **Published NPX Validation**: Start `npm run test:mock-server:start` locally before `bash ./scripts/test-published-npx.sh [version]` (publish workflow starts/stops the mock server automatically)

**Modular Development:**
- **Log Modules**: Modify `clients/logs/` files for log functionality changes
- **Doc Modules**: Modify `clients/docs/` files for documentation parsing changes
- **Documentation**: Use verification commands before updating counts

### 🔍 Testing & Validation

**Skills Available**: For detailed testing workflows, use these Agent Skills (in `.github/skills/`):
- `mcp-yaml-testing` - YAML test creation, patterns, discovery workflow
- `mcp-programmatic-testing` - JavaScript tests, buffer management, multi-step workflows

**Test Type Decision Matrix**:
| Scenario | Recommended | Reason |
|----------|-------------|--------|
| Basic tool validation | YAML | Simple, declarative, CI-friendly |
| Schema/shape testing | YAML | Pattern matching built-in |
| Multi-step workflows | Programmatic | State management needed |
| Complex business logic | Programmatic | Code execution required |

**Essential Commands**:
```bash
# Discovery (ALWAYS run before writing tests)
npx aegis query [tool_name] '[params]' --config ./aegis.config.docs-only.json

# Test execution
npm run test:mcp:yaml        # YAML tests (docs-only)
npm run test:mcp:yaml:full   # YAML tests (full mode)
npm run test:mcp:node        # Programmatic tests
npm run test:mcp:published-npx  # MCP tests against latest published npm package via npx
npm test                     # Full suite (Jest + MCP)
```

**Critical Rules**:
1. Always discover response formats with `aegis query` before writing tests
2. Use `client.clearAllBuffers()` in programmatic test `beforeEach()` hooks
3. Never use `Promise.all()` with MCP requests (causes buffer conflicts)
4. Use CI-friendly timeouts (500ms+) for performance assertions

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

