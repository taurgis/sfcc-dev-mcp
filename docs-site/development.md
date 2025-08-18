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
│   │   ├── ocapi/                # OCAPI-specific clients
│   │   ├── docs-client.ts        # Documentation client
│   │   ├── log-client.ts         # Log analysis client
│   │   └── ...                   # Other specialized clients
│   ├── config/                   # Configuration management
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript type definitions
├── docs/                         # SFCC documentation files
├── docs-site/                    # GitHub Pages documentation
├── tests/                        # Test suite
└── scripts/                      # Build and utility scripts
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
npm test -- my-client.test.ts

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

#### Integration Tests
```bash
# Test with real SFCC instance
npm run test:integration -- --dw-json ./test-dw.json

# Test documentation-only mode
npm run test:docs-only
```

#### End-to-End Testing
```bash
# Test complete workflow
npm run test:e2e

# Test specific AI interface integration
npm run test:claude-desktop
npm run test:github-copilot
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
   # Convert Markdown to processable format
   npm run convert-docs
   
   # Verify conversion
   npm run validate-docs
   ```

3. **Test Documentation Tools**:
   ```bash
   # Test documentation search
   npm run test:docs -- --filter "NewClass"
   ```

### Updating GitHub Pages

The GitHub Pages site is automatically deployed when changes are pushed to `docs-site/`:

1. **Edit Documentation Pages** in `docs-site/`
2. **Test Locally** with Jekyll:
   ```bash
   cd docs-site
   bundle exec jekyll serve
   # Visit http://localhost:4000/sfcc-dev-mcp/
   ```
3. **Commit and Push** - GitHub Actions will deploy automatically

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
# Create feature branch
git checkout -b feature/new-tool-name

# Make atomic commits
git add src/clients/my-client.ts
git commit -m "feat: add my new tool implementation"

git add tests/my-client.test.ts  
git commit -m "test: add unit tests for my new tool"

# Push and create PR
git push origin feature/new-tool-name
```

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
      mockHttpClient.get.mockResolvedValue(mockResponse);
      
      // Act
      const result = await client.methodName(input);
      
      // Assert
      expect(result).toBeDefined();
      expect(mockHttpClient.get).toHaveBeenCalledWith('/expected/path');
    });
    
    it('should handle error case', async () => {
      // Arrange
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(client.methodName({})).rejects.toThrow('Network error');
    });
  });
});
```

### Mock Strategy

```typescript
// Mock external dependencies
jest.mock('dw/system/Logger', () => ({
  getLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })
}));

// Use factories for complex mocks
const createMockSFCCResponse = (overrides = {}) => ({
  statusCode: 200,
  headers: {},
  body: 'Mock response',
  ...overrides
});
```

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
   - [ ] copilot-instructions.md architecture updates
   - [ ] GitHub Pages documentation updates
   - [ ] CHANGELOG.md entry

2. **Testing**
   - [ ] All unit tests pass
   - [ ] Integration tests with real SFCC instance
   - [ ] Documentation-only mode validation
   - [ ] AI interface compatibility tests

3. **Build & Package**
   - [ ] TypeScript compilation successful
   - [ ] Package size optimization
   - [ ] Dependency audit clean

4. **Release**
   - [ ] GitHub release with changelog
   - [ ] npm publish
   - [ ] Documentation deployment

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
4. **Test Thoroughly**: All tests must pass
5. **Submit PR**: Provide clear description and link to related issues

### Code Review

- **Two Approvals**: Required for merging to main branch
- **Automated Checks**: CI/CD pipeline must pass
- **Documentation Review**: Technical writing review for user-facing changes

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
// Validate all inputs
function validateToolInput(input: unknown): ToolParams {
  const schema = Joi.object({
    query: Joi.string().required().max(1000),
    limit: Joi.number().optional().min(1).max(100)
  });
  
  const { error, value } = schema.validate(input);
  if (error) {
    throw new ValidationError(`Invalid input: ${error.message}`);
  }
  
  return value;
}
```

---

## Next Steps

- 🏗️ **[Project Architecture](https://github.com/taurgis/sfcc-dev-mcp/wiki/Architecture)** - Deep dive into system design
- 🧪 **[Testing Guide](https://github.com/taurgis/sfcc-dev-mcp/wiki/Testing)** - Comprehensive testing strategies
- 📚 **[API Reference](https://github.com/taurgis/sfcc-dev-mcp/wiki/API)** - Complete API documentation
