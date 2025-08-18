---
title: Development Guide
layout: page
nav_order: 8
---

# 👨‍💻 Development Guide

Contributing to the SFCC Development MCP Server project.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 8 or higher  
- **Git** for version control
- **TypeScript** knowledge recommended

### Local Development Setup

```bash
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
```

---

## 🏗️ Project Architecture

### Directory Structure

```
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
```

### Key Components

#### MCP Server Core (`src/core/`)
- **server.ts**: Main MCP protocol implementation
- **tool-definitions.ts**: Tool schema definitions and validation

#### Client Architecture (`src/clients/`)
- **Base Classes**: Shared HTTP client functionality and authentication
- **Specialized Clients**: Domain-specific API integrations
- **Service Coordination**: Orchestrates multiple API calls

#### Configuration System (`src/config/`)
- **Flexible Loading**: Supports dw.json, environment variables, CLI args
- **Mode Detection**: Automatically determines operating mode
- **Validation**: Comprehensive configuration validation

---

## 🔧 Development Workflow

### Adding New Tools

1. **Define Tool Schema** in `src/core/tool-definitions.ts`:
   ```typescript
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
   ```

2. **Implement Tool Handler** in appropriate client:
   ```typescript
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
   ```

3. **Register Handler** in `src/core/server.ts`:
   ```typescript
   // Add to the appropriate handler method
   case 'my_new_tool':
     return await this.myClient.handleMyNewTool(params);
   ```

4. **Add Tests** in `tests/`:
   ```typescript
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
   ```

### Testing Strategy

#### Unit Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test base-http-client.test.ts

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

#### Available Test Scripts
```bash
# Core testing scripts from package.json
npm test              # Run all tests with Jest
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Linting and code quality
npm run lint          # Check code style
npm run lint:fix      # Auto-fix linting issues
npm run lint:check    # Check with zero warnings
```

#### Manual Testing
```bash
# Test with real SFCC instance (create your own test-dw.json)
npm run dev -- --dw-json ./test-dw.json --debug true

# Test documentation-only mode
npm run dev -- --debug true
```

---

## 📚 Documentation Updates

### Updating SFCC Documentation

1. **Add/Update Markdown Files** in `docs/`:
   ```bash
   # Add new class documentation
   echo "# NewClass\n\nDescription..." > docs/dw_catalog/NewClass.md
   ```

2. **Run Documentation Conversion**:
   ```bash
   # Convert and process documentation (requires axios and cheerio)
   npm run convert-docs
   
   # Test with limited conversion
   npm run convert-docs:test
   
   # Limited conversion (5 files)
   npm run convert-docs:limit
   ```

3. **Test Documentation Tools**:
   ```bash
   # Test documentation access with your changes
   npm run dev -- --debug true
   # Then use MCP client to test get_sfcc_class_info with "NewClass"
   ```

### Updating GitHub Pages

The GitHub Pages site is automatically deployed when changes are pushed to `docs-site/`:

1. **Edit Documentation Pages** in `docs-site/`
2. **Test Locally** with Jekyll (requires Ruby and Jekyll setup):
   ```bash
   cd docs-site
   # Install Jekyll if not already installed
   gem install jekyll bundler
   bundle install
   bundle exec jekyll serve
   # Visit http://localhost:4000/sfcc-dev-mcp/
   ```
3. **Commit and Push** - GitHub Actions will deploy automatically via `.github/workflows/deploy-pages.yml`

---

## 🎯 Coding Standards

### TypeScript Guidelines

```typescript
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
```

### Code Organization

- **Single Responsibility**: Each class/function has one clear purpose
- **Dependency Injection**: Use constructor injection for dependencies
- **Error Boundaries**: Proper error handling at service boundaries
- **Logging**: Comprehensive logging for debugging and monitoring

### Git Workflow

```bash
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
```

**Commit Message Convention:**
- `feat:` - New features
- `fix:` - Bug fixes  
- `docs:` - Documentation updates
- `test:` - Test additions/modifications
- `refactor:` - Code refactoring
- `chore:` - Build process or auxiliary tool changes

---

## 🧪 Testing Best Practices

### Test Structure

```typescript
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
```

### Mock Strategy

```typescript
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
```

### Testing Files Available

The project has comprehensive test coverage in the `tests/` directory:
- `base-http-client.test.ts` - Base HTTP client testing
- `cache.test.ts` - Caching mechanism tests
- `config.test.ts` - Configuration loading tests
- `log-client.test.ts` - Log analysis client tests
- `oauth-token.test.ts` - OAuth token management tests
- `system-objects-client.test.ts` - System objects client tests
- And more...

---

## 🚀 Release Process

### Version Management

```bash
# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0  
npm version major  # 1.0.0 → 2.0.0

# Push tags
git push origin main --tags
```

### Release Checklist

1. **Update Documentation**
   - [ ] README.md tool counts and features
   - [ ] `ai-instructions/github-copilot/copilot-instructions.md` architecture updates  
   - [ ] `.github/copilot-instructions.md` if MCP server architecture changed
   - [ ] GitHub Pages documentation in `docs-site/`
   - [ ] CHANGELOG.md entry (if present)

2. **Testing**
   - [ ] All unit tests pass (`npm test`)
   - [ ] Linting passes (`npm run lint:check`)
   - [ ] Manual testing with real SFCC instance
   - [ ] Documentation-only mode validation
   - [ ] Build succeeds (`npm run build`)

3. **Build & Package**
   - [ ] TypeScript compilation successful
   - [ ] Package size reasonable
   - [ ] Dependencies audit clean (`npm audit`)

4. **Release**
   - [ ] GitHub release with changelog
   - [ ] npm publish (automated via `.github/workflows/publish.yml`)
   - [ ] Documentation deployment (automated)

---

## 🤝 Contributing Guidelines

### Before Contributing

1. **Check Existing Issues**: Search for existing issues or discussions
2. **Discuss Large Changes**: Open an issue for significant modifications
3. **Follow Conventions**: Adhere to established coding and commit patterns

### Pull Request Process

1. **Fork & Branch**: Create feature branch from `develop`
2. **Implement Changes**: Follow coding standards and testing requirements
3. **Update Documentation**: Ensure documentation reflects changes
4. **Test Thoroughly**: All tests must pass (`npm test`, `npm run lint:check`)
5. **Submit PR**: Provide clear description and link to related issues

### Code Review

- **GitHub Actions**: CI pipeline must pass (see `.github/workflows/ci.yml`)
- **Code Quality**: ESLint and TypeScript checks must pass
- **Test Coverage**: Maintain or improve test coverage
- **Documentation**: Ensure user-facing changes are documented

---

## 📊 Performance Considerations

### Optimization Guidelines

- **Caching Strategy**: Implement intelligent caching for API responses
- **Rate Limiting**: Respect SFCC API limits and implement backoff
- **Memory Management**: Monitor memory usage, especially for large datasets
- **Asynchronous Operations**: Use proper async/await patterns

### Monitoring

```typescript
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
```

---

## 🔒 Security Considerations

### Credential Handling

- **No Hardcoding**: Never commit credentials to repository
- **Secure Storage**: Use appropriate credential storage mechanisms
- **Minimal Permissions**: Request only necessary permissions
- **Rotation Support**: Design for credential rotation

### Input Validation

```typescript
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
```

---

## Next Steps

- 📝 **[Contributing Guidelines](https://github.com/taurgis/sfcc-dev-mcp/blob/main/CONTRIBUTING.md)** - Detailed contribution process
- 🏗️ **[Issues & Features](https://github.com/taurgis/sfcc-dev-mcp/issues)** - Report bugs or request features
- 💬 **[Discussions](https://github.com/taurgis/sfcc-dev-mcp/discussions)** - Community discussions and Q&A
- � **[GitHub Actions](https://github.com/taurgis/sfcc-dev-mcp/actions)** - View CI/CD pipeline status
