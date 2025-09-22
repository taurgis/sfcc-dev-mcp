# MCP Aegis - Programmatic Testing Guide for AI Agents

**Target Audience**: AI coding assistants generating JavaScript/TypeScript programmatic t# Debugging and monitoring
const stderr = client.getStderr();      // Get captured stderr
client.clearStderr();                   // Clear stderr buffer (REQUIRED in beforeEach!)

**⚠️ CRITICAL**: Always include `client.clearStderr()` in your `beforeEach()` hook to prevent stderr from one test affecting the next test. This is a common source of test flakiness. files for Model Context Protocol servers.

## Overview

**Programmatic Testing** provides JavaScript/TypeScript API for complex MCP server testing scenarios that require dynamic validation logic, multi-step workflows, and integration with existing test suites. **For basic functional testing, the YAML-based testing approach (see `../yaml/AGENTS.md`) is more than sufficient and recommended.**

### When to Use Programmatic vs YAML Testing

**Use YAML Testing for:**
- ✅ Basic functional validation (tool discovery, parameter validation, response structure)
- ✅ Standard error handling scenarios
- ✅ Simple input/output verification
- ✅ CI/CD pipeline testing (more reliable across environments)
- ✅ Quick test development and maintenance

**Use Programmatic Testing for:**
- Complex business logic validation requiring code execution
- Multi-step workflows with state management
- Dynamic test case generation based on server configuration
- Integration with existing JavaScript/TypeScript test suites
- Advanced error recovery and resilience testing

### 📚 Key Resources
- **[Programmatic Testing Documentation](https://aegis.rhino-inquisitor.com/programmatic-testing.html)** - Complete guide
- **[API Reference](https://aegis.rhino-inquisitor.com/api-reference.html)** - All methods and properties
- **[Examples Directory](../../examples/)** - Real-world programmatic test files
- **[YAML Testing Guide](../yaml/AGENTS.md)** - Recommended for basic testing scenarios

## Quick Setup

### 1. Installation and Initialization
```bash
# Install in project
npm install --save-dev mcp-aegis
# OR 
npx mcp-aegis init
```

### 2. Configuration File
Always create `aegis.config.json` first:

```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "env": {
    "NODE_ENV": "test"
  }
}
```

### 3. Basic Programmatic Test Structure
File naming convention: `*.programmatic.test.js`

```javascript
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('[SERVER_NAME] Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./aegis.config.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    client.clearAllBuffers(); // Recommended - comprehensive protection
    // OR: client.clearStderr(); // Minimum - stderr only
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools), 'Tools should be array');
    assert.ok(tools.length > 0, 'Should have at least one tool');
  });

  test('should execute tool successfully', async () => {
    const result = await client.callTool('[TOOL_NAME]', { param: 'value' });
    assert.ok(result.content, 'Should return content');
    assert.equal(result.isError, false, 'Should not be error');
  });
});
```

## Quick Debugging with Query Command

Before writing comprehensive programmatic tests, use the `query` command to rapidly test your server:

```bash
# List all available tools
aegis query --config aegis.config.json

# Test specific tool with arguments
aegis query read_file '{"path": "test.txt"}' --config aegis.config.json

# Get JSON output for inspection
aegis query calculator '{"operation": "add", "a": 5, "b": 3}' --config aegis.config.json --json
```

**Benefits for programmatic testing workflow**:
- **Rapid prototyping**: Verify server behavior before writing test code
- **API exploration**: Discover tool signatures and response formats
- **Debug assistance**: Inspect actual responses to design assertions
- **Development speed**: Test changes instantly without rebuilding test suite

**Integration with programmatic tests**:
```javascript
// Use query command findings to create targeted tests
test('should handle file reading as discovered via query', async () => {
  // Based on: aegis query read_file '{"path": "test.txt"}'
  const result = await client.callTool('read_file', { path: 'test.txt' });
  
  // Query command showed this response structure:
  assert.ok(result.content);
  assert.equal(result.content[0].type, 'text');
  assert.ok(result.content[0].text.includes('expected content'));
});
```

## API Reference

### Main Entry Points
```javascript
import { createClient, connect } from 'mcp-aegis';

// Option 1: Create client (not connected)
const client = await createClient('./aegis.config.json');
await client.connect();

// Option 2: Create and auto-connect
const connectedClient = await connect('./aegis.config.json');

// Option 3: Inline configuration
const client = await connect({
  name: 'My Server',
  command: 'node',
  args: ['./server.js'],
  cwd: './server-directory',
  startupTimeout: 5000
});
```

### Core Methods
```javascript
// Server lifecycle
await client.connect();                 // Start server + MCP handshake
await client.disconnect();              // Graceful shutdown
const isConnected = client.connected;   // Connection status

// Tool operations
const tools = await client.listTools();                    // Get available tools
const result = await client.callTool(name, arguments);     // Execute tool
const response = await client.sendMessage(jsonRpcMessage); // Raw JSON-RPC

// Debugging and monitoring
const stderr = client.getStderr();      // Get captured stderr
client.clearStderr();                   // Clear stderr buffer
```

### Error Handling
```javascript
try {
  const result = await client.callTool('nonexistent_tool', {});
} catch (error) {
  assert.ok(error.message.includes('Failed to call tool'));
  // Error details available in error object
}

// Check for execution errors (not exceptions)
const result = await client.callTool('tool_name', { invalid: 'param' });
if (result.isError) {
  assert.ok(result.content[0].text.includes('error message'));
}
```

## Critical: Preventing Test Interference

### Buffer Leaking Prevention
**The most common source of flaky programmatic tests is buffer leaking between tests.** When one test generates output (stderr, partial stdout messages) and doesn't clear it, subsequent tests may see the output from previous tests, causing unexpected failures.

#### Always Include beforeEach Hook
```javascript
beforeEach(() => {
  // RECOMMENDED: Clear all buffers to prevent any leaking
  client.clearAllBuffers();
  
  // OR minimum: Clear only stderr (less comprehensive)
  // client.clearStderr();
});
```

#### Buffer Bleeding Sources
- **Stderr buffer**: Error messages and debug output
- **Stdout buffer**: Partial JSON messages from previous requests  
- **Ready state**: Server readiness flag not reset
- **Pending reads**: Lingering message handlers

**Best Practice**: Use `client.clearAllBuffers()` instead of just `clearStderr()` for comprehensive protection.

#### Common Anti-Patterns to Avoid
```javascript
// ❌ WRONG - Missing beforeEach entirely
describe('My Tests', () => {
  let client;
  
  before(async () => {
    client = await connect('./config.json');
  });
  
  // Missing beforeEach - tests will leak buffers!
  
  test('first test', async () => {
    const result = await client.callTool('tool', {});
    // This test might generate stderr or leave stdout buffer data
  });
  
  test('second test', async () => {
    // This test might see output from first test!
    assert.equal(client.getStderr(), ''); // Will fail if first test had stderr
  });
});

// ✅ CORRECT - Include beforeEach with clearStderr
describe('My Tests', () => {
  let client;
  
  before(async () => {
    client = await connect('./config.json');
  });
  
  beforeEach(() => {
    client.clearAllBuffers(); // Prevents all buffer leaking between tests
  });
  
  test('first test', async () => {
    const result = await client.callTool('tool', {});
    // Any stderr is isolated to this test
  });
  
  test('second test', async () => {
    // Clean slate - no stderr from previous tests
    assert.equal(client.getStderr(), ''); // Will pass
  });
});
```

#### Debugging Stderr Issues
If you're experiencing flaky test failures related to unexpected stderr content:

1. **Add clearStderr() to beforeEach** - Most common fix
2. **Check test isolation** - Ensure each test starts with clean state  
3. **Debug stderr content** - Log `client.getStderr()` to see what's leaking
4. **Use afterEach cleanup** - Optional additional cleanup

```javascript
beforeEach(() => {
  client.clearStderr();
});

afterEach(() => {
  // Optional: Debug what stderr was generated
  const stderr = client.getStderr();
  if (stderr) {
    console.log('Test generated stderr:', stderr);
  }
});
```

## Testing Patterns

### 1. Tool Discovery and Validation
```javascript
describe('Tool Discovery', () => {
  test('should list all expected tools', async () => {
    const tools = await client.listTools();
    
    assert.equal(tools.length, 4, 'Should have 4 tools');
    
    const toolNames = tools.map(tool => tool.name);
    assert.ok(toolNames.includes('calculator'));
    assert.ok(toolNames.includes('text_processor'));
    assert.ok(toolNames.includes('data_validator'));
  });

  test('should validate tool schemas', async () => {
    const tools = await client.listTools();
    
    tools.forEach(tool => {
      assert.ok(tool.name, 'Tool should have name');
      assert.ok(tool.description, 'Tool should have description');
      assert.ok(tool.inputSchema, 'Tool should have input schema');
      assert.equal(tool.inputSchema.type, 'object');
    });
  });
});
```

### 2. Tool Execution Testing
```javascript
describe('Calculator Tool', () => {
  test('should perform basic arithmetic', async () => {
    const result = await client.callTool('calculator', {
      operation: 'add',
      a: 15,
      b: 27
    });

    assert.equal(result.isError, false);
    assert.equal(result.content.length, 1);
    assert.equal(result.content[0].type, 'text');
    assert.equal(result.content[0].text, 'Result: 42');
  });

  test('should handle division by zero', async () => {
    const result = await client.callTool('calculator', {
      operation: 'divide',
      a: 10,
      b: 0
    });

    assert.equal(result.isError, true);
    assert.ok(result.content[0].text.includes('division by zero'));
  });

  test('should validate required parameters', async () => {
    const result = await client.callTool('calculator', {
      operation: 'add'
      // Missing a and b parameters
    });

    assert.equal(result.isError, true);
    assert.ok(result.content[0].text.includes('required'));
  });
});
```

### 3. Multi-Step Workflows
```javascript
describe('Multi-Step Agent Workflows', () => {
  test('should support complex decision chains', async () => {
    // Step 1: Search for information
    const searchResult = await client.callTool('search_knowledge', {
      query: 'customer support best practices'
    });
    assert.equal(searchResult.isError, false);
    
    // Step 2: Analyze findings
    const analysisResult = await client.callTool('analyze_content', {
      content: searchResult.content[0].text,
      focus: 'actionable recommendations'
    });
    assert.equal(analysisResult.isError, false);
    
    // Step 3: Generate summary based on analysis
    const summaryResult = await client.callTool('generate_summary', {
      source_data: analysisResult.content[0].text,
      format: 'executive_summary'
    });
    assert.equal(summaryResult.isError, false);
    assert.ok(summaryResult.content[0].text.includes('Executive Summary'));
  });

  test('should maintain context across tool calls', async () => {
    // Initialize conversation context
    const initResult = await client.callTool('conversation_manager', {
      action: 'initialize',
      user_id: 'test_user_123'
    });
    assert.equal(initResult.isError, false);
    
    const sessionId = extractSessionId(initResult.content[0].text);
    
    // Make context-dependent call
    const contextResult = await client.callTool('conversation_manager', {
      action: 'recall',
      user_id: 'test_user_123',
      session_id: sessionId
    });
    assert.equal(contextResult.isError, false);
    assert.ok(contextResult.content[0].text.includes('session found'));
  });
});
```

### 4. Error Recovery and Resilience
```javascript
describe('Error Recovery', () => {
  test('should handle failures gracefully', async () => {
    // Test normal operation
    const normalResult = await client.callTool('external_api_call', {
      endpoint: 'users',
      action: 'list'
    });
    assert.equal(normalResult.isError, false);
    
    // Test failure scenario - should not throw
    const failureResult = await client.callTool('external_api_call', {
      endpoint: 'invalid_endpoint',
      action: 'list'
    });
    assert.equal(failureResult.isError, true);
    assert.ok(failureResult.content[0].text.includes('not found'));
    
    // Test recovery - should work again
    const recoveryResult = await client.callTool('external_api_call', {
      endpoint: 'users',
      action: 'list'
    });
    assert.equal(recoveryResult.isError, false);
  });

  test('should handle server restart scenarios', async () => {
    // Verify initial connection
    const tools = await client.listTools();
    assert.ok(tools.length > 0);
    
    // Simulate server issue by calling invalid method
    try {
      await client.sendMessage({
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'invalid_method',
        params: {}
      });
    } catch (error) {
      // Expected error
    }
    
    // Verify connection still works
    const toolsAfter = await client.listTools();
    assert.ok(toolsAfter.length > 0);
  });
});
```

### ⚠️ Critical: Avoid Concurrent Requests

**Never use `Promise.all()` or concurrent requests** with MCP Aegis's programmatic API. MCP communication uses a single stdio process with shared message handlers and buffers. Concurrent requests can cause:

- **Buffer conflicts**: Multiple requests writing to the same stdout/stderr streams
- **Message handler interference**: JSON-RPC messages getting mixed or corrupted  
- **Race conditions**: Responses arriving out of order or getting lost
- **Unpredictable test failures**: Flaky tests that pass/fail randomly

```javascript
// ❌ NEVER DO THIS - Causes buffer/message handler conflicts
const promises = tools.map(tool => client.callTool(tool.name, {}));
const results = await Promise.all(promises); // WILL CAUSE ISSUES!

// ✅ ALWAYS DO THIS - Sequential requests work reliably
const results = [];
for (const tool of tools) {
  const result = await client.callTool(tool.name, {});
  results.push(result);
}
```

### 5. Sequential Request Testing
```javascript
describe('Sequential Request Testing', () => {
  test('should handle sequential requests correctly', async () => {
    const results = [];
    
    // Execute requests sequentially to avoid buffer/message handler conflicts
    for (let i = 0; i < 10; i++) {
      const result = await client.callTool('sequential_operation', { id: i });
      results.push(result);
    }
    
    results.forEach((result, i) => {
      assert.equal(result.isError, false, `Request ${i} should succeed`);
      assert.ok(result.content[0].text.includes(`id: ${i}`));
    });
  });

  test('should handle large payload processing', async () => {
    const largeText = 'x'.repeat(50000); // 50KB text
    
    const result = await client.callTool('text_processor', {
      text: largeText,
      operation: 'word_count'
    });
    
    assert.equal(result.isError, false);
    assert.ok(result.content[0].text.includes('50000'));
  });
});
```

### ⚠️ Performance Testing Not Recommended

**Performance testing is not recommended in programmatic tests** due to CI environment variability. CI environments have:
- Highly variable resource allocation and sharing
- Unpredictable I/O performance and network latency  
- JIT compilation delays and garbage collection interference
- Container and process initialization overhead

**Use dedicated performance testing tools instead:**
- Load testing frameworks (Artillery, k6, Apache JMeter)
- APM tools (New Relic, DataDog, AppDynamics)
- Custom monitoring with controlled environments
- Synthetic monitoring services

**If you must include timing validation**, use extremely lenient thresholds (5+ seconds) and focus on detecting major regressions rather than precise performance requirements.

### 6. Dynamic Validation Logic
```javascript
describe('Dynamic Validation', () => {
  test('should validate business rules dynamically', async () => {
    const tools = await client.listTools();
    
    // Dynamic validation based on actual tools
    const calculatorTool = tools.find(t => t.name === 'calculator');
    if (calculatorTool) {
      const supportedOps = calculatorTool.inputSchema.properties.operation.enum;
      
      for (const operation of supportedOps) {
        const result = await client.callTool('calculator', {
          operation,
          a: 10,
          b: 5
        });
        assert.equal(result.isError, false, `Operation ${operation} should work`);
      }
    }
  });

  test('should generate test cases from schema', async () => {
    const tools = await client.listTools();
    
    for (const tool of tools) {
      const schema = tool.inputSchema;
      const testCases = generateTestCases(schema);
      
      for (const testCase of testCases) {
        const result = await client.callTool(tool.name, testCase.input);
        
        if (testCase.shouldSucceed) {
          assert.equal(result.isError, false, 
            `${tool.name} should succeed with ${JSON.stringify(testCase.input)}`);
        } else {
          assert.equal(result.isError, true,
            `${tool.name} should fail with ${JSON.stringify(testCase.input)}`);
        }
      }
    }
  });
});

function generateTestCases(schema) {
  // Generate test cases based on JSON schema
  const testCases = [];
  
  // Valid case with all required properties
  const validCase = {};
  for (const [prop, propSchema] of Object.entries(schema.properties || {})) {
    if (propSchema.type === 'string') {
      validCase[prop] = 'test_value';
    } else if (propSchema.type === 'number') {
      validCase[prop] = 42;
    }
  }
  testCases.push({ input: validCase, shouldSucceed: true });
  
  // Invalid case missing required properties
  if (schema.required?.length > 0) {
    testCases.push({ input: {}, shouldSucceed: false });
  }
  
  return testCases;
}
```

## Advanced Testing Scenarios

### State Management Testing
```javascript
describe('State Management', () => {
  test('should maintain state across multiple calls', async () => {
    // Initialize state
    await client.callTool('state_manager', {
      action: 'set',
      key: 'test_key',
      value: 'test_value'
    });
    
    // Verify state persists
    const result = await client.callTool('state_manager', {
      action: 'get',
      key: 'test_key'
    });
    
    assert.equal(result.content[0].text, 'test_value');
  });
});
```

### Integration Testing with External Services
```javascript
describe('External Service Integration', () => {
  test('should handle API dependencies', async () => {
    // Mock external service responses if needed
    const result = await client.callTool('api_client', {
      endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET'
    });
    
    assert.equal(result.isError, false);
    const responseData = JSON.parse(result.content[0].text);
    assert.ok(responseData.id);
    assert.ok(responseData.title);
  });
});
```

### Custom Assertion Helpers
```javascript
// Helper functions for common assertions
function assertValidMCPResponse(result) {
  assert.ok(result.content, 'Should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
}

function assertTextContent(result, expectedSubstring) {
  assertValidMCPResponse(result);
  assert.equal(result.content[0].type, 'text');
  assert.ok(result.content[0].text.includes(expectedSubstring));
}

function assertToolSchema(tool) {
  assert.ok(tool.name, 'Tool should have name');
  assert.ok(tool.description, 'Tool should have description');
  assert.ok(tool.inputSchema, 'Tool should have schema');
  assert.equal(tool.inputSchema.type, 'object');
}

// Usage
test('should return valid calculation result', async () => {
  const result = await client.callTool('calculator', { operation: 'add', a: 2, b: 3 });
  assertTextContent(result, 'Result: 5');
});
```

## Framework Integration

### Jest Integration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['**/*.programmatic.test.js']
};

// test/setup.js
global.mcpClient = null;

beforeAll(async () => {
  const { connect } = require('mcp-aegis');
  global.mcpClient = await connect('./aegis.config.json');
});

afterAll(async () => {
  if (global.mcpClient) {
    await global.mcpClient.disconnect();
  }
});
```

### Mocha Integration
```javascript
// test/helpers/mcp-setup.js
const { connect } = require('mcp-aegis');

let client;

exports.mochaHooks = {
  beforeAll: async () => {
    client = await connect('./aegis.config.json');
  },
  afterAll: async () => {
    if (client) {
      await client.disconnect();
    }
  }
};

exports.getClient = () => client;
```

### TypeScript Support
```typescript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect, MCPClient } from 'mcp-aegis';

describe('TypeScript MCP Tests', () => {
  let client: MCPClient;

  before(async () => {
    client = await connect('./aegis.config.json');
  });

  after(async () => {
    await client.disconnect();
  });

  test('should have typed responses', async () => {
    const tools = await client.listTools();
    
    // TypeScript provides full type safety
    assert.ok(Array.isArray(tools));
    tools.forEach(tool => {
      assert.ok(typeof tool.name === 'string');
      assert.ok(typeof tool.description === 'string');
      assert.ok(typeof tool.inputSchema === 'object');
    });
  });
});
```

## Best Practices for AI Agents

### 1. Test Structure Generation
```javascript
// Template for generating comprehensive test suites
function generateTestSuite(serverConfig, toolList) {
  return `
describe('${serverConfig.name} Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('${serverConfig.configPath}');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    client.clearStderr();
  });

  describe('Protocol Compliance', () => {
    test('should complete MCP handshake', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should list available tools', async () => {
      const tools = await client.listTools();
      assert.ok(Array.isArray(tools));
      assert.equal(tools.length, ${toolList.length});
    });
  });

  ${toolList.map(tool => generateToolTests(tool)).join('\n\n')}
});`;
}

function generateToolTests(tool) {
  return `
  describe('${tool.name} Tool', () => {
    test('should execute successfully with valid parameters', async () => {
      const result = await client.callTool('${tool.name}', ${JSON.stringify(tool.validParams)});
      assert.equal(result.isError, false);
      assertValidMCPResponse(result);
    });

    test('should handle invalid parameters gracefully', async () => {
      const result = await client.callTool('${tool.name}', {});
      assert.equal(result.isError, true);
      assertTextContent(result, 'required');
    });
  });`;
}
```

### 2. Configuration Management
```javascript
// Detect server configuration from project structure
function detectServerConfig(projectPath) {
  const packageJson = readPackageJson(projectPath);
  
  return {
    name: packageJson.name || 'MCP Server',
    command: detectRuntime(packageJson.engines),
    args: [detectServerFile(projectPath)],
    cwd: projectPath,
    startupTimeout: 5000,
    env: {
      NODE_ENV: 'test',
      ...(packageJson.mcpConfig?.testEnv || {})
    }
  };
}

function detectRuntime(engines = {}) {
  if (engines.node) return 'node';
  if (engines.python) return 'python';
  return 'node'; // default
}
```

### 3. Error Pattern Recognition
```javascript
// Common error patterns to test for
const errorPatterns = [
  { type: 'validation', keywords: ['required', 'invalid', 'missing'] },
  { type: 'not_found', keywords: ['not found', 'does not exist'] },
  { type: 'permission', keywords: ['permission', 'unauthorized', 'forbidden'] },
  { type: 'network', keywords: ['connection', 'timeout', 'unreachable'] }
];

function categorizeError(errorText) {
  for (const pattern of errorPatterns) {
    if (pattern.keywords.some(keyword => 
        errorText.toLowerCase().includes(keyword))) {
      return pattern.type;
    }
  }
  return 'unknown';
}
```

### 4. Built-in Functional Monitoring
```javascript
// Focus on functional correctness rather than timing
class FunctionalMonitor {
  constructor() {
    this.results = new Map();
  }

  async validateTool(client, toolName, params) {
    const result = await client.callTool(toolName, params);
    
    const validation = {
      success: !result.isError,
      hasContent: result.content && result.content.length > 0,
      contentType: result.content?.[0]?.type,
      timestamp: new Date().toISOString()
    };
    
    if (!this.results.has(toolName)) {
      this.results.set(toolName, []);
    }
    this.results.get(toolName).push(validation);
    
    return { result, validation };
  }

  getReliabilityStats(toolName) {
    const validations = this.results.get(toolName) || [];
    const successful = validations.filter(v => v.success).length;
    
    return {
      totalCalls: validations.length,
      successRate: successful / validations.length,
      failureRate: (validations.length - successful) / validations.length,
      lastValidation: validations[validations.length - 1]?.timestamp
    };
  }
}
```

## Test Execution Commands

**CRITICAL**: Use the correct test commands for this SFCC Dev MCP project:

```bash
# Run individual MCP programmatic test (CORRECT for this project)
node --test tests/mcp/node/specific-test.programmatic.test.js

# Run all MCP programmatic tests (CORRECT for this project)  
npm run test:mcp:node

# Run all MCP tests (YAML + programmatic) (CORRECT for this project)
npm run test:mcp:all

# ❌ WRONG: Don't use npm test with individual files for MCP tests
# npm test -- tests/mcp/node/specific-test.programmatic.test.js  # This runs Jest!

# ❌ WRONG: Don't use Jest for MCP programmatic tests  
# npx jest --testMatch="**/*.programmatic.test.js"  # Jest doesn't handle MCP tests

# Watch mode for development (Node.js test runner)
node --test --watch tests/mcp/node/*.programmatic.test.js

# Jest is used for unit tests only (src/ directory)
jest base-handler.test.ts

# Complete test suite (Jest + MCP tests)
npm test
```

**Package.json Script Reference for this project:**
- `npm run test:mcp:node` → `node --test tests/mcp/node/*.programmatic.test.js`
- `npm run test:mcp:yaml` → Aegis YAML tests (docs-only mode)
- `npm run test:mcp:yaml:full` → Aegis YAML tests (full mode)
- `npm run test:mcp:all` → All MCP tests (YAML + programmatic)
- `npm test` → Jest unit tests + MCP tests

---

**Key Success Factors for Programmatic Testing:**
1. Always use proper lifecycle management (before/after hooks)
2. Clear stderr between tests for isolation
3. Use appropriate assertion libraries and helpers
4. Include comprehensive error handling tests
5. Test both success and failure scenarios
6. Implement performance monitoring for critical operations
7. Use TypeScript for better development experience
8. Integrate with existing testing frameworks and CI/CD pipelines
