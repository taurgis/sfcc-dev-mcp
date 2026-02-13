#!/usr/bin/env node

/**
 * llms.txt Generator for SFCC Development MCP Server (VitePress)
 *
 * Usage: node scripts/generate-llms.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://sfcc-mcp-dev.rhino-inquisitor.com';

const content = `# SFCC Development MCP Server

> A comprehensive Model Context Protocol (MCP) server that provides AI assistants with direct access to Salesforce B2C Commerce Cloud development tools, documentation, curated agent skills, and real-time debugging capabilities.

This server bridges the gap between AI assistants and SFCC development workflows, offering both documentation-only mode (no credentials required) and full mode (with live SFCC instance access). It provides a broad tool surface across documentation, log analysis, system objects, cartridge generation, and script debugging.

Key architectural principles:
- **Capability-gated**: Tools requiring SFCC credentials are only exposed when valid configuration is provided
- **Modular handlers**: Clean separation between tool routing and domain logic
- **Dependency injection**: Testable architecture with service abstractions
- **Performance optimized**: Efficient caching and range request optimization for log analysis

## Core Documentation

- [Getting Started](${baseUrl}/guide/): Introduction and modes
- [AI Interface Setup](${baseUrl}/guide/ai-interfaces/): Platform-specific setup for Copilot, Claude, and Cursor
- [Configuration Guide](${baseUrl}/guide/configuration/): dw.json, environment variables, and auto-discovery
- [Features Overview](${baseUrl}/features/): Complete feature breakdown
- [Tools Catalog](${baseUrl}/tools/): All tools organized by category with examples
- [Examples](${baseUrl}/examples/): Practical prompts and workflows
- [Script Debugger](${baseUrl}/script-debugger/): Sandbox evaluation via debugger API
- [Skills](${baseUrl}/skills/): Bundled skills and instruction packs
- [Security](${baseUrl}/security/): Credential and data handling guidance
- [Development Guide](${baseUrl}/development/): Architecture, testing, and contribution workflow
- [Troubleshooting](${baseUrl}/troubleshooting/): Common issues and fixes

## Tool Categories

- **SFCC Documentation Tools**: Class information, method search, and namespace exploration
- **SFRA Documentation Tools**: Enhanced Storefront Reference Architecture docs
- **ISML Documentation Tools**: ISML element reference and search
- **Agent Instruction Tools**: Sync AGENTS.md + bundled skills into a workspace
- **Log & Job Log Tools**: Log search, summaries, and job execution debugging
- **System Object Tools**: Attribute discovery and site preference management
- **Cartridge Generation Tools**: Cartridge and project scaffolding
- **Code Version Tools**: Listing and activation
- **Script Debugger Tools**: Execute JavaScript on sandbox instances

## Optional

- [GitHub Repository](https://github.com/taurgis/sfcc-dev-mcp)
- [NPM Package](https://www.npmjs.com/package/sfcc-dev-mcp)
- [CHANGELOG](https://github.com/taurgis/sfcc-dev-mcp/blob/main/CHANGELOG.md)
- [Contributing Guidelines](https://github.com/taurgis/sfcc-dev-mcp/blob/main/CONTRIBUTING.md)
`;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'llms.txt'), content);

console.log('llms.txt generated successfully.');
