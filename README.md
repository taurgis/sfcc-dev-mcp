# SFCC Development MCP Server

[![npm version](https://badge.fury.io/js/sfcc-dev-mcp.svg)](https://badge.fury.io/js/sfcc-dev-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An AI-powered Model Context Protocol (MCP) server that provides comprehensive access to Salesforce B2C Commerce Cloud development tools, documentation, and runtime diagnostics.

## ✨ Key Features

- **🔍 Complete SFCC Documentation Access** - Search and explore all SFCC API classes and methods
- **🏗️ SFRA Documentation** - Enhanced access to Storefront Reference Architecture documentation
- **🧱 ISML Template Reference** - Complete ISML element documentation with examples and usage guidance
- **📊 Log Analysis Tools** - Real-time error monitoring, debugging, and job log analysis for SFCC instances
- **⚙️ System Object Definitions** - Explore custom attributes and site preferences
- **🧪 Script Debugger** - Execute and inspect script-debugger endpoints in credentialed mode
- **🚀 Cartridge Generation** - Automated cartridge structure creation with workspace-bound path safety (writes stay inside workspace roots, or current working directory fallback when roots are unavailable; home-directory fallback is blocked)
- **🧩 Agent Skill Bootstrap** - Install or merge AGENTS.md and bundled skills into the current project or a temp directory for AI assistants
- **✅ Tool Argument Validation** - Runtime schema validation enforces required fields, type checks, enum constraints, integer/numeric bounds, and strict unknown-key checks for object schemas (top-level and nested) before handler execution
- **⏱️ MCP Progress + Cancellation** - Tool calls honor request cancellation signals and emit out-of-band `notifications/progress` updates when clients provide a `progressToken`

## 🚀 Quick Start

### Option 1: Documentation-Only Mode (No SFCC credentials needed)
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}
```

### Option 2: Full Mode (With SFCC credentials for log and job analysis)  
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
    }
  }
}
```

Create a `dw.json` file with your SFCC credentials. You can use either auth mode (or both):
- Basic auth: `username` + `password`
- OAuth: `client-id` + `client-secret`
```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password", 
  "client-id": "your-client-id",
  "client-secret": "your-client-secret"
}
```

At least one complete credential pair is required when `hostname` is set.
If credentials are provided, `hostname` is also required.

### Option 3: Auto-Discovery (Recommended for VS Code users)
Simply open a VS Code workspace that contains a `dw.json` file - the server will automatically discover and use it:
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}
```

## 🔧 Configuration Discovery Priority

The server discovers SFCC credentials in this order (highest priority first):

| Priority | Source | Description |
|----------|--------|-------------|
| **1** | `--dw-json` CLI parameter | Explicit path to dw.json file |
| **2** | Environment variables | `SFCC_HOSTNAME`, `SFCC_USERNAME`, `SFCC_PASSWORD`, `SFCC_CLIENT_ID`, `SFCC_CLIENT_SECRET` |
| **3** | MCP workspace roots | Automatically discovers dw.json in your VS Code workspace folder(s), and refreshes when the client sends `notifications/roots/list_changed` |

> **Note**: The server no longer searches the current working directory by default, as MCP servers often start with `cwd` set to the user's home directory. The MCP workspace roots mechanism provides reliable project context.

## 🎯 Operating Modes

| Mode | Tools Available | SFCC Credentials Required |
|------|----------------|---------------------------|
| **Documentation-Only** | 18 tools | ❌ No |
| **Full Mode** | 40 tools | ✅ Yes |

### Documentation-Only Mode
Perfect for learning and development, no SFCC instance required:
- Complete SFCC API documentation (5 tools)
- SFRA documentation (5 tools)
- ISML template documentation (5 tools)
- Cartridge generation (1 tool, writes constrained to workspace roots/cwd)
- Agent instruction bootstrap (2 tools) to copy/merge AGENTS.md and skills, or disable future prompts

### Full Mode  
Complete development experience with live SFCC instance access:
- All documentation-only features (18 tools)
- Real-time log analysis and job logs (13 tools)
- System object definitions (6 tools)
- Code version management (2 tools)
- Script debugger operations (1 tool)

## 🏗️ Architecture Overview

This server is built around a **capability-gated, modular handler architecture** that cleanly separates tool routing from domain logic:

### Core Layers
- **Tool Schemas** (`src/core/tool-schemas/`): Modular, category-based tool definitions (documentation, SFRA, ISML, logs, job logs, system objects, cartridge, code versions, agent instructions, script debugger). Re-exported via `tool-definitions.ts`.
- **Server Orchestration Modules** (`src/core/server-tool-catalog.ts`, `src/core/server-tool-call-lifecycle.ts`, `src/core/server-workspace-discovery.ts`): Keeps `server.ts` focused by extracting capability-aware tool catalog logic, `tools/call` lifecycle (progress/cancellation/preflight), and workspace roots reconfiguration flow.
- **Tool Argument Validator** (`src/core/tool-argument-validator.ts`): Enforces runtime argument shape at the MCP boundary for all tools (required fields, primitive/object/array types, enum checks, integer/numeric ranges, string patterns/length, and strict unknown-key checks for object schemas at top-level and nested levels) before tool dispatch.
- **OCAPI Query Coverage** (`src/core/tool-schemas/shared-schemas.ts`): Shared search schemas include `text_query`, `term_query`, `bool_query`, `filtered_query`, and `match_all_query` so MCP boundary validation aligns with supported OCAPI query patterns.
- **Handlers** (`src/core/handlers/`): Each category has a handler extending a common base for timing, structured logging, and error normalization, with config-driven wiring via `ConfiguredClientHandler` to reduce repetitive boilerplate (e.g. `log-handler`, `docs-handler`, `isml-handler`, `system-object-handler`).
- **Clients** (`src/clients/`): Encapsulate domain operations (OCAPI, SFRA docs, ISML docs, modular log analysis, script debugger, cartridge generation, agent-instruction sync). Handlers delegate to these so orchestration and computation remain separate.
- **Services** (`src/services/`): Dependency-injected abstractions for filesystem and path operations — improves testability and isolates side effects.
- **Modular Log System** (`src/clients/logs/`): Reader (range/tail optimization), discovery, processor (line → structured entry), analyzer (patterns & health), formatter (human output) for maintainable evolution.
- **Configuration Factory** (`src/config/configuration-factory.ts`): Determines capabilities (`canAccessLogs`, `canAccessOCAPI`) based on provided credentials and filters exposed tools accordingly (principle of least privilege).
- **Shared Credential Validation** (`src/config/credential-validation.ts`): Centralizes auth-pair completeness and hostname-format validation for both `dw.json` loading and runtime configuration creation.
- **Call-time Capability Guarding** (`src/core/server.ts`): Rejects execution of tools that are unavailable in the current mode, so hidden tools are not callable via direct `tools/call` requests.
- **Call Lifecycle Signals** (`src/core/server.ts`): `tools/call` handling supports cancellation via request abort signals and emits best-effort progress notifications when the caller provides `_meta.progressToken`.
- **Tool Error Sanitization** (`src/core/tool-error-response.ts`): Sanitizes upstream execution errors before returning MCP tool responses, reducing accidental leakage of backend payload details.
- **Runtime WebDAV Verification** (`src/core/server.ts`): For OAuth-only configurations (`client-id`/`client-secret` without `username`/`password`), log/job-log/script-debugger tool exposure is gated by a one-time WebDAV capability probe to avoid false-positive tool availability.
- **CLI Option Helpers** (`src/config/cli-options.ts`): Centralizes command-line parsing and environment credential detection for predictable startup behavior.
- **Shared Path Security Policy** (`src/config/path-security-policy.ts`): Reuses allow/block path rules across workspace-root discovery and secure `dw.json` loading.
- **Shared Abort Utility** (`src/utils/abort-utils.ts`): Centralized timeout and abort-signal composition used by HTTP and debugger clients for consistent cancellation semantics and timer cleanup.

### Why This Matters
- **Extensibility**: Adding a new tool usually means adding a schema + minimal handler logic (or a new handler if a new domain).
- **Security**: Tools that require credentials are never exposed when capability flags are false.
- **Testability**: Unit tests target clients & modules; integration/MCP tests validate handler routing and response structure.
- **Performance**: Tail log reads + lightweight caching (`cache.ts`, `log-cache.ts`) reduce unnecessary I/O.

### Adding a New Tool (High-Level)
1. Add schema to the appropriate file in `src/core/tool-schemas/` (or create new file for new category).
2. Export new schema from `src/core/tool-schemas/index.ts` if adding a new file.
3. Implement domain logic in a client/service (avoid bloating handlers).
4. Extend an existing handler or create a new one if it's a new category.
5. (Only for a new category) register the new handler inside `registerHandlers()` in `server.ts`.
6. Discover actual response shape with `npx aegis query` before writing tests.
7. Add Jest unit tests + YAML MCP tests (docs vs full mode if credentials required).
8. Update documentation (AGENTS.md + README counts if changed).

> For a deeper internal view, see the Development Guide in the docs site.

## 🤖 AI Interface Setup

Choose your preferred AI assistant:

| Interface | Best For | Setup Guide |
|-----------|----------|-------------|
| **Claude Desktop** | Multi-turn conversations, debugging | [📖 Setup Guide](https://sfcc-mcp-dev.rhino-inquisitor.com/guide/ai-interfaces/) |
| **GitHub Copilot** | VS Code integration, inline suggestions | [📖 Setup Guide](https://sfcc-mcp-dev.rhino-inquisitor.com/guide/ai-interfaces/) |
| **Cursor** | Modern AI-powered editor | [📖 Setup Guide](https://sfcc-mcp-dev.rhino-inquisitor.com/guide/ai-interfaces/) |

## 📦 Installation

### Using npx (Recommended)
> Tip: Add `-y` (or `--yes`) to suppress the interactive prompt npx shows before downloading a package. This prevents AI clients (Claude Desktop, Copilot, Cursor) from hanging waiting for confirmation.
```bash
# Test the server
npx -y sfcc-dev-mcp

# Use with your configuration
npx -y sfcc-dev-mcp --dw-json /path/to/your/dw.json
```

### Global Installation
```bash
npm install -g sfcc-dev-mcp
sfcc-dev-mcp --dw-json /path/to/your/dw.json
```

## 🐛 Debug Mode & Logging

### Enable Debug Logging
```bash
# Enable debug mode for detailed logging
npx -y sfcc-dev-mcp --debug

# Or with configuration file
npx -y sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug
```

`--debug` accepts `true/false`, `1/0`, or `yes/no`. Invalid values fail fast with a clear error message.

### Log File Locations

The server writes logs to your system's temporary directory:

- **macOS**: `/var/folders/{user-id}/T/sfcc-mcp-logs/`
- **Linux**: `/tmp/sfcc-mcp-logs/` 
- **Windows**: `%TEMP%\sfcc-mcp-logs\`

**Log Files Created:**
- `sfcc-mcp-info.log` - General application logs and startup messages
- `sfcc-mcp-debug.log` - Detailed debug information (only when `--debug` is enabled)
- `sfcc-mcp-error.log` - Error messages and stack traces
- `sfcc-mcp-warn.log` - Warning messages

### Finding Your Log Directory
```javascript
// The exact path varies by system - to find yours:
node -e "console.log(require('os').tmpdir() + '/sfcc-mcp-logs')"
```

## 🧪 Release Validation (Maintainers)

The publish workflow runs MCP tests against the just-published npm artifact (`npx sfcc-dev-mcp@<version>`) before publishing to the MCP Registry.

You can run the same validation locally:

```bash
# Ensure docs-site tool catalog stays in sync with runtime tool definitions
npm run validate:tools-sync

# Ensure docs-site skills catalog stays in sync with bundled skills
npm run validate:skills-sync

# Ensure MCP registry metadata stays in sync with package.json
npm run validate:server-json

# In a separate terminal, start the mock server first for full-mode MCP tests
npm run test:mock-server:start

# Uses latest published version by default
npm run test:mcp:published-npx

# Or pin a specific published version
bash ./scripts/test-published-npx.sh 1.0.21
```

In GitHub Actions, the publish workflow manages the mock server lifecycle automatically.

## 📖 Documentation

**📚 [Complete Documentation](https://sfcc-mcp-dev.rhino-inquisitor.com/)** - Comprehensive guides and references

Documentation source lives in `docs-site-v2/` (VitePress). The legacy React site remains in `docs-site/`.

Quick Links:
- **[Getting Started](https://sfcc-mcp-dev.rhino-inquisitor.com/guide/)** - Installation and first-run setup
- **[AI Interface Setup](https://sfcc-mcp-dev.rhino-inquisitor.com/guide/ai-interfaces/)** - Configure Claude Desktop, GitHub Copilot, or Cursor
- **[Configuration Guide](https://sfcc-mcp-dev.rhino-inquisitor.com/guide/configuration/)** - SFCC credentials and Data API setup
- **[Available Tools](https://sfcc-mcp-dev.rhino-inquisitor.com/tools/)** - Complete tool reference
- **[Examples](https://sfcc-mcp-dev.rhino-inquisitor.com/examples/)** - Real-world usage patterns
- **[Troubleshooting](https://sfcc-mcp-dev.rhino-inquisitor.com/troubleshooting/)** - Common issues and solutions

## 🛠️ Example AI Interactions

```
🧑‍💻 "Create a new SFCC controller for product search"
🤖 Generates complete controller with proper imports, route handling, and SFRA patterns

🧑‍💻 "What's wrong with my checkout flow? Check the logs"  
🤖 Analyzes recent error logs, identifies issues, and suggests fixes

🧑‍💻 "Show me how to implement OCAPI hooks for order validation"
🤖 Retrieves related SFCC classes and methods, then proposes a concrete hook implementation pattern
```

## 🔒 Security Notes

- **Local Development Focus**: Designed for individual developer use on local machines
- **Credential Protection**: dw.json files should never be committed to version control
- **Network Security**: All API calls use HTTPS with proper authentication
- **No Data Storage**: Server doesn't persist any SFCC data locally

## 🔮 Future Plans

We're continuously improving the SFCC Development MCP Server with exciting new features planned:

### 🎯 Upcoming Enhancements

- **🧠 Smarter Log Fetching** - Enhanced log analysis with intelligent filtering, pattern recognition, and contextual error correlation
- **🚀 Deployment Tools** - Integration with SFCC deployment processes and code version management

### 🤝 We Welcome Your Contributions!

Have ideas for new features or improvements? We'd love to hear from you! 

- **💡 Feature Requests**: Open an issue to discuss your ideas
- **🐛 Bug Reports**: Help us improve by reporting any issues you encounter  
- **🔧 Pull Requests**: Contribute code, documentation, or examples
- **📚 Documentation**: Help expand our guides and best practices

Check out our [Contributing Guide](CONTRIBUTING.md) to get started, or browse our [open issues](https://github.com/taurgis/sfcc-dev-mcp/issues) to see where you can help.

**Your expertise and feedback make this tool better for the entire SFCC community!**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚀 Ready to supercharge your SFCC development with AI?**

**[📖 Get Started with the Full Documentation](https://sfcc-mcp-dev.rhino-inquisitor.com/)**
