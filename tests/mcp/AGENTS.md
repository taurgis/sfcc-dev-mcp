# MCP Conductor - AI Agent Guide

**Target Audience**: AI coding assistants, automated testing agents, and AI-powered development tools

## Overview

**MCP Conductor** is a comprehensive Node.js testing library for Model Context Protocol (MCP) servers. It provides both **declarative YAML-based testing** and **programmatic JavaScript/TypeScript testing** with 11+ verified pattern matching capabilities.

## 📁 Dedicated Agent Guides

This guide has been restructured into focused, dedicated guides for each testing approach:

### **[YAML Testing Guide](./yaml/AGENTS.md)**
- **Focus**: Declarative, human-readable test files
- **Best For**: Protocol compliance, basic tool testing, maintainable test suites
- **Audience**: Agents generating `.test.mcp.yml` files
- **Key Features**: 11+ pattern matching types, CLI debugging, no programming required

### **[Programmatic Testing Guide](./node/AGENTS.md)**  
- **Focus**: JavaScript/TypeScript API integration
- **Best For**: Complex validation, existing test suites, multi-step workflows
- **Audience**: Agents generating `.programmatic.test.js` files
- **Key Features**: Jest/Mocha integration, dynamic validation, performance testing

## Quick Decision Matrix

| Use Case | YAML Testing | Programmatic Testing |
|----------|--------------|---------------------|
| **Protocol compliance** | ✅ Excellent | ✅ Excellent |
| **Simple tool testing** | ✅ Perfect | ⚠️ Overkill |
| **Pattern matching** | ✅ 11+ built-in types | ⚠️ Manual assertions |
| **Complex validation** | ⚠️ Limited logic | ✅ Full JavaScript |
| **Multi-step workflows** | ❌ Not supported | ✅ Perfect |
| **Existing test suites** | ❌ Separate runner | ✅ Jest/Mocha/Node.js |
| **CI/CD integration** | ✅ JSON output | ✅ Standard test runners |
| **Maintenance** | ✅ Declarative | ⚠️ Code maintenance |

## 📚 Additional Resources

### Documentation
- **[Complete Documentation](https://conductor.rhino-inquisitor.com/)** - Full guide and reference
- **[Installation](https://conductor.rhino-inquisitor.com/installation.html)** | **[Quick Start](https://conductor.rhino-inquisitor.com/quick-start.html)**
- **[Pattern Matching](https://conductor.rhino-inquisitor.com/pattern-matching.html)** | **[Examples](https://conductor.rhino-inquisitor.com/examples.html)**

### MCP Architecture for AI Agents
```
AI Agent → MCP Client → MCP Server → Tools/Services
    ↓
MCP Conductor → Test Validation → Quality Assurance
```

**Common Tool Categories**: Data retrieval, content generation, external services, analysis tools, component libraries, knowledge bases

## Universal Setup

Both testing approaches require initial configuration:

### 1. Installation
```bash
# Install globally or locally
npm install -g mcp-conductor
# OR
npm install --save-dev mcp-conductor

# Initialize configuration
npx mcp-conductor init
```

### 2. Configuration File (`conductor.config.json`)
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

### 3. Test Execution
```bash
# YAML Testing
conductor "tests/**/*.test.mcp.yml" --config "conductor.config.json"

# Programmatic Testing  
node --test "tests/**/*.programmatic.test.js"
```

## When to Use Each Approach

### Choose YAML Testing When:
- Testing basic MCP protocol compliance
- Validating simple tool executions
- Creating maintainable test suites for non-developers
- Using built-in pattern matching is sufficient
- CI/CD needs declarative test definitions

### Choose Programmatic Testing When:
- Integration with existing JavaScript/TypeScript test suites
- Complex validation logic required
- Multi-step agent workflows need testing
- Dynamic test case generation needed
- Performance testing and monitoring required

## Integration Examples

### GitHub Copilot Integration
Add to `.github/copilot-instructions.md`:
```markdown
## MCP Testing Standards
1. Use MCP Conductor for all MCP server testing
2. Create both YAML (protocol) and programmatic (complex) tests
3. Reference dedicated guides:
   - YAML: ./AGENTS/yaml/AGENTS.md
   - Code: ./AGENTS/node/AGENTS.md
4. Follow 11+ verified pattern matching types
5. Ensure JSON-RPC 2.0 compliance
```

### NPM Scripts Integration
```json
{
  "scripts": {
    "test:mcp:yaml": "conductor 'tests/**/*.test.mcp.yml' --config './conductor.config.json'",
    "test:mcp:code": "node --test 'tests/**/*.programmatic.test.js'",
    "test:mcp:all": "npm run test:mcp:yaml && npm run test:mcp:code",
    "test:mcp:ci": "npm run test:mcp:yaml -- --json && npm run test:mcp:code"
  }
}
```

---

**For detailed implementation guidance, see the dedicated guides:**
- **[YAML Testing Guide](./yaml/AGENTS.md)** - Pattern matching, CLI options, real examples
- **[Programmatic Testing Guide](./node/AGENTS.md)** - API reference, frameworks, advanced scenarios
