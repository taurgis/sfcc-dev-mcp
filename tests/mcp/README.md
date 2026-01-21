# MCP Testing Documentation

This document describes the MCP (Model Context Protocol) tests for the SFCC Development MCP Server.

## Overview

The project includes comprehensive MCP tests using both **YAML** and **Node.js** approaches with the [mcp-aegis](https://aegis.rhino-inquisitor.com/) testing library. The tests verify both **documentation-only mode** and **full mode with credentials**.

> Note: The server is capability-gated. In real usage there is also an intermediate “WebDAV-only” surface (30 tools) when `hostname` + `username/password` are present (logs + job logs), but `client-id/client-secret` are not (so OCAPI Data API tools are not exposed). The test configs in this folder currently cover docs-only (17) and full (38).

## Test Structure

```
tests/mcp/
├── AGENTS.md                           # AI agent guide for MCP testing
├── yaml/
│   ├── AGENTS.md                       # YAML-specific agent guide
│   ├── docs-only.test.mcp.yml         # Documentation-only mode YAML tests
│   └── full-mode.test.mcp.yml         # Full mode YAML tests
├── node/
│   ├── AGENTS.md                       # Node.js-specific agent guide  
│   ├── docs-only.programmatic.test.js # Documentation-only mode Node.js tests
│   └── full-mode.programmatic.test.js # Full mode Node.js tests
└── test-fixtures/
    └── dw.json                         # Test SFCC credentials configuration
```

## Configuration Files

### Documentation-Only Mode
- **File**: `aegis.config.docs-only.json`
- **Command**: `node dist/index.js` (no credentials)
- **Tools**: 17 tools (documentation, SFRA, ISML, cartridge generation, agent instruction bootstrap)

### Full Mode with Credentials  
- **File**: `aegis.config.with-dw.json`
- **Command**: `node dist/index.js --dw-json ./tests/mcp/test-fixtures/dw.json`
- **Tools**: 38 tools (includes log + job log analysis, system objects, code versions)

## Available Test Commands

### YAML Testing
```bash
# Documentation-only mode
npm run test:mcp:yaml

# Full mode with credentials (requires valid SFCC instance)
npm run test:mcp:yaml:full

# Manual execution with specific config
aegis 'tests/mcp/yaml/*.test.mcp.yml' --config './aegis.config.docs-only.json'
```

### Node.js Programmatic Testing
```bash
# All programmatic tests
npm run test:mcp:node

# Manual execution
node --test 'tests/mcp/node/*.programmatic.test.js'
```

### Combined Testing
```bash
# All MCP tests
npm run test:mcp:all

# All project tests (Jest + MCP)
npm run test:all

# CI-friendly format with JSON output
npm run test:mcp:ci
```

## Test Categories

### 1. Protocol Compliance Tests
- **Tools list validation**: Ensures tools are properly registered
- **JSON-RPC 2.0 compliance**: Validates request/response format
- **Error handling**: Tests invalid tool calls and missing parameters

### 2. Documentation-Only Mode Tests
- **SFCC Documentation Tools** (5 tools): Class info, search, method discovery
- **SFRA Documentation Tools** (5 tools): Documents, search, categories
- **ISML Documentation Tools** (5 tools): Element docs, category browsing, search
- **Agent Instruction Tools** (1 tool): Sync AGENTS.md + bundled skills into a workspace
- **Cartridge Generation Tools** (1 tool): Structure generation
- **Tool Availability**: Verifies log/OCAPI tools are NOT available

### 3. Full Mode Tests
- **All Documentation Tools**: Same as documentation-only mode
- **Log & Job Log Tools** (13 tools): Runtime log tails + search, plus job log discovery/entries/search/execution summaries
- **System Object Tools** (6 tools): System objects, attributes, site preferences
- **Code Version Tools** (2 tools): List and activate code versions
- **Authentication Testing**: Graceful handling of connection failures

### 4. Performance and Reliability Tests
- **Response Time Validation**: Ensures reasonable performance
- **Concurrent Request Handling**: Tests multiple simultaneous requests
- **Error Recovery**: Validates graceful failure modes
- **Schema Consistency**: Ensures all tools follow MCP standards

## Test Patterns Used

### YAML Pattern Matching
- **Type validation**: `"match:type:array"`, `"match:type:string"`
- **Content matching**: `"match:contains:expected_text"`
- **Array operations**: `"match:arrayContains:item"`, `"match:arrayLength:15"`
- **Field extraction**: `"match:extractField: "tools.*.name"`
- **Regex patterns**: `"match:regex:[\\s\\S]*pattern[\\s\\S]*"` (multiline safe)
- **Negation**: `"match:not:arrayContains:unwanted_item"`

### Node.js Assertions
- **Protocol validation**: JSON-RPC 2.0 compliance checking
- **Tool schema validation**: Input/output schema verification  
- **Dynamic testing**: Programmatic test generation and validation
- **Error boundary testing**: Exception handling and meaningful error messages

## Running Tests

### Prerequisites
```bash
# Ensure project is built
npm run build

# Install dependencies (already included)
npm install
```

### Documentation-Only Testing (No Credentials Required)
```bash
# YAML tests
npm run test:mcp:yaml

# Programmatic tests  
npm run test:mcp:node

# Both approaches
npm run test:mcp:all
```

### Full Mode Testing (Requires SFCC Instance)
To test full functionality:

1. **Update test credentials** in `tests/mcp/test-fixtures/dw.json`:
   ```json
   {
     "version": "1.0.0",
     "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
     "username": "your-username",
     "password": "your-password",
     "client-id": "your-client-id", 
     "client-secret": "your-client-secret",
     "code-version": "your-code-version",
     "cartridgesPath": "./cartridges"
   }
   ```

2. **Run full mode tests**:
   ```bash
   npm run test:mcp:yaml:full
   ```

**Note**: Full mode tests expect connection failures with test credentials and verify graceful error handling.

## Test Coverage

### Tools Tested in Documentation-Only Mode (17 tools)
1. `get_sfcc_class_info` - SFCC class information
2. `search_sfcc_classes` - SFCC class search
3. `search_sfcc_methods` - SFCC method search  
4. `list_sfcc_classes` - Complete SFCC class list
5. `get_sfcc_class_documentation` - Raw SFCC class documentation
6. `sync_agent_instructions` - Agent instruction bootstrap (AGENTS.md + bundled skills)
7. `get_available_sfra_documents` - SFRA documents list
8. `get_sfra_document` - Specific SFRA document
9. `search_sfra_documentation` - SFRA documentation search
10. `get_sfra_documents_by_category` - SFRA documents by category
11. `get_sfra_categories` - SFRA document categories
12. `list_isml_elements` - ISML element listing
13. `get_isml_element` - ISML element documentation
14. `search_isml_elements` - ISML element search
15. `get_isml_elements_by_category` - ISML elements by category
16. `get_isml_categories` - ISML categories
17. `generate_cartridge_structure` - Cartridge generation

### Additional Tools in Full Mode (+21 tools = 38 total)

**Log Analysis Tools (8)**:
- `get_latest_error`, `get_latest_warn`, `get_latest_info`, `get_latest_debug`
- `summarize_logs`, `search_logs`, `list_log_files`, `get_log_file_contents`

**Job Log Tools (5)**:
- `get_latest_job_log_files`, `search_job_logs_by_name`, `get_job_log_entries`
- `search_job_logs`, `get_job_execution_summary`

**System Object Tools (6)**:  
- `get_system_object_definitions`, `get_system_object_definition`
- `search_system_object_attribute_definitions`, `search_site_preferences`
- `search_system_object_attribute_groups`, `search_custom_object_attribute_definitions`

**Code Version Tools (2)**:
- `get_code_versions`, `activate_code_version`

## Debugging Tests

### Enable Verbose Output
```bash
# YAML tests with debugging
aegis 'tests/mcp/yaml/*.test.mcp.yml' --config './aegis.config.docs-only.json' --verbose --debug

# Check server logs
npm run dev -- --debug true
```

### Common Issues
- **Build Required**: Always run `npm run build` before testing
- **Tool Count Mismatches**: Verify tool counts with `npx aegis query`  
- **Connection Failures**: Expected in full mode with test credentials
- **Path Issues**: Use absolute paths in aegis config files

## Contributing

When adding new tools or modifying existing ones:

1. **Update test files** to include new tools
2. **Verify tool counts** using `npx aegis query`
3. **Test both modes** to ensure proper tool availability
4. **Update documentation** with new tool descriptions
5. **Run full test suite** before committing

## Resources

- **[MCP Aegis Documentation](https://aegis.rhino-inquisitor.com/)**: Complete testing framework guide
- **[YAML Testing Guide](./yaml/AGENTS.md)**: Declarative testing patterns
- **[Node.js Testing Guide](./node/AGENTS.md)**: Programmatic testing patterns
- **[MCP Protocol Specification](https://modelcontextprotocol.io/)**: Protocol standards
