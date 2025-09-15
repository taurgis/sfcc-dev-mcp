import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const DevelopmentPage: React.FC = () => {
    useSEO({
        title: 'Development Guide - SFCC Development MCP Server',
        description: 'Contributing to the SFCC Development MCP Server project. Learn the architecture, setup development environment, and contribute new features.',
        keywords: 'SFCC Development MCP Server, SFCC MCP development, TypeScript MCP server, Model Context Protocol development, SFCC tools development',
        canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/development',
        ogTitle: 'SFCC Development MCP Server - Development Guide',
        ogDescription: 'Contribute to SFCC Development MCP Server development. Complete guide to architecture, setup, and extending the SFCC development tools.',
        ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/development'
    });

    return (
        <>
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
npm run dev -- --dw-json /path/to/your/dw.json
            `} />

            <H2 id="project-architecture">🏗️ Project Architecture</H2>
            
            <H3 id="directory-structure">Directory Structure</H3>
            <CodeBlock language="text" code={`
sfcc-dev-mcp/
├── src/                          # TypeScript source code
│   ├── main.ts                   # CLI entry point
│   ├── index.ts                  # Package exports
│   ├── core/                     # Core MCP server functionality
│   │   ├── server.ts             # Main MCP server implementation
│   │   └── tool-definitions.ts   # MCP tool schema definitions
│   ├── clients/                  # API clients for different services
│   │   ├── base/                 # Base client classes
│   │   │   ├── http-client.ts    # Base HTTP client with authentication
│   │   │   ├── oauth-token.ts    # OAuth token management
│   │   │   └── ocapi-auth-client.ts # OCAPI authentication client
│   │   ├── ocapi/                # OCAPI-specific clients
│   │   │   ├── site-preferences-client.ts # Site preferences client
│   │   │   └── system-objects-client.ts # System objects client
│   │   ├── best-practices-client.ts # Best practices guides client
│   │   ├── cartridge-generation-client.ts # Cartridge generation client
│   │   ├── docs-client.ts        # SFCC documentation client
│   │   ├── log-client.ts         # Log analysis client
│   │   ├── ocapi-client.ts       # Main OCAPI coordinator
│   │   └── sfra-client.ts        # SFRA documentation client
│   ├── config/                   # Configuration management
│   │   ├── config.ts             # Configuration loading
│   │   ├── configuration-factory.ts # Configuration factory
│   │   ├── constants.ts          # Application constants
│   │   └── dw-json-loader.ts     # Secure dw.json loading
│   ├── utils/                    # Utility functions
│   │   ├── cache.ts              # Caching utilities
│   │   ├── logger.ts             # Logging utilities
│   │   ├── path-resolver.ts      # Path resolution utilities
│   │   ├── query-builder.ts      # Query building utilities
│   │   ├── utils.ts              # Common utilities
│   │   └── validator.ts          # Input validation
│   └── types/                    # TypeScript type definitions
│       └── types.ts              # Comprehensive type definitions
├── docs/                         # SFCC documentation files
├── docs-site/                    # GitHub Pages documentation
├── tests/                        # Test suite
├── scripts/                      # Build and utility scripts
└── .github/                      # GitHub workflows and templates
            `} />

            <H3 id="key-components">Key Components</H3>
            
            <H3 id="mcp-server-core">MCP Server Core (<InlineCode>src/core/</InlineCode>)</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>server.ts</strong>: Main MCP protocol implementation</li>
                <li><strong>tool-definitions.ts</strong>: Tool schema definitions and validation</li>
            </ul>

            <H3 id="client-architecture">Client Architecture (<InlineCode>src/clients/</InlineCode>)</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Base Classes</strong>: Shared HTTP client functionality and authentication</li>
                <li><strong>Specialized Clients</strong>: Domain-specific API integrations</li>
                <li><strong>Service Coordination</strong>: Orchestrates multiple API calls</li>
            </ul>

            <H3 id="configuration-system">Configuration System (<InlineCode>src/config/</InlineCode>)</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Flexible Loading</strong>: Supports dw.json, environment variables, CLI args</li>
                <li><strong>Mode Detection</strong>: Automatically determines operating mode</li>
                <li><strong>Validation</strong>: Comprehensive configuration validation</li>
            </ul>
            <H2 id="development-workflow">🔧 Development Workflow</H2>
            
            <H3 id="adding-new-tools">Adding New Tools</H3>
            
            <p><strong>1. Define Tool Schema</strong> in <InlineCode>src/core/tool-definitions.ts</InlineCode>:</p>
            <CodeBlock language="typescript" code={`
export const toolDefinitions: ToolDefinition[] = [
  // ... existing tools
  {
    name: "my_new_tool",
    description: "Description of what the tool does",
    inputSchema: {
      type: "object",
      properties: {
        parameter1: {
          type: "string",
          description: "Description of parameter"
        }
      },
      required: ["parameter1"]
    }
  }
];
            `} />

            <p><strong>2. Implement Tool Handler</strong> in appropriate client:</p>
            <CodeBlock language="typescript" code={`
// In src/clients/my-client.ts
export class MyClient extends BaseHttpClient {
  async handleMyNewTool(params: MyNewToolParams): Promise<ToolResponse> {
    try {
      // Implementation logic
      const result = await this.performOperation(params);
      
      return {
        content: [
          {
            type: "text",
            text: this.formatResult(result)
          }
        ]
      };
    } catch (error) {
      return this.handleError('my_new_tool', error);
    }
  }
}
            `} />

            <p><strong>3. Register Handler</strong> in <InlineCode>src/core/server.ts</InlineCode>:</p>
            <CodeBlock language="typescript" code={`
// Add to the appropriate handler method
case 'my_new_tool':
  return await this.myClient.handleMyNewTool(params);
            `} />

            <p><strong>4. Add Tests</strong> in <InlineCode>tests/</InlineCode>:</p>
            <CodeBlock language="typescript" code={`
describe('MyClient', () => {
  describe('handleMyNewTool', () => {
    it('should handle valid input', async () => {
      // Test implementation
    });
    
    it('should handle errors gracefully', async () => {
      // Error handling tests
    });
  });
});
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
npm run dev -- --dw-json ./test-dw.json --debug true

# Test documentation-only mode
npm run dev -- --debug true
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

            <H3 id="updating-github-pages">Updating GitHub Pages</H3>
            <p>The GitHub Pages site is automatically deployed when changes are pushed to <InlineCode>docs-site/</InlineCode>:</p>
            
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Edit Documentation Pages</strong> in <InlineCode>docs-site/</InlineCode></li>
                <li><strong>Test Locally</strong> with Jekyll (requires Ruby and Jekyll setup):
                    <CodeBlock language="bash" code={`
cd docs-site
# Install Jekyll if not already installed
gem install jekyll bundler
bundle install
bundle exec jekyll serve
# Visit http://localhost:4000/sfcc-dev-mcp/
                    `} />
                </li>
                <li><strong>Commit and Push</strong> - GitHub Actions will deploy automatically via <InlineCode>.github/workflows/deploy-pages.yml</InlineCode></li>
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

            <H3 id="testing-files-available">Testing Files Available</H3>
            <p>The project has comprehensive test coverage in the <InlineCode>tests/</InlineCode> directory:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>base-http-client.test.ts</InlineCode> - Base HTTP client testing</li>
                <li><InlineCode>cache.test.ts</InlineCode> - Caching mechanism tests</li>
                <li><InlineCode>config.test.ts</InlineCode> - Configuration loading tests</li>
                <li><InlineCode>log-client.test.ts</InlineCode> - Log analysis client tests</li>
                <li><InlineCode>oauth-token.test.ts</InlineCode> - OAuth token management tests</li>
                <li><InlineCode>system-objects-client.test.ts</InlineCode> - System objects client tests</li>
                <li>And more...</li>
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
        </>
    );
};

export default DevelopmentPage;