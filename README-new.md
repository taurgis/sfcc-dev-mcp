# SFCC Development MCP Server

[![npm version](https://badge.fury.io/js/sfcc-dev-mcp.svg)](https://badge.fury.io/js/sfcc-dev-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An AI-powered Model Context Protocol (MCP) server that provides comprehensive access to Salesforce B2C Commerce Cloud development tools, documentation, and best practices.

## ✨ Key Features

- **🔍 Complete SFCC Documentation Access** - Search and explore all SFCC API classes and methods
- **📚 Best Practices Guides** - Curated development guidelines for cartridges, hooks, controllers, and more  
- **🏗️ SFRA Documentation** - Enhanced access to Storefront Reference Architecture documentation
- **📊 Log Analysis Tools** - Real-time error monitoring and debugging for SFCC instances
- **⚙️ System Object Definitions** - Explore custom attributes and site preferences
- **🚀 Cartridge Generation** - Automated cartridge structure creation

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

### Option 2: Full Mode (With SFCC credentials for log analysis)  
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

Create a `dw.json` file with your SFCC credentials:
```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password", 
  "client-id": "your-client-id",
  "client-secret": "your-client-secret"
}
```

## 🎯 Operating Modes

| Mode | Tools Available | SFCC Credentials Required |
|------|----------------|---------------------------|
| **Documentation-Only** | 12 tools | ❌ No |
| **Full Mode** | 27 tools | ✅ Yes |

### Documentation-Only Mode
Perfect for learning and development - no SFCC instance required:
- Complete SFCC API documentation (5 tools)
- Best practices guides (4 tools) 
- SFRA documentation (5 tools)
- Cartridge generation (1 tool)

### Full Mode  
Complete development experience with live SFCC instance access:
- All documentation-only features (12 tools)
- Real-time log analysis (7 tools)
- System object definitions (6 tools)
- Site preference management (2 tools)

## 🤖 AI Interface Setup

Choose your preferred AI assistant:

| Interface | Best For | Setup Guide |
|-----------|----------|-------------|
| **Claude Desktop** | Multi-turn conversations, debugging | [📖 Setup Guide](https://taurgis.github.io/sfcc-dev-mcp/ai-interfaces#claude-desktop) |
| **GitHub Copilot** | VS Code integration, inline suggestions | [📖 Setup Guide](https://taurgis.github.io/sfcc-dev-mcp/ai-interfaces#github-copilot) |
| **Cursor** | Modern AI-powered editor | [📖 Setup Guide](https://taurgis.github.io/sfcc-dev-mcp/ai-interfaces#cursor) |

## 📦 Installation

### Using npx (Recommended)
```bash
# Test the server
npx sfcc-dev-mcp

# Use with your configuration
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json
```

### Global Installation
```bash
npm install -g sfcc-dev-mcp
sfcc-dev-mcp --dw-json /path/to/your/dw.json
```

## 📖 Documentation

**📚 [Complete Documentation](https://taurgis.github.io/sfcc-dev-mcp/)** - Comprehensive guides and references

Quick Links:
- **[Installation Guide](https://taurgis.github.io/sfcc-dev-mcp/installation)** - Detailed installation options
- **[AI Interface Setup](https://taurgis.github.io/sfcc-dev-mcp/ai-interfaces)** - Configure Claude Desktop, GitHub Copilot, or Cursor
- **[Configuration Guide](https://taurgis.github.io/sfcc-dev-mcp/configuration)** - SFCC credentials and Data API setup
- **[Available Tools](https://taurgis.github.io/sfcc-dev-mcp/tools)** - Complete tool reference
- **[Examples](https://taurgis.github.io/sfcc-dev-mcp/examples)** - Real-world usage patterns
- **[Troubleshooting](https://taurgis.github.io/sfcc-dev-mcp/troubleshooting)** - Common issues and solutions

## 🛠️ Example AI Interactions

```
🧑‍💻 "Create a new SFCC controller for product search"
🤖 Generates complete controller with proper imports, route handling, and SFRA patterns

🧑‍💻 "What's wrong with my checkout flow? Check the logs"  
🤖 Analyzes recent error logs, identifies issues, and suggests fixes

🧑‍💻 "Show me how to implement OCAPI hooks for order validation"
🤖 Provides best practices guide with complete hook implementation examples
```

## 🔒 Security Notes

- **Local Development Focus**: Designed for individual developer use on local machines
- **Credential Protection**: dw.json files should never be committed to version control
- **Network Security**: All API calls use HTTPS with proper authentication
- **No Data Storage**: Server doesn't persist any SFCC data locally

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚀 Ready to supercharge your SFCC development with AI?**

**[📖 Get Started with the Full Documentation](https://taurgis.github.io/sfcc-dev-mcp/)**
