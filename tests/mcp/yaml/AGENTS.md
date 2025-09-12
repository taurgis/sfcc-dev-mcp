# MCP Conductor - YAML Testing Guide for AI Agents

**Target**: AI assistants generating declarative YAML test files for Model Context Protocol servers.

**Core Purpose**: Test MCP servers with human-readable YAML files using 30+ advanced pattern matching capabilities including string patterns, numeric comparisons, date validation, array operations, field extraction, cross-field validation, and pattern negation.

## Quick Setup & Usage

### 1. Required Configuration (`*.config.json`)
```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./optional/directory",
  "env": {"CUSTOM_VAR": "value"},
  "startupTimeout": 5000,
  "readyPattern": "Server ready" // optional regex in stderr, preferably don't use
}
```

### Configuration Field Details
- **`name`** (required): Human-readable server name for test reports
- **`command`** (required): Executable command (`node`, `python`, `./binary`)
- **`args`** (required): Array of arguments passed to command
- **`cwd`** (optional): Working directory for server execution  
- **`env`** (optional): Environment variables for server process
- **`startupTimeout`** (optional): Max milliseconds to wait for startup (default: 10000)
- **`readyPattern`** (optional): Regex pattern in stderr indicating server is ready

### Common Server Configurations

#### Node.js MCP Server
```json
{
  "name": "Node.js MCP Server",
  "command": "node",
  "args": ["./dist/index.js"],
  "cwd": "./server",
  "startupTimeout": 5000,
  "readyPattern": "MCP server listening"
}
```

#### Python MCP Server  
```json
{
  "name": "Python MCP Server", 
  "command": "python",
  "args": ["-m", "my_mcp_server"],
  "cwd": "./python-server",
  "env": {
    "PYTHONPATH": "./src",
    "DEBUG": "true"
  },
  "startupTimeout": 8000,
  "readyPattern": "Server ready on stdio"
}
```

#### Development Server with Hot Reload
```json
{
  "name": "Development Server",
  "command": "npm",
  "args": ["run", "dev"],
  "cwd": "./mcp-server",
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "*"
  },
  "startupTimeout": 15000,
  "readyPattern": "Watching for file changes"
}
```

### 2. Basic Test Structure (`*.test.mcp.yml`)
```yaml
description: "Test suite description"
tests:
  - it: "Test description"
    request:
      jsonrpc: "2.0"
      id: "unique-id"
      method: "tools/list|tools/call"
      params: {}  # or tool call params
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-id"
        result: {}  # expected response
      stderr: "toBeEmpty"  # optional
```

### 3. Execute Tests
```bash
conductor "tests/**/*.test.mcp.yml" --config "config.json"
conductor "tests/*.yml" --config "config.json" --verbose
```

## 30+ Pattern Matching Reference

### Core Patterns
```yaml
# 1. DEEP EQUALITY (default) - Exact match
result:
  tools: [{name: "read_file", description: "Reads a file"}]

# 2. TYPE VALIDATION
result:
  tools: "match:type:array"
  count: "match:type:number"
  name: "match:type:string"

# 3. STRING PATTERNS
result:
  text: "match:contains:substring"
  name: "match:startsWith:prefix"
  file: "match:endsWith:.txt"
  pattern: "match:regex:\\d{4}-\\d{2}-\\d{2}"  # YAML: escape backslashes

# 4. ARRAY PATTERNS
result:
  tools: "match:arrayLength:3"
  data: "match:arrayContains:value"
  tools: "match:arrayContains:name:read_file"  # Object field matching
  tools:
    match:arrayElements:  # All elements must match
      name: "match:type:string"
      description: "match:contains:tool"

# 5. FIELD EXTRACTION (dot notation)
result:
  match:extractField: "tools.*.name"  # Extract all tool names
  value: ["read_file", "write_file"]

# 6. NUMERIC COMPARISONS
result:
  count: "match:greaterThan:5"
  price: "match:lessThanOrEqual:100.50"
  amount: "match:greaterThanOrEqual:0"
  score: "match:between:0:100"
  range: "match:range:10:90"
  exact: "match:equals:42"
  not_equal: "match:notEquals:0"
  approximate: "match:approximately:3.14159:0.001"  # tolerance
  decimal: "match:decimalPlaces:2"  # exactly 2 decimal places
  multiple: "match:multipleOf:5"  # divisible by 5
  divisible: "match:divisibleBy:3"  # same as multipleOf

# 7. DATE/TIMESTAMP PATTERNS
result:
  createdAt: "match:dateValid"
  publishDate: "match:dateAfter:2023-01-01"
  expireDate: "match:dateBefore:2025-01-01"
  eventDate: "match:dateBetween:2023-01-01:2024-12-31"
  lastUpdate: "match:dateAge:1d"  # within last day
  fixedEvent: "match:dateEquals:2023-06-15T14:30:00.000Z"

# 8. CROSS-FIELD VALIDATION
result:
  "match:crossField": "price > minPrice"  # Field comparison
  "match:crossField": "endDate >= startDate"
  "match:crossField": "quantity <= maxQuantity"
  "match:crossField": "currentParticipants <= maxParticipants"

# 9. PATTERN NEGATION (prefix any pattern with "not:")
result:
  tools: "match:not:arrayLength:0"  # NOT empty
  text: "match:not:contains:error"  # NOT containing error
  status: "match:not:startsWith:invalid"  # NOT invalid

# 10. PARTIAL MATCHING
result:
  match:partial:  # Only check specified fields
    tools:
      - name: "read_file"
        description: "match:contains:Reads"

# 11. COMBINED PATTERNS - arrayElements + partial (POWERFUL!)
result:
  tools:
    match:arrayElements:  # Apply to ALL array elements
      match:partial:      # But only validate specified fields
        name: "match:regex:^[a-z_]+$"
        description: "match:contains:tool"
        # Ignores any other fields like inputSchema, etc.
```

### Advanced Patterns
```yaml
# NESTED EXTRACTION with wildcards
result:
  match:extractField: "tools.*.inputSchema.properties.*.type"
  value: ["string", "number", "object"]

# CASE INSENSITIVE matching
result:
  name: "match:equalsIgnoreCase:Hello World"
  text: "match:containsIgnoreCase:ERROR"

# ADVANCED NUMERIC PATTERNS
result:
  value: "match:multipleOf:5"        # Must be divisible by 5
  count: "match:divisibleBy:3"       # Same as multipleOf
  percentage: "match:range:0:100"    # Between 0 and 100 inclusive
  score: "match:between:60:90"       # Between 60 and 90 (exclusive)
  exact: "match:notEquals:0"         # Must not equal 0
  precision: "match:decimalPlaces:2" # Exactly 2 decimal places

# COMPLEX REGEX (escape backslashes in YAML)
result:
  email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  multiline: "match:regex:[\\s\\S]*pattern[\\s\\S]*across[\\s\\S]*lines"

# BRACKET NOTATION for special keys
result:
  match:extractField: "data['special-key'].values.*"
  value: "match:arrayContains:expectedValue"

# DATE FORMAT VALIDATION
result:
  isoDate: "match:dateFormat:iso"        # ISO 8601 format
  dateOnly: "match:dateFormat:iso-date"  # YYYY-MM-DD format  
  timeOnly: "match:dateFormat:iso-time"  # HH:MM:SS format
  usDate: "match:dateFormat:us-date"     # MM/DD/YYYY format
  timestamp: "match:dateFormat:timestamp" # Unix timestamp
```

## Critical YAML Syntax Rules

### ❌ AVOID - Common Errors
```yaml
# WRONG - Duplicate YAML keys (overwrites previous)
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # OVERWRITES above line!

# WRONG - Invalid escaping in regex
result:
  text: "match:regex:\d+"  # Missing double backslash

# WRONG - Mixing patterns in same object
result:
  tools: "match:arrayLength:1"
  match:extractField: "tools.*.name"  # Can't mix in same object
```

### ✅ CORRECT - Best Practices
```yaml
# CORRECT - Separate pattern validations into different tests
- it: "should have exactly one tool"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"

- it: "should extract correct tool name"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: ["read_file"]

# CORRECT - Proper regex escaping in YAML
result:
  text: "match:regex:\\d{4}-\\d{2}-\\d{2}"  # Double backslashes

# CORRECT - Array elements structure
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:contains:tool"
```

## Real-World Examples

### Tool Discovery Test
```yaml
- it: "should list available tools with correct structure"
  request:
    jsonrpc: "2.0"
    id: "list-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "list-1"
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"  # snake_case
            description: "match:regex:.{10,}"      # min 10 chars
            inputSchema: "match:type:object"
```

### Tool Discovery Test (Flexible - Recommended)
```yaml
- it: "should validate tool naming and descriptions flexibly"
  request:
    jsonrpc: "2.0"
    id: "list-flexible"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "list-flexible"
      result:
        tools:
          match:arrayElements:
            match:partial:  # Only validate what matters, ignore extra fields
              name: "match:regex:^[a-z][a-z0-9_]*$"  
              description: "match:regex:.{10,}"
```

### Tool Execution Test
```yaml
- it: "should execute tool successfully"
  request:
    jsonrpc: "2.0"
    id: "exec-1" 
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "test.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "exec-1"
      result:
        content:
          - type: "text"
            text: "match:contains:expected content"
        isError: false
    stderr: "toBeEmpty"
```

### Error Handling Test
```yaml
- it: "should handle invalid file gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "nonexistent.txt"
  expect:
    response:
      jsonrpc: "2.0" 
      id: "error-1"
      result:
        content:
          - type: "text"
            text: "match:contains:not found"
        isError: true
```

## CLI Commands

```bash
# Basic testing
conductor "tests/**/*.test.mcp.yml" --config "config.json"

# Debug modes
conductor "tests/*.yml" --config "config.json" --verbose   # Test hierarchy
conductor "tests/*.yml" --config "config.json" --debug     # MCP communication
conductor "tests/*.yml" --config "config.json" --timing    # Performance
conductor "tests/*.yml" --config "config.json" --json      # JSON output
conductor "tests/*.yml" --config "config.json" --quiet     # Minimal output

# Error analysis and debugging
conductor "tests/*.yml" --config "config.json" --errors-only     # Only show errors
conductor "tests/*.yml" --config "config.json" --syntax-only     # Only syntax errors
conductor "tests/*.yml" --config "config.json" --no-analysis     # Disable detailed analysis  
conductor "tests/*.yml" --config "config.json" --group-errors    # Group by type
conductor "tests/*.yml" --config "config.json" --max-errors 5    # Limit error output

# Interactive tool testing
conductor query --config "config.json"                           # List tools
conductor query tool_name '{"param": "value"}' --config "config.json"  # Test tool

# Combined debugging options
conductor "tests/*.yml" --config "config.json" --verbose --debug --timing

# Project initialization  
conductor init                                                    # Create sample config and tests
```

## Pattern Selection Guide

- **Deep Equality**: Exact value matching (default)
- **Type Validation**: Verify data types (`match:type:`)  
- **String Patterns**: Text validation (`contains`, `startsWith`, `endsWith`, `regex`)
- **Array Patterns**: Array validation (`arrayLength`, `arrayContains`, `arrayElements`)
- **Field Extraction**: Extract nested values (`match:extractField`)
- **Numeric**: Math comparisons (`greaterThan`, `approximately`, `decimalPlaces`)
- **Date/Time**: Date validation (`dateValid`, `dateAfter`, `dateAge`)
- **Cross-Field**: Compare fields (`match:crossField`)
- **Negation**: Exclude patterns (`match:not:*`)
- **Partial**: Subset validation (`match:partial`)
- **🔥 Combined arrayElements + partial**: Validate specific fields across ALL array elements while ignoring others - extremely powerful for flexible schema validation!

## Advanced Pattern Combinations

### Multi-Step Validation (Separate Tests)
```yaml
# Test 1: Basic structure validation
- it: "should return array of tools"
  expect:
    response:
      result:
        tools: "match:type:array"

# Test 2: Array length validation  
- it: "should have expected number of tools"
  expect:
    response:
      result:
        tools: "match:arrayLength:3"

# Test 3: Extract and validate specific field
- it: "should have correct tool names"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: ["read_file", "write_file", "list_files"]
```

### Comprehensive Tool Validation
```yaml
- it: "should validate complete tool structure"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"       # snake_case names
            description: "match:regex:.{10,200}"         # 10-200 chars
            inputSchema:
              type: "object"
              properties: "match:type:object"
              required: "match:type:array"
```

### Flexible Tool Validation (Best Practice)
```yaml
- it: "should validate tools with flexible schema handling"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            match:partial:  # 🔥 RECOMMENDED: Combines power with flexibility
              name: "match:regex:^[a-z][a-z0-9_]*$"     # snake_case names
              description: "match:regex:.{10,200}"       # 10-200 chars
              inputSchema:
                type: "object"
                properties: "match:type:object"
                # Don't require 'required' field - some tools may not have required params
```

### Error Response Validation
```yaml
- it: "should return structured error for invalid input"
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:regex:(Error|Failed|Invalid).*"
        metadata: "match:type:object"
```

### Performance and Timing Validation
```yaml
- it: "should complete operation within time limit"
  expect:
    response:
      result:
        match:partial:
          duration: "match:lessThan:1000"        # Under 1 second
          timestamp: "match:dateValid"           # Valid timestamp
          status: "completed"                    # Exact match
```

**Examples**: [filesystem-server/](../../examples/filesystem-server/), [multi-tool-server/](../../examples/multi-tool-server/), [api-testing-server/](../../examples/api-testing-server/)

## MCP Protocol Basics

### Standard JSON-RPC 2.0 Methods

#### Initialize Request (Required for handshake)
```yaml
request:
  jsonrpc: "2.0"
  id: "init-1"
  method: "initialize"  
  params:
    protocolVersion: "2025-06-18"
    capabilities: {"tools": {}}
    clientInfo: {"name": "MCP Conductor", "version": "1.0.0"}
```

#### Tools List Request  
```yaml
request:
  jsonrpc: "2.0"
  id: "list-1"
  method: "tools/list"
  params: {}
```

#### Tool Call Request
```yaml
request:
  jsonrpc: "2.0"
  id: "call-1"
  method: "tools/call"
  params:
    name: "tool_name"
    arguments:
      key: "value"
```

### Standard Response Structure
```yaml
expect:
  response:
    jsonrpc: "2.0"
    id: "matching-request-id"
    result:           # For successful responses
      # Response data
    # OR for errors:
    error:
      code: -32601    # Standard JSON-RPC error codes
      message: "Method not found"
  stderr: "toBeEmpty"  # Optional stderr validation
```

## Common Troubleshooting Patterns

### Error Handling Tests
```yaml
# Test tool with invalid arguments
- it: "should handle invalid arguments gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "nonexistent.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "error-1"
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:not found"

# Test with missing required parameters  
- it: "should reject missing required parameters"
  request:
    jsonrpc: "2.0"
    id: "missing-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments: {}  # Missing required 'path'
  expect:
    response:
      jsonrpc: "2.0"
      id: "missing-1"
      error:
        code: "match:type:number"
        message: "match:contains:required"
```

### Performance Testing Patterns
```yaml
# Test response time validation
- it: "should respond within reasonable time"
  request:
    jsonrpc: "2.0"
    id: "perf-1"  
    method: "tools/call"
    params:
      name: "large_operation"
      arguments: {"size": 1000}
  expect:
    response:
      jsonrpc: "2.0"
      id: "perf-1"
      result:
        duration: "match:lessThan:5000"  # Less than 5 seconds
        # Use --timing CLI flag to see actual execution times
```

## Debugging and Troubleshooting

### Quick Debugging Workflow
1. **Start with `--debug`**: See MCP communication flow
2. **Use `--verbose`**: View test hierarchy and details  
3. **Try `conductor query`**: Test individual tools interactively
4. **Check `--syntax-only`**: Isolate YAML syntax issues
5. **Use `--errors-only`**: Focus on failures

### Common Issues and Solutions

#### Server Won't Start
```bash
# Debug server startup issues
conductor "test.yml" --config "config.json" --debug

# Check stderr output for server errors
# Increase startupTimeout if server is slow
# Verify command/args in config are correct
```

#### Test Pattern Not Matching
```yaml
# Use --debug to see actual response structure
# Check YAML syntax (no duplicate keys!)
# Start with simple deep equality, then add patterns
# Verify field paths with match:extractField

# Example: Debug actual vs expected
- it: "debug actual response structure"
  expect:
    response:
      result: "match:type:object"  # Start simple
```

#### Regex Patterns Failing
```yaml
# YAML requires double escaping backslashes
text: "match:regex:\\d+"        # ✅ Correct  
text: "match:regex:\d+"         # ❌ Wrong

# Test regex patterns incrementally
email: "match:regex:[a-zA-Z]+"  # Start simple
email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"  # Full pattern
```

#### Array Pattern Issues
```yaml
# ❌ Duplicate YAML keys (overwrites previous)
result:
  tools: "match:arrayLength:1"
  tools: ["exact_tool"]  # OVERWRITES above!

# ✅ Separate into different tests
- it: "should have one tool"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"

- it: "should have specific tool"  
  expect:
    response:
      result:
        tools: [{"name": "expected_tool"}]

# ❌ Rigid arrayElements that break with schema changes
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      # If server adds new fields, this breaks!

# ✅ Flexible arrayElements with partial matching
result:
  tools:
    match:arrayElements:
      match:partial:  # 🔥 Only validate what you care about
        name: "match:type:string"
        description: "match:type:string"
        # Ignores any new fields the server might add
```

### Interactive Tool Testing
```bash
# List all available tools
conductor query --config "config.json"

# Test specific tool with arguments
conductor query read_file '{"path": "test.txt"}' --config "config.json"

# Debug with verbose output
conductor query read_file '{"path": "test.txt"}' --config "config.json" --verbose
```

### Performance Debugging
```bash
# See timing for each operation
conductor "tests/*.yml" --config "config.json" --timing

# Combined debugging for comprehensive analysis
conductor "tests/*.yml" --config "config.json" --debug --timing --verbose
```

## Quick Pattern Reference

### All Available Patterns (30+)
```yaml
# STRING PATTERNS
"match:contains:substring"
"match:startsWith:prefix"  
"match:endsWith:suffix"
"match:containsIgnoreCase:TEXT"
"match:equalsIgnoreCase:value"
"match:regex:pattern"

# TYPE PATTERNS  
"match:type:string|number|boolean|object|array"
"match:exists"
"match:length:5"
"match:count:3"

# NUMERIC PATTERNS
"match:greaterThan:10"
"match:greaterThanOrEqual:5"
"match:lessThan:100" 
"match:lessThanOrEqual:50"
"match:between:10:90"
"match:range:0:100"
"match:equals:42"
"match:notEquals:0"
"match:approximately:3.14:0.01"
"match:multipleOf:5"
"match:divisibleBy:3"
"match:decimalPlaces:2"

# ARRAY PATTERNS
"match:arrayLength:3"
"match:arrayContains:value"
"match:arrayContains:field:value"
match:arrayElements:
  field: "match:type:string"

# DATE PATTERNS
"match:dateValid"
"match:dateAfter:2023-01-01"
"match:dateBefore:2025-01-01"
"match:dateBetween:2023-01-01:2024-12-31"
"match:dateAge:1d"
"match:dateEquals:2023-06-15T14:30:00.000Z"
"match:dateFormat:iso|iso-date|iso-time|us-date|timestamp"

# ADVANCED PATTERNS
"match:crossField": "field1 > field2"
"match:not:pattern"  # Negate any pattern
match:extractField: "path.*.field"
match:partial:       # Check subset of fields
match:arrayElements: # Validate ALL array elements
  match:partial:     # 🔥 POWERFUL COMBO: Validate specific fields in all elements
    field: "pattern"
```

### Installation & Getting Started
```bash
npm install -g mcp-conductor
conductor init                    # Create sample config and tests
conductor "tests/*.yml" --config "config.json"
```

