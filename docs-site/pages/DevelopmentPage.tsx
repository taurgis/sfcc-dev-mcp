import React from 'react';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { SITE_DATES } from '../constants';

const DevelopmentPage: React.FC = () => {
    const developmentStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Development Guide - SFCC Development MCP Server",
        "description": "Contributing to the SFCC Development MCP Server project. Learn the architecture, setup development environment, and contribute new features.",
        "author": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "publisher": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "datePublished": SITE_DATES.PUBLISHED,
        "dateModified": SITE_DATES.MODIFIED,
        "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/development/",
        "about": [
          {
            "@type": "SoftwareApplication",
            "name": "SFCC Development MCP Server",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Node.js",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          }
        ],
        "mainEntity": {
            "@type": "Guide",
            "name": "SFCC MCP Development Guide"
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <SEO 
                title="Development Guide"
                description="Contributing to the SFCC Development MCP Server project. Learn the architecture, setup development environment, and contribute new features."
                keywords="SFCC Development MCP Server, SFCC MCP development, TypeScript MCP server, Model Context Protocol development, SFCC tools development"
                canonical="/development/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Development", url: "/development/" }
            ]} />
            <StructuredData data={developmentStructuredData} />
            
            <H1 id="development-guide">👨‍💻 Development Guide</H1>
            <PageSubtitle>Contributing to the SFCC Development MCP Server project</PageSubtitle>

            <H2 id="getting-started">🚀 Getting Started</H2>
            
            <H3 id="prerequisites">Prerequisites</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Node.js</strong> 18 or higher</li>
                <li><strong>npm</strong> 8 or higher</li>
                <li><strong>Git</strong> for version control</li>
                <li><strong>TypeScript</strong> knowledge recommended</li>
            </ul>

            <H3 id="local-development-setup">Local Development Setup</H3>
            <CodeBlock language="bash" code={`
# Clone the repository
git clone https://github.com/taurgis/sfcc-dev-mcp.git
cd sfcc-dev-mcp

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Start in development mode
npm run dev -- --dw-json /Users/username/sfcc-project/dw.json
            `} />

            <H2 id="project-architecture">🏗️ Project Architecture</H2>
            
            <H3 id="directory-structure">Directory Structure</H3>
            <CodeBlock language="text" code={`
sfcc-dev-mcp/
├── src/
│   ├── main.ts                    # CLI entry point
│   ├── index.ts                   # Package exports
│   ├── core/                      # Core MCP server & tool definitions
│   │   ├── server.ts              # MCP server (registers handlers, capability gating)
│   │   ├── tool-definitions.ts    # All tool schemas grouped by category
│   │   └── handlers/              # Modular tool handlers
│   │       ├── base-handler.ts
│   │       ├── docs-handler.ts
│   │       ├── best-practices-handler.ts
│   │       ├── sfra-handler.ts
│   │       ├── log-handler.ts
│   │       ├── job-log-handler.ts
│   │       ├── system-object-handler.ts
│   │       ├── code-version-handler.ts
│   │       └── cartridge-handler.ts
│   ├── clients/                   # API & domain clients (logic, not routing)
│   │   ├── base/                  # Shared HTTP + auth
│   │   │   ├── http-client.ts
│   │   │   ├── ocapi-auth-client.ts
│   │   │   └── oauth-token.ts
│   │   ├── logs/                  # Modular log system (composition)
│   │   │   ├── log-client.ts          # Orchestrator
│   │   │   ├── log-file-reader.ts     # Range / tail reads
│   │   │   ├── log-file-discovery.ts  # Listing & filtering
│   │   │   ├── log-processor.ts       # Parsing & normalization
│   │   │   ├── log-analyzer.ts        # Pattern & health analysis
│   │   │   ├── log-formatter.ts       # Output shaping
│   │   │   ├── log-constants.ts       # Central constants/config
│   │   │   └── log-types.ts           # Type definitions
│   │   ├── docs-client.ts
│   │   ├── sfra-client.ts
│   │   ├── best-practices-client.ts
│   │   ├── cartridge-generation-client.ts
│   │   ├── ocapi/
│   │   │   ├── site-preferences-client.ts
│   │   │   └── system-objects-client.ts
│   │   ├── ocapi-client.ts
│   │   └── log-client.ts              # Backwards compat wrapper
│   ├── services/                 # Dependency injection service layer
│   │   ├── file-system-service.ts
│   │   ├── path-service.ts
│   │   └── index.ts
│   ├── tool-configs/             # Tool grouping & category configs
│   │   ├── docs-tool-config.ts
│   │   ├── sfra-tool-config.ts
│   │   ├── best-practices-tool-config.ts
│   │   ├── log-tool-config.ts
│   │   ├── job-log-tool-config.ts
│   │   ├── system-object-tool-config.ts
│   │   ├── cartridge-tool-config.ts
│   │   └── code-version-tool-config.ts
│   ├── config/
│   │   ├── configuration-factory.ts   # Mode & capability resolution
│   │   └── dw-json-loader.ts          # Secure dw.json loading
│   ├── utils/
│   │   ├── cache.ts
│   │   ├── logger.ts
│   │   ├── path-resolver.ts
│   │   ├── query-builder.ts
│   │   ├── utils.ts
│   │   ├── validator.ts
│   │   ├── log-cache.ts
│   │   ├── log-tool-constants.ts
│   │   ├── log-tool-utils.ts
│   │   ├── job-log-utils.ts
│   │   └── job-log-tool-config.ts (legacy placement if used)
│   └── types/
│       └── types.ts
├── tests/                        # Jest + MCP YAML + programmatic tests
│   ├── *.test.ts
│   ├── mcp/yaml/*.mcp.yml        # Declarative tool tests
│   ├── mcp/node/*.programmatic.test.js
│   └── servers/webdav/           # Mock WebDAV server fixtures
├── docs/                         # SFCC & best practices markdown sources
├── docs-site/                    # React + Vite documentation site
├── scripts/                      # Conversion & build scripts
└── ai-instructions/              # AI platform instruction sets
            `} />

            <H3 id="key-components">Key Components</H3>
            
            <H3 id="mcp-server-core">MCP Server Core (<InlineCode>src/core/</InlineCode>)</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>server.ts</strong>: Main MCP protocol implementation</li>
                <li><strong>tool-definitions.ts</strong>: Tool schema definitions and validation</li>
            </ul>

      <H3 id="client-architecture">Client vs Handler Architecture</H3>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Clients (src/clients)</strong>: Encapsulate domain logic (docs parsing, log analysis modules, OCAPI calls) but DO NOT decide routing.</li>
        <li><strong>Handlers (src/core/handlers)</strong>: Map tool names → execution, unify timing, error shaping, logging.</li>
        <li><strong>Orchestration</strong>: <InlineCode>server.ts</InlineCode> registers all handlers and filters tool exposure by capability.</li>
        <li><strong>Separation Benefit</strong>: Adding a tool rarely requires editing the server—extend or adjust the relevant handler.</li>
      </ul>

      <H3 id="configuration-system">Configuration & Capability Gating (<InlineCode>src/config/</InlineCode>)</H3>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>configuration-factory.ts</strong>: Determines operating mode & derives capabilities (<InlineCode>canAccessLogs</InlineCode>, <InlineCode>canAccessOCAPI</InlineCode>).</li>
        <li><strong>dw-json-loader.ts</strong>: Safe credential ingestion, prevents accidental misuse.</li>
        <li><strong>Capability Gating</strong>: Tool lists dynamically filtered—no credentials → only documentation tools, OCAPI credentials → system objects + code versions, log credentials → log + job log tools.</li>
        <li><strong>Security Principle</strong>: Never expose tools requiring unavailable credentials (principle of least privilege).</li>
      </ul>
            <H2 id="development-workflow">🔧 Development Workflow</H2>
            
            <H3 id="adding-new-tools">Adding New Tools (Updated Flow)</H3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Define schema</strong>: Add a new object in the correct category array inside <InlineCode>tool-definitions.ts</InlineCode>.</li>
              <li><strong>Decide placement</strong>: If existing handler category fits (e.g. logs, docs, sfra) extend that handler's <InlineCode>handle()</InlineCode>. If truly new category, create a new handler extending <InlineCode>BaseToolHandler</InlineCode>.</li>
              <li><strong>Implement logic</strong>: Put core logic in a client or service (keep handlers thin).</li>
              <li><strong>Register handler (only if new)</strong>: Add to the array in <InlineCode>registerHandlers()</InlineCode> inside <InlineCode>server.ts</InlineCode>.</li>
              <li><strong>Run aegis</strong>: Use <InlineCode>npx aegis query --config ./aegis.config.docs-only.json [tool]</InlineCode> to capture real response shape BEFORE writing tests.</li>
              <li><strong>Add tests</strong>: Jest unit tests + YAML MCP tests (docs vs full mode as applicable).</li>
              <li><strong>Update docs</strong>: Adjust this guide + README tool counts if category changed.</li>
            </ol>
            <CodeBlock language="typescript" code={`// Minimal handler example\nexport class ExampleToolHandler extends BaseToolHandler {\n  canHandle(name: string): boolean {\n    return name === 'my_new_tool';\n  }\n  protected async execute(name: string, args: any): Promise<string> {\n    const { param } = args as { param: string };\n    // domain logic (delegate to client/service ideally)\n    return \`Result for \${param}\`;\n  }\n}\n// Add to registerHandlers() in server.ts if new category.\n`} />

            <p><strong>Testing YAML (discovery first):</strong></p>
            <CodeBlock language="typescript" code={`
// jest unit example
describe('ExampleToolHandler', () => {
  it('maps tool definition & executes', async () => { /* ... */ });
});

# YAML (pseudo)
# - tool: my_new_tool
#   params: { "param": "value" }
#   expect:
#     - text: "match:contains:Result for value"
            `} />

            <H3 id="testing-strategy">Testing Strategy</H3>
            
            <H3 id="unit-tests">Unit Tests</H3>
            <CodeBlock language="bash" code={`
# Run all tests
npm test

# Run specific test file
npm test base-http-client.test.ts

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
            `} />

            <H3 id="available-test-scripts">Available Test Scripts</H3>
            <CodeBlock language="bash" code={`
# Core testing scripts from package.json
npm test              # Run all tests with Jest
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Linting and code quality
npm run lint          # Check code style
npm run lint:fix      # Auto-fix linting issues
npm run lint:check    # Check with zero warnings
            `} />

            <H3 id="manual-testing">Manual Testing</H3>
            <CodeBlock language="bash" code={`
# Test with real SFCC instance (create your own test-dw.json)
npm run dev -- --dw-json /Users/username/sfcc-project/test-dw.json --debug

# Test documentation-only mode
npm run dev -- --debug
            `} />

            <H2 id="documentation-updates">📚 Documentation Updates</H2>
            
            <H3 id="updating-sfcc-documentation">Updating SFCC Documentation</H3>
            
            <p><strong>1. Add/Update Markdown Files</strong> in <InlineCode>docs/</InlineCode>:</p>
            <CodeBlock language="bash" code={`
# Add new class documentation
echo "# NewClass\\n\\nDescription..." > docs/dw_catalog/NewClass.md
            `} />

            <p><strong>2. Run Documentation Conversion:</strong></p>
            <CodeBlock language="bash" code={`
# Convert and process documentation (requires axios and cheerio)
npm run convert-docs

# Test with limited conversion
npm run convert-docs:test

# Limited conversion (5 files)
npm run convert-docs:limit
            `} />

            <p><strong>3. Test Documentation Tools:</strong></p>
            <CodeBlock language="bash" code={`
# Test documentation access with your changes
npm run dev -- --debug true
# Then use MCP client to test get_sfcc_class_info with "NewClass"
            `} />

            <H3 id="updating-github-pages">Updating Documentation Site</H3>
            <p>The documentation site (<InlineCode>docs-site/</InlineCode>) is a React + Vite app. Deployment is handled by GitHub Actions after changes are pushed to the default branch.</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li><strong>Edit Content</strong>: Modify or add pages/components under <InlineCode>docs-site/</InlineCode>.</li>
              <li><strong>Local Preview</strong>:
                <CodeBlock language="bash" code={`cd docs-site
npm install
npm run dev  # Opens Vite dev server (default http://localhost:5173)
                `} />
              </li>
              <li><strong>Build (optional check)</strong>:
                <CodeBlock language="bash" code={`cd docs-site
npm run build  # Generates dist/ with static assets
                `} />
              </li>
              <li><strong>Push Changes</strong>: CI workflow publishes the built site to GitHub Pages.</li>
              <li><strong>Search Index / Sitemap</strong>: Automatically generated via build scripts (<InlineCode>generate:search-index</InlineCode>, <InlineCode>generate:sitemap</InlineCode>).</li>
            </ol>

            <H2 id="coding-standards">🎯 Coding Standards</H2>
            
            <H3 id="typescript-guidelines">TypeScript Guidelines</H3>
            <CodeBlock language="typescript" code={`
// Use explicit types
interface ToolParams {
  readonly query: string;
  readonly limit?: number;
}

// Use proper error handling
async function riskyOperation(): Promise<Result> {
  try {
    return await performOperation();
  } catch (error) {
    this.logger.error('Operation failed', { error: error.message });
    throw new OperationError('Failed to perform operation', error);
  }
}

// Use meaningful names
const searchProductsByCategory = (categoryId: string) => {
  // Implementation
};
            `} />

            <H3 id="code-organization">Code Organization</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Single Responsibility</strong>: Each class/function has one clear purpose</li>
                <li><strong>Dependency Injection</strong>: Use constructor injection for dependencies</li>
                <li><strong>Error Boundaries</strong>: Proper error handling at service boundaries</li>
                <li><strong>Logging</strong>: Comprehensive logging for debugging and monitoring</li>
            </ul>

            <H3 id="git-workflow">Git Workflow</H3>
            <CodeBlock language="bash" code={`
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/new-tool-name

# Make atomic commits
git add src/clients/my-client.ts
git commit -m "feat: add my new tool implementation"

git add tests/my-client.test.ts  
git commit -m "test: add unit tests for my new tool"

git add docs-site/tools.md
git commit -m "docs: update tools documentation"

# Push and create PR to develop branch
git push origin feature/new-tool-name
            `} />

            <p><strong>Commit Message Convention:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>feat:</InlineCode> - New features</li>
                <li><InlineCode>fix:</InlineCode> - Bug fixes</li>
                <li><InlineCode>docs:</InlineCode> - Documentation updates</li>
                <li><InlineCode>test:</InlineCode> - Test additions/modifications</li>
                <li><InlineCode>refactor:</InlineCode> - Code refactoring</li>
                <li><InlineCode>chore:</InlineCode> - Build process or auxiliary tool changes</li>
            </ul>

            <H2 id="testing-best-practices">🧪 Testing Best Practices</H2>
            
            <H3 id="test-structure">Test Structure</H3>
            <CodeBlock language="typescript" code={`
describe('FeatureName', () => {
  let client: MyClient;
  let mockHttpClient: jest.Mocked<HttpClient>;
  
  beforeEach(() => {
    mockHttpClient = createMockHttpClient();
    client = new MyClient(mockHttpClient, mockLogger);
  });
  
  describe('methodName', () => {
    it('should handle success case', async () => {
      // Arrange
      const input = { query: 'test' };
      const mockResponse = { data: 'mock response' };
      mockHttpClient.get.mockResolvedValue(mockResponse);
      
      // Act
      const result = await client.methodName(input);
      
      // Assert
      expect(result).toBeDefined();
      expect(mockHttpClient.get).toHaveBeenCalledWith('/expected/path');
    });
    
    it('should handle error case', async () => {
      // Arrange
      const input = { query: 'test' };
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(client.methodName(input)).rejects.toThrow('Network error');
    });
  });
});
            `} />

            <H3 id="mock-strategy">Mock Strategy</H3>
            <CodeBlock language="typescript" code={`
// Mock external dependencies using Jest
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
};

// Use factories for complex mocks
const createMockSFCCResponse = (overrides = {}) => ({
  statusCode: 200,
  headers: { 'content-type': 'application/json' },
  data: 'Mock response data',
  ...overrides
});
            `} />

            <H3 id="testing-files-available">Testing Coverage Overview</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Unit Clients</strong>: HTTP/auth, OCAPI subclients, docs, SFRA, best practices, cartridge generation.</li>
              <li><strong>Handlers</strong>: Each modular handler has focused tests (error shaping, capability filtering).</li>
              <li><strong>Log System</strong>: Discovery, reader, processor, analyzer, formatter modules.</li>
              <li><strong>Job Logs</strong>: Parsing & multi-level consolidation logic.</li>
              <li><strong>MCP Protocol Tests</strong>: YAML declarative + programmatic (Node) in <InlineCode>tests/mcp/</InlineCode>.</li>
              <li><strong>WebDAV Mock</strong>: Integration environment for log + job retrieval.</li>
            </ul>

            <H3 id="handler-architecture">Handler Architecture</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>BaseToolHandler</strong>: Central timing, error normalization, logger integration.</li>
              <li><strong>Category Isolation</strong>: Each functional domain kept small & cohesive.</li>
              <li><strong>Extensibility</strong>: New feature area → new handler; minimal churn to existing code.</li>
              <li><strong>Testing Benefit</strong>: Handlers test orchestration; clients test domain logic.</li>
            </ul>

            <H3 id="services-di">Services & Dependency Injection</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>FileSystemService</strong> & <strong>PathService</strong>: Abstract Node APIs for test isolation.</li>
              <li><strong>Client Composition</strong>: Pass services or mocks explicitly—no hidden globals.</li>
              <li><strong>Deterministic Tests</strong>: Avoids brittle fs/path mocking at module level.</li>
            </ul>

            <H3 id="log-architecture">Log & Job Log Architecture</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Reader</strong>: Range tail reads minimize bandwidth.</li>
              <li><strong>Processor</strong>: Normalizes raw lines → structured entries.</li>
              <li><strong>Analyzer</strong>: Pattern extraction, severity grouping, health scoring.</li>
              <li><strong>Formatter</strong>: Produces human-oriented summaries for MCP output.</li>
              <li><strong>Job Logs</strong>: Unified multi-level log files consolidated logically.</li>
            </ul>

            <H3 id="tool-configs">Tool Config Modules</H3>
            <p>Each <InlineCode>tool-configs/*.ts</InlineCode> file groups logically related tool definitions or export sets, enabling cleaner segregation and future dynamic registration strategies.</p>

            <H3 id="caching-performance">Caching & Performance</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>cache.ts</strong>: In-memory response caching (documentation & static lookups).</li>
              <li><strong>log-cache.ts</strong>: Specialized transient caching for recently tailed segments.</li>
              <li><strong>Avoid Premature I/O</strong>: Lazy fetch patterns in log discovery & system objects.</li>
              <li><strong>Capability Filter</strong>: Reduces surface area → fewer accidental expensive calls.</li>
            </ul>

            <H2 id="release-process">🚀 Release Process</H2>
            
            <H3 id="version-management">Version Management</H3>
            <CodeBlock language="bash" code={`
# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0  
npm version major  # 1.0.0 → 2.0.0

# Push tags
git push origin main --tags
            `} />

            <H3 id="release-checklist">Release Checklist</H3>
            <p><strong>1. Update Documentation</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>README.md tool counts and features</li>
                <li><InlineCode>ai-instructions/github-copilot/copilot-instructions.md</InlineCode> architecture updates</li>
                <li><InlineCode>.github/copilot-instructions.md</InlineCode> if MCP server architecture changed</li>
                <li>GitHub Pages documentation in <InlineCode>docs-site/</InlineCode></li>
                <li>CHANGELOG.md entry (if present)</li>
            </ul>

            <p><strong>2. Testing</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>All unit tests pass (<InlineCode>npm test</InlineCode>)</li>
                <li>Linting passes (<InlineCode>npm run lint:check</InlineCode>)</li>
                <li>Manual testing with real SFCC instance</li>
                <li>Documentation-only mode validation</li>
                <li>Build succeeds (<InlineCode>npm run build</InlineCode>)</li>
            </ul>

            <p><strong>3. Build & Package</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>TypeScript compilation successful</li>
                <li>Package size reasonable</li>
                <li>Dependencies audit clean (<InlineCode>npm audit</InlineCode>)</li>
            </ul>

            <p><strong>4. Release</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>GitHub release with changelog</li>
                <li>npm publish (automated via <InlineCode>.github/workflows/publish.yml</InlineCode>)</li>
                <li>Documentation deployment (automated)</li>
            </ul>

            <H2 id="contributing-guidelines">🤝 Contributing Guidelines</H2>
            
            <H3 id="before-contributing">Before Contributing</H3>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Check Existing Issues</strong>: Search for existing issues or discussions</li>
                <li><strong>Discuss Large Changes</strong>: Open an issue for significant modifications</li>
                <li><strong>Follow Conventions</strong>: Adhere to established coding and commit patterns</li>
            </ol>

            <H3 id="pull-request-process">Pull Request Process</H3>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Fork & Branch</strong>: Create feature branch from <InlineCode>develop</InlineCode></li>
                <li><strong>Implement Changes</strong>: Follow coding standards and testing requirements</li>
                <li><strong>Update Documentation</strong>: Ensure documentation reflects changes</li>
                <li><strong>Test Thoroughly</strong>: All tests must pass (<InlineCode>npm test</InlineCode>, <InlineCode>npm run lint:check</InlineCode>)</li>
                <li><strong>Submit PR</strong>: Provide clear description and link to related issues</li>
            </ol>

            <H3 id="code-review">Code Review</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>GitHub Actions</strong>: CI pipeline must pass (see <InlineCode>.github/workflows/ci.yml</InlineCode>)</li>
                <li><strong>Code Quality</strong>: ESLint and TypeScript checks must pass</li>
                <li><strong>Test Coverage</strong>: Maintain or improve test coverage</li>
                <li><strong>Documentation</strong>: Ensure user-facing changes are documented</li>
            </ul>

            <H2 id="performance-considerations">📊 Performance Considerations</H2>
            
            <H3 id="optimization-guidelines">Optimization Guidelines</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Caching Strategy</strong>: Implement intelligent caching for API responses</li>
                <li><strong>Rate Limiting</strong>: Respect SFCC API limits and implement backoff</li>
                <li><strong>Memory Management</strong>: Monitor memory usage, especially for large datasets</li>
                <li><strong>Asynchronous Operations</strong>: Use proper async/await patterns</li>
            </ul>

            <H3 id="monitoring">Monitoring</H3>
            <CodeBlock language="typescript" code={`
// Performance monitoring example
const startTime = Date.now();
try {
  const result = await performOperation();
  this.metrics.recordSuccess('operation_name', Date.now() - startTime);
  return result;
} catch (error) {
  this.metrics.recordError('operation_name', Date.now() - startTime);
  throw error;
}
            `} />

            <H2 id="security-considerations">🔒 Security Considerations</H2>
            
            <H3 id="credential-handling">Credential Handling</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>No Hardcoding</strong>: Never commit credentials to repository</li>
                <li><strong>Secure Storage</strong>: Use appropriate credential storage mechanisms</li>
                <li><strong>Minimal Permissions</strong>: Request only necessary permissions</li>
                <li><strong>Rotation Support</strong>: Design for credential rotation</li>
            </ul>

            <H3 id="input-validation">Input Validation</H3>
            <CodeBlock language="typescript" code={`
// Validate all inputs using proper TypeScript types
import { ToolResponse, ValidationError } from '../types/types.js';

interface ToolParams {
  readonly query: string;
  readonly limit?: number;
}

function validateToolInput(input: unknown): ToolParams {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  
  const { query, limit } = input as any;
  
  if (!query || typeof query !== 'string') {
    throw new ValidationError('Query is required and must be a string');
  }
  
  if (query.length > 1000) {
    throw new ValidationError('Query must be 1000 characters or less');
  }
  
  if (limit !== undefined && (typeof limit !== 'number' || limit < 1 || limit > 100)) {
    throw new ValidationError('Limit must be a number between 1 and 100');
  }
  
  return { query, limit };
}
            `} />

            <H2 id="next-steps">Next Steps</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li>📝 <strong><a href="https://github.com/taurgis/sfcc-dev-mcp/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing Guidelines</a></strong> - Detailed contribution process</li>
                <li>🏗️ <strong><a href="https://github.com/taurgis/sfcc-dev-mcp/issues" target="_blank" rel="noopener noreferrer">Issues & Features</a></strong> - Report bugs or request features</li>
                <li>💬 <strong><a href="https://github.com/taurgis/sfcc-dev-mcp/discussions" target="_blank" rel="noopener noreferrer">Discussions</a></strong> - Community discussions and Q&A</li>
                <li>🚀 <strong><a href="https://github.com/taurgis/sfcc-dev-mcp/actions" target="_blank" rel="noopener noreferrer">GitHub Actions</a></strong> - View CI/CD pipeline status</li>
            </ul>
        </div>
    );
};

export default DevelopmentPage;