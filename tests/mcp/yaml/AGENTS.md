# MCP Conductor - YAML Testing Guide for AI Agents

**Target Audience**: AI coding assistants generating declarative YAML test files for Model Context Protocol servers.

## Overview

**YAML Testing** provides declarative, human-readable test files for MCP servers with advanced pattern matching. Perfect for protocol compliance, basic tool testing, and maintainable test suites without requiring programming knowledge.

### 📚 Key Resources
- **[YAML Testing Documentation](https://conductor.rhino-inquisitor.com/yaml-testing.html)** - Complete guide
- **[Pattern Matching Reference](https://conductor.rhino-inquisitor.com/pattern-matching.html)** - All 11+ pattern types
- **[Examples Directory](../../examples/)** - Real-world YAML test files

## Quick Setup

### 1. Configuration First (Always Required)
Create `conductor.config.json`:

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

### 2. Basic YAML Test Structure
File naming convention: `*.test.mcp.yml`

```yaml
description: "Test suite for [SERVER_NAME]"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-1"
        result:
          tools: "match:type:array"
      stderr: "toBeEmpty"

  - it: "should execute [TOOL_NAME] successfully"
    request:
      jsonrpc: "2.0"
      id: "call-1"
      method: "tools/call"
      params:
        name: "[TOOL_NAME]"
        arguments:
          param: "value"
    expect:
      response:
        jsonrpc: "2.0"
        id: "call-1"
        result:
          content:
            - type: "text"
              text: "match:contains:expected"
          isError: false
      stderr: "toBeEmpty"
```

### 3. Execute Tests
```bash
# Basic execution
conductor "tests/**/*.test.mcp.yml" --config "conductor.config.json"

# With debugging options
conductor "tests/*.yml" --config "config.json" --verbose --debug
```

## Essential YAML Patterns

### 1. Deep Equality (Default)
```yaml
result:
  tools:
    - name: "read_file"
      description: "Reads a file"
      inputSchema:
        type: "object"
```

### 2. Type Validation
```yaml
result:
  tools: "match:type:array"
  count: "match:type:number"
  serverInfo: "match:type:object"
  active: "match:type:boolean"
```

### 3. String Patterns
```yaml
# Contains substring
result:
  content:
    - type: "text"
      text: "match:contains:MCP"

# Starts with / Ends with
result:
  name: "match:startsWith:get_"
  version: "match:endsWith:.0"
  jsonrpc: "match:startsWith:2."    # JSON-RPC version validation
```

### 4. Array Patterns
```yaml
# Array length validation
result:
  tools: "match:arrayLength:4"

# Array elements - all must match pattern
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      inputSchema: "match:type:object"
```

### 5. Field Extraction (Advanced)
```yaml
# Extract tool names using dot notation
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"
    - "calculator"

# Extract using bracket notation (NEW!)
result:
  match:extractField: "tools[0].name"    # First tool name
  value: "read_file"

# Check if array contains value
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:search_docs"
```

### 6. Regex Patterns (Escape Backslashes!)
```yaml
# Basic patterns
result:
  content:
    - text: "match:\\d+ files found"              # Numbers
    - text: "match:Status: (success|error)"       # Alternatives

# For substantial content (multiline-safe)
result:
  content:
    - text: "match:[\\s\\S]{1000,}"               # Min 1000 chars, any content
    - text: "match:[\\s\\S]{500,}"                # Min 500 chars
```

#### 🚨 CRITICAL: Multiline Regex Patterns
**JavaScript regex does NOT support inline flags like `(?s)` or `(?m)`**

```yaml
# ❌ WRONG - These JavaScript-incompatible patterns will FAIL
result:
  content:
    - text: "match:regex:(?s)(?=.*pattern1)(?=.*pattern2)"    # (?s) flag invalid
    - text: "match:regex:(?m)^Start.*End$"                    # (?m) flag invalid

# ✅ CORRECT - Use [\s\S]* for multiline matching
result:
  content:
    - text: "match:regex:[\\s\\S]*\\(component[\\s\\S]*\\(hook"  # Matches across newlines
    - text: "match:regex:[\\s\\S]*pattern1[\\s\\S]*pattern2"     # General multiline pattern

# ✅ CORRECT - Alternative approaches for complex patterns
result:
  content:
    - text: "match:contains:pattern1"             # Simple substring
    - text: "match:regex:pattern1.*pattern2"      # Single line patterns
```

**Why `[\s\S]*` works:**
- `\s` matches whitespace characters (including newlines)
- `\S` matches non-whitespace characters  
- `[\s\S]` matches ANY character (whitespace OR non-whitespace)
- `[\s\S]*` matches any sequence of characters including newlines

**Common multiline scenarios:**
```yaml
# Matching content with patterns on different lines
result:
  content:
    - text: "match:regex:[\\s\\S]*Found \\d+ results[\\s\\S]*component[\\s\\S]*hook"

# Matching substantial content that spans multiple lines
result:
  content:
    - text: "match:regex:[\\s\\S]{100,}"         # At least 100 chars, any content
```

### 7. Partial Matching
```yaml
result:
  match:partial:
    tools:
      - name: "expected_tool"
        description: "match:contains:search"
    # Other fields ignored
```

### 8. Error Validation
```yaml
# Clean execution
stderr: "toBeEmpty"

# Error scenarios
result:
  isError: true
  content:
    - type: "text"
      text: "match:contains:not found"

# Stderr pattern matching
stderr: "match:contains:Warning"
```

## CLI Options for Development

### Debug and Development Options
```bash
# Verbose - shows test hierarchy and results
conductor "tests/*.yml" --config config.json --verbose

# Debug - shows JSON-RPC communication  
conductor "tests/*.yml" --config config.json --debug

# Timing - performance analysis
conductor "tests/*.yml" --config config.json --timing

# Combined debugging
conductor "tests/*.yml" --config config.json --verbose --debug --timing
```

### Production and CI Options
```bash
# JSON output for automation
conductor "tests/*.yml" --config config.json --json

# Quiet mode (exit codes only)
conductor "tests/*.yml" --config config.json --quiet
```

## 🚨 Critical YAML Anti-Patterns

### 1. Duplicate YAML Keys (Fatal Error)
```yaml
# ❌ FATAL - Duplicate keys overwrite each other
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]              # OVERWRITES previous line!
  match:extractField: "tools.*.name"
  match:extractField: "isError"     # Another duplicate!

# ✅ CORRECT - Separate validations into different tests
result:
  tools: "match:arrayLength:1"

# In separate test:
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"
```

### 2. Pattern Structure Confusion
```yaml
# ❌ WRONG - Mixing arrayElements with direct array
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # Structure conflict!

# ✅ CORRECT - Choose one approach
result:
  content:
    match:arrayElements:
      type: "text"
      text: "match:contains:data"
```

### 3. Response Structure Assumptions
```yaml
# ❌ WRONG - Assuming array when response is object  
result:
  content:
    match:arrayElements:  # But response is single object!
      type: "text"

# ✅ CORRECT - Match actual response structure
result:
  content:
    - type: "text"
      text: "match:contains:data"
```

## Pattern Development Workflow

### 1. Start with Debug Mode
```bash
conductor test.yml --config config.json --debug
```
This shows the actual JSON-RPC responses from your server.

### 2. Use Actual Response Structure
Copy the exact response structure from debug output, then replace values with patterns:

```yaml
# Start with exact match
result:
  tools:
    - name: "read_file"
      description: "Reads a file"

# Then add patterns incrementally  
result:
  tools:
    - name: "match:type:string"
      description: "match:contains:file"
```

### 3. Test Incrementally
- Begin with deep equality
- Add one pattern at a time
- Validate YAML syntax with linters
- Run tests after each change

## Real-World Examples

### Protocol Compliance Test
```yaml
- it: "should complete MCP handshake and list tools"
  request:
    jsonrpc: "2.0"
    id: "init-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "init-1"
      result:
        tools: "match:type:array"
    stderr: "toBeEmpty"
```

### Tool Execution with Validation
```yaml
- it: "should read file and return content"
  request:
    jsonrpc: "2.0"
    id: "read-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "read-1"
      result:
        content:
          - type: "text"
            text: "Hello, MCP Conductor!"
        isError: false
    stderr: "toBeEmpty"
```

### Error Handling Test
```yaml
- it: "should handle non-existent file gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "/non/existent/file.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "error-1"
      result:
        content:
          - type: "text"
            text: "match:contains:not found"
        isError: true
    stderr: "toBeEmpty"
```

### Advanced Pattern Example
```yaml
- it: "should have well-documented tools with proper schemas"
  request:
    jsonrpc: "2.0"
    id: "validation"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"      # snake_case validation
            description: "match:regex:.{20,}"           # Min 20 characters
            inputSchema:
              type: "match:type:string"
              properties: "match:type:object"
```

## Test Categories for AI Generation

### 1. Protocol Tests (Always Include)
- MCP handshake completion
- Tools list retrieval
- Unknown method handling

### 2. Tool Execution Tests (Per Tool)
- Valid parameter execution
- Missing required parameters
- Invalid parameter types
- Business logic validation

### 3. Error Handling Tests (Always Include)
- Unknown tool calls
- Malformed requests
- Server error responses

### 4. Edge Cases
- Boundary conditions
- Large payload handling
- Timeout scenarios

## Best Practices for AI Agents

### Configuration Detection
```javascript
// Detect from package.json
"command": detectRuntime(packageJson.engines),  // node, python, etc.
"args": [serverFile, ...requiredArgs],
"startupTimeout": estimateStartupTime(complexity)  // 5000ms default
```

### Pattern Selection Strategy
1. **Simple tools**: Use deep equality for predictable responses
2. **Dynamic content**: Use `match:contains:` for variable text
3. **Arrays**: Use `match:arrayLength:` for count validation
4. **Complex validation**: Use field extraction for specific checks
5. **Large responses**: Use regex with minimum length patterns

### Test Structure Template
```yaml
description: "Comprehensive test suite for {{SERVER_NAME}}"
tests:
  # Protocol compliance
  - it: "should list available tools"
    # ... tools/list test
  
  # Per-tool tests
  {{#each tools}}
  - it: "should execute {{name}} with valid parameters"
    # ... tools/call test with success case
  
  - it: "should handle {{name}} errors gracefully"
    # ... tools/call test with error case
  {{/each}}
  
  # Error scenarios
  - it: "should handle unknown tool calls"
    # ... unknown tool test
```

## Integration with Build Systems

### NPM Scripts
```json
{
  "scripts": {
    "test:mcp": "conductor 'tests/**/*.test.mcp.yml' --config './conductor.config.json'",
    "test:mcp:ci": "npm run test:mcp -- --json --quiet",
    "test:mcp:debug": "npm run test:mcp -- --verbose --debug --timing"
  }
}
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Test MCP Server
  run: |
    npm install -g mcp-conductor
    conductor "tests/**/*.test.mcp.yml" --config "config.json" --json > test-results.json
```

---

**Key Success Factors for YAML Testing:**
1. Always create configuration file first
2. Use debug mode to understand actual responses
3. Start with exact matches, then add patterns
4. Avoid duplicate YAML keys
5. Match actual response structure
6. Test incrementally
7. Include protocol, tool execution, and error tests
8. Use appropriate patterns for content type (static vs dynamic)
