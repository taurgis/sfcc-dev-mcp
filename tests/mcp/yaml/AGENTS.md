# MCP Aegis - YAML Testing Guide for AI Agents

**Target**: AI assistants generating declarative YAML test files for Model Context Protocol servers.

**Core Purpose**: Test MCP servers with human-readable YAML files using 35+ advanced pattern matching capabilities including string patterns, numeric comparisons, date validation, array operations, field extraction, cross-field validation, and pattern negation.

## 🆕 New Features: Pipe-Separated Parameters & Enhanced Testing

MCP Aegis now supports **CLI-friendly pipe-separated parameter format** alongside traditional JSON:

```bash
# 🆕 Pipe format (CLI-friendly): key:value|other:123
npx aegis query calculator 'operation:add|a:5|b:3' --config "config.json"

# Traditional JSON (still supported): {"key":"value","other":123}
npx aegis query calculator '{"operation": "add", "a": 5, "b": 3}' --config "config.json"
```

**Benefits**: ✅ No shell escaping ✅ Readable syntax ✅ Type inference ✅ Nested objects via dot notation ✅ Backward compatible

## 🥇 GOLDEN RULE: Always Discover Response Formats First

**CRITICAL**: Before writing ANY YAML test, you MUST use `aegis query` to discover actual response formats for both success and failure scenarios. Never assume response structure.

### Test Development Workflow (Discovery-First)

**Step 1: Discovery Commands (Mandatory)**
```bash
# Test successful execution
npx aegis query [tool_name] '[valid_params]' --config "config.json"

# Test failure scenarios  
npx aegis query [tool_name] '[invalid_params]' --config "config.json"
npx aegis query [tool_name] '' --config "config.json"  # Empty/missing params
```

**Step 2: Document Findings & Write Tests**
```yaml
# Document discovery results as comments
# Discovery: npx aegis query search_sfcc_classes 'query:catalog'
# Success: ["dw.catalog.Product", "dw.catalog.Catalog"] (simple array)
# Empty: [] (empty array)
# Error: {"content": [{"type": "text", "text": "Error: ..."}], "isError": true}

- it: "should return class array"
  expect:
    response:
      result:
        text: "match:regex:\\[[\\s\\S]*\\]"     # Based on actual format
        text: "match:contains:dw.catalog"      # Contains expected content
```

**Step 3: Common Discovery Patterns**
```bash
# Examples with expected patterns:
npx aegis query list_tools --config "config.json"
# → ["tool1", "tool2"] → YAML: text: "match:regex:\\[[\\s\\S]*\\]"

npx aegis query search_nothing 'query:zzznothingfound' --config "config.json"  
# → [] → YAML: text: "match:regex:^\\[\\s*\\]$"

npx aegis query invalid_tool 'bad:params' --config "config.json"
# → {"content": [...], "isError": true} → YAML: text: "match:contains:Error"
```

## Configuration & Basic Usage

### Required Configuration (`*.config.json`)
```json
{
  "name": "My MCP Server",                    // Human-readable name for reports
  "command": "node",                          // Executable (node, python, ./binary)
  "args": ["./server.js"],                    // Arguments array
  "cwd": "./optional/directory",              // Working directory (optional)
  "env": {"CUSTOM_VAR": "value"},            // Environment variables (optional)
  "startupTimeout": 5000,                     // Max startup wait (ms, default: 10000)
  "readyPattern": "Server ready"              // Stderr regex for ready state (optional)
}
```

### Common Configurations
```json
// Node.js Server
{"name": "Node.js MCP", "command": "node", "args": ["./dist/index.js"], "startupTimeout": 5000}

// Python Server  
{"name": "Python MCP", "command": "python", "args": ["-m", "my_mcp_server"], "env": {"PYTHONPATH": "./src"}}

// Development Server
{"name": "Dev Server", "command": "npm", "args": ["run", "dev"], "startupTimeout": 15000}
```
### Basic Test Structure (`*.test.mcp.yml`)
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

### Execute Tests
```bash
# 🥇 GOLDEN RULE: ALWAYS discover response formats first!
# Before writing any test, run these discovery commands:
npx aegis query [tool_name] '[success_params]' --config "config.json"
npx aegis query [tool_name] '[failure_params]' --config "config.json"

# Then run your tests based on discovered formats
npx aegis "tests/**/*.test.mcp.yml" --config "config.json"
npx aegis "tests/*.yml" --config "config.json" --verbose --filter "tools"
```

## Parameter Formats: Pipe vs JSON

### Pipe Format (Recommended for CLI)
```bash
# Simple: No parameters
npx aegis query get_code_versions --config "config.json"

# Simple: key:value|other:123
npx aegis query read_file 'path:test.txt' --config "config.json"

# Nested via dot notation: config.host:localhost|config.port:8080
npx aegis query api_client 'config.host:localhost|config.port:8080|timeout:30' --config "config.json"

# Method syntax: name:tool|arguments.key:value
npx aegis query --method tools/call --params 'name:read_file|arguments.path:test.txt' --config "config.json"
```

### JSON Format (Complex Structures)
```bash
npx aegis query complex_tool '{"config": {"host": "localhost"}, "data": [1,2,3]}' --config "config.json"
```

**Note**: For tools with no parameters, omit arguments entirely rather than using `'{}'` - use `npx aegis query tool_name --config "config.json"` instead of `npx aegis query tool_name '{}' --config "config.json"`.

## Complete Pattern Matching Reference (35+)

### Core Patterns
```yaml
# 1. DEEP EQUALITY (default) - Exact match
result: {tools: [{name: "read_file", description: "Reads a file"}]}

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
  
  # String length validation
  title: "match:stringLength:10"                        # Exactly 10 characters
  description: "match:stringLengthGreaterThan:5"        # More than 5 chars
  summary: "match:stringLengthLessThan:100"             # Less than 100 chars
  content: "match:stringLengthBetween:10:200"           # Between 10-200 chars
  error: "match:stringEmpty"                            # Must be empty
  text: "match:stringNotEmpty"                          # Must not be empty

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
  exact: "match:equals:42"
  not_equal: "match:notEquals:0"
  approximate: "match:approximately:3.14159:0.001"  # tolerance
  decimal: "match:decimalPlaces:2"  # exactly 2 decimal places
  multiple: "match:multipleOf:5"    # divisible by 5

# 7. DATE/TIMESTAMP PATTERNS
result:
  createdAt: "match:dateValid"
  publishDate: "match:dateAfter:2023-01-01"
  expireDate: "match:dateBefore:2025-01-01"
  eventDate: "match:dateBetween:2023-01-01:2024-12-31"
  lastUpdate: "match:dateAge:1d"  # within last day

# 8. CROSS-FIELD VALIDATION
result:
  "match:crossField": "price > minPrice"  # Field comparison
  "match:crossField": "endDate >= startDate"

# 9. PATTERN NEGATION (prefix with "not:")
result:
  tools: "match:not:arrayLength:0"  # NOT empty
  text: "match:not:contains:error"  # NOT containing error

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

# 12. ADVANCED PATTERNS
result:
  email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  name: "match:equalsIgnoreCase:Hello World"
  text: "match:containsIgnoreCase:ERROR"
  value: "match:range:0:100"        # Between 0-100 inclusive
  score: "match:between:60:90"      # Between 60-90 exclusive
  match:extractField: "tools.*.inputSchema.properties.*.type"
  value: ["string", "number", "object"]
```

## YAML Syntax Rules & Real-World Examples

### ❌ Common Errors to Avoid
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

### ✅ Correct Best Practices
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

# CORRECT - Flexible arrayElements with partial matching
result:
  tools:
    match:arrayElements:
      match:partial:  # 🔥 Only validate what matters, ignore extra fields
        name: "match:regex:^[a-z][a-z0-9_]*$"  
        description: "match:regex:.{10,}"
```

### Real-World Test Examples

#### Tool Discovery Test
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
            match:partial:  # Flexible - recommended approach
              name: "match:regex:^[a-z][a-z0-9_]*$"  # snake_case
              description: "match:regex:.{10,}"      # min 10 chars
```

#### Tool Execution Test
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

#### Error Handling Test
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

#### Performance Testing with SLA Validation
```yaml
- it: "should meet performance SLA"
  request:
    jsonrpc: "2.0"
    id: "perf-1"
    method: "tools/call"
    params:
      name: "search_tools"
      arguments:
        category: "documentation"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            match:partial:
              name: "match:regex:^[a-z][a-z0-9_]*$"
              description: "match:regex:.{10,}"
        count: "match:type:number"
    performance:
      maxResponseTime: "1500ms"  # SLA requirement
    stderr: "toBeEmpty"
```

## CLI Commands & Interactive Testing

### Test Execution
```bash
# Basic testing
npx aegis "tests/**/*.test.mcp.yml" --config "config.json"

# Debug modes & filtering
npx aegis "tests/*.yml" --config "config.json" --verbose --debug --timing
npx aegis "tests/*.yml" --config "config.json" --errors-only --filter "tools"
npx aegis "tests/*.yml" --config "config.json" --filter "should validate" --json
```

### Interactive Tool Testing (Dual Format Support)
```bash
# List all tools
npx aegis query --config "config.json"

# Pipe format (recommended) - ALWAYS test success AND failure
npx aegis query read_file 'path:test.txt' --config "config.json"        # Success case
npx aegis query read_file 'path:nonexistent.txt' --config "config.json" # Failure case

# JSON format for complex structures
npx aegis query complex_tool '{"config": {"host": "localhost"}, "data": [1,2,3]}' --config "config.json"

# Discovery examples for edge cases
npx aegis query search_tool 'query:' --config "config.json"           # Empty input
npx aegis query search_tool 'query:zzznothingfound' --config "config.json" # No results
```

### Performance Testing Guidelines
| Operation Type | Recommended Timeout | Use Case |
|----------------|-------------------|----------|
| Tool Listing | `200-500ms` | Metadata operations |
| Simple File Ops | `1000ms` | Basic I/O |
| Complex Operations | `2000ms` | Search, computation |
| Error Responses | `800ms` | Should be faster than success |
| Heavy Operations | `5000ms` | Database, large files |

**Always use `--timing` flag** to see actual response times and adjust expectations.

## Pattern Selection Guide & Advanced Combinations

### When to Use Each Pattern
- **Deep Equality**: Exact value matching (default)
- **Type Validation**: Verify data types (`match:type:`)  
- **String Patterns**: Text validation (`contains`, `startsWith`, `endsWith`, `regex`, `stringLength`)
- **Array Patterns**: Array validation (`arrayLength`, `arrayContains`, `arrayElements`)
- **Field Extraction**: Extract nested values (`match:extractField`)
- **Numeric**: Math comparisons (`greaterThan`, `approximately`, `decimalPlaces`)
- **Date/Time**: Date validation (`dateValid`, `dateAfter`, `dateAge`)
- **Cross-Field**: Compare fields (`match:crossField`)
- **Negation**: Exclude patterns (`match:not:*`)
- **Partial**: Subset validation (`match:partial`)
- **🔥 Combined arrayElements + partial**: Validate specific fields across ALL array elements while ignoring others - extremely powerful for flexible schema validation!

### Multi-Step Validation Pattern (Recommended)
```yaml
# Test 1: Basic structure
- it: "should return array of tools"
  expect:
    response:
      result:
        tools: "match:type:array"

# Test 2: Array length  
- it: "should have expected number of tools"
  expect:
    response:
      result:
        tools: "match:arrayLength:3"

# Test 3: Extract and validate specific fields
- it: "should have correct tool names"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: ["read_file", "write_file", "list_files"]
```

### Comprehensive Tool Validation (Best Practice)
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
```

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
    clientInfo: {"name": "MCP Aegis", "version": "1.0.0"}
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

## MCP Protocol Basics & Troubleshooting

### Standard JSON-RPC 2.0 Methods
```yaml
# Initialize Request (Required for handshake)
request:
  jsonrpc: "2.0"
  id: "init-1"
  method: "initialize"  
  params:
    protocolVersion: "2025-06-18"
    capabilities: {"tools": {}}
    clientInfo: {"name": "MCP Aegis", "version": "1.0.0"}

# Tools List Request  
request:
  jsonrpc: "2.0"
  id: "list-1"
  method: "tools/list"
  params: {}

# Tool Call Request
request:
  jsonrpc: "2.0"
  id: "call-1"
  method: "tools/call"
  params:
    name: "tool_name"
    arguments:
      key: "value"

# Standard Response Structure
expect:
  response:
    jsonrpc: "2.0"
    id: "matching-request-id"
    result: {}           # For successful responses
    # OR for errors:
    error:
      code: -32601       # Standard JSON-RPC error codes
      message: "Method not found"
  stderr: "toBeEmpty"    # Optional stderr validation
```

## Quick Debugging Workflow

### 🥇 Discovery-First Development (Essential)

**Before ANY test writing, run discovery commands:**
```bash
# Success case
npx aegis query [tool_name] '[valid_params]' --config "config.json"
# Failure case  
npx aegis query [tool_name] '[invalid_params]' --config "config.json"
```

### Common Issues & Solutions

#### Server Won't Start
```bash
npx aegis "test.yml" --config "config.json" --debug  # Check startup issues
# Increase startupTimeout if server is slow
# Verify command/args in config are correct
```

#### Pattern Not Matching
```yaml
# ❌ WRONG - Assuming structure without discovery
- it: "should return tools object"
  expect:
    response:
      result:
        tools: "match:arrayLength:3"      # Assumes 'tools' field exists
        count: "match:type:number"        # Assumes 'count' field exists

# ✅ CORRECT - Based on actual npx aegis query discovery
# First run: npx aegis query list_tools --config "config.json"
# Result: ["tool1", "tool2", "tool3"]  # Simple array, no wrapper object!
- it: "should return tools array"
  expect:
    response:
      result:
        text: "match:regex:\\[[\\s\\S]*\\]"        # Match JSON array format
        text: "match:contains:tool1"               # Check content exists
```

#### Regex Patterns Failing
```yaml
# YAML requires double escaping backslashes
text: "match:regex:\\d+"        # ✅ Correct  
text: "match:regex:\d+"         # ❌ Wrong
```

#### Array Pattern Issues
```yaml
# ❌ Duplicate YAML keys (overwrites previous)
result:
  tools: "match:arrayLength:1"
  tools: ["exact_tool"]  # OVERWRITES above!

# ✅ Use flexible arrayElements with partial matching instead
result:
  tools:
    match:arrayElements:
      match:partial:  # Only validate what you care about
        name: "match:type:string"
        description: "match:type:string"
```

### 2. Test Filtering for Focus Development
```bash
# Filter by suite/test description (case-insensitive)
npx aegis "tests/**/*.yml" --config "config.json" --filter "Tools validation"
npx aegis "tests/**/*.yml" --config "config.json" --filter "should handle errors"

# Use regex patterns for advanced filtering  
npx aegis "tests/**/*.yml" --config "config.json" --filter "/should (read|write|validate)/"

# Combine with debugging options
npx aegis "tests/**/*.yml" --config "config.json" --filter "tools" --errors-only --timing
```

### 3. Pipe Format Quick Reference
```bash
# Basic syntax: key:value|other:123
'path:test.txt|encoding:utf8'

# Nested objects: config.host:localhost|config.port:8080
'database.host:localhost|database.port:5432|cache.enabled:true'

# Auto data types: text:hello|count:42|enabled:true|data:null
'operation:add|a:5|b:3|precise:true'

# JSON values within pipe: simple:value|complex:{"nested":"object"}
'metadata:{"version":"1.0"}|tags:["test","demo"]|count:5'
```

### 3. Pipe Format Quick Reference
```bash
# Basic: key:value|other:123
'path:test.txt|encoding:utf8'

# Discovery examples:
'query:catalog|limit:10'        # Success case
'query:zzznothingfound'         # No results
'query:'                        # Validation error
'fileName:nonexistent.txt'      # File not found
```

### 4. Performance Testing Guidelines
- **Tool Listing**: 200-500ms (metadata - should be fast)
- **Simple File Ops**: 1000ms (basic I/O operations)  
- **Complex Operations**: 2000ms (search, computation, API calls)
- **Error Responses**: 800ms (often faster than successful operations)
- **Heavy Operations**: 5000ms (database queries, large file processing)

Use `--timing` flag to see actual response times and adjust expectations based on your environment.

## Complete Pattern Reference (35+ Patterns)

```yaml
# STRING PATTERNS
"match:contains:substring"
"match:startsWith:prefix"  
"match:endsWith:suffix"
"match:containsIgnoreCase:TEXT"
"match:equalsIgnoreCase:value"
"match:regex:pattern"
"match:stringLength:10"
"match:stringLengthGreaterThan:5"
"match:stringLengthLessThan:100"
"match:stringLengthBetween:10:200"
"match:stringEmpty|stringNotEmpty"

# TYPE & STRUCTURE
"match:type:string|number|boolean|object|array"
"match:exists"
"match:length:5"

# NUMERIC PATTERNS
"match:greaterThan:10"
"match:lessThanOrEqual:50"
"match:between:10:90"
"match:equals:42"
"match:notEquals:0"
"match:approximately:3.14:0.01"
"match:multipleOf:5"
"match:decimalPlaces:2"

# ARRAY PATTERNS
"match:arrayLength:3"
"match:arrayContains:value"
match:arrayElements:
  field: "match:type:string"

# DATE PATTERNS
"match:dateValid"
"match:dateAfter:2023-01-01"
"match:dateBetween:2023-01-01:2024-12-31"
"match:dateAge:1d"

# ADVANCED PATTERNS
"match:crossField": "field1 > field2"
"match:not:pattern"  # Negate any pattern
match:extractField: "path.*.field"
match:partial:       # Check subset of fields
match:arrayElements: # Validate ALL array elements
  match:partial:     # 🔥 POWERFUL COMBO
    field: "pattern"
```

### Installation & Getting Started
```bash
npm install -g mcp-aegis
npx aegis init                    # Create sample config and tests
npx aegis "tests/*.yml" --config "config.json"
```
