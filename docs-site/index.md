---
layout: page
title: SFCC Development MCP Server
---

An AI-powered Model Context Protocol (MCP) server that provides comprehensive access to Salesforce B2C Commerce Cloud development tools, documentation, and best practices.

## 🚀 Quick Start

<div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 16px; margin: 16px 0;">
  <h4 style="color: #dc2626; margin-top: 0; margin-bottom: 8px;">⚠️ Important: MCP + AI Instructions Required</h4>
  <p style="color: #7f1d1d; margin-bottom: 8px;">
    The MCP server alone may not be sufficient for optimal AI assistance. This project includes ready-to-use <strong>AI instruction files</strong> for GitHub Copilot, Claude, and Cursor that guide the AI to use the MCP correctly and prioritize SFCC-specific knowledge.
  </p>
  <p style="color: #7f1d1d; margin-bottom: 0;">
    📁 <strong>Get the files:</strong> <a href="https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions" target="_blank" style="color: #dc2626; text-decoration: underline;">ai-instructions folder on GitHub</a><br>
    📖 <strong>Setup guide:</strong> <a href="ai-interfaces" style="color: #dc2626; text-decoration: underline;">AI Interface Setup page</a>
  </p>
</div>

Get immediate access to SFCC documentation and best practices without any credentials using **documentation-only mode**:

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

For **full functionality** including log analysis and system objects, provide SFCC credentials via `--dw-json` parameter:

**⚠️ Important**: For full API functionality, you'll need to configure OCAPI settings in Business Manager. See the **[Configuration Guide](configuration#data-api-configuration)** for required Data API settings.

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

**dw.json configuration file:**
```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username", 
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret",
  "site-id": "your-site-id"
}
```

*Note: The `site-id` field is optional and only needed for site-specific operations.*

Choose your preferred AI interface:
- **[Claude Desktop Setup](ai-interfaces#claude-desktop)** - Native desktop app for AI assistance
- **[GitHub Copilot Setup](ai-interfaces#github-copilot)** - VS Code integration  
- **[Cursor Setup](ai-interfaces#cursor)** - Modern AI-powered editor

## ✨ Key Features

- **🔍 Complete SFCC Documentation Access** - Search and explore all SFCC API classes and methods
- **📚 Best Practices Guides** - Curated development guidelines for cartridges, hooks, controllers, and more
- **🏗️ SFRA Documentation** - Enhanced access to Storefront Reference Architecture documentation
- **📊 Log Analysis Tools** - Real-time error monitoring and debugging for SFCC instances
- **⚙️ System Object Definitions** - Explore custom attributes and site preferences
- **🚀 Cartridge Generation** - Automated cartridge structure creation

##  Documentation

<div class="grid">
  <div class="card">
    <h3><a href="installation">📦 Installation</a></h3>
    <p>Multiple installation options including npx, global, and local development</p>
  </div>
  
  <div class="card">
    <h3><a href="ai-interfaces">🤖 AI Interface Setup</a></h3>
    <p>Detailed setup guides for Claude Desktop, GitHub Copilot, and Cursor</p>
  </div>
  
  <div class="card">
    <h3><a href="configuration">⚙️ Configuration</a></h3>
    <p>Complete configuration guide including dw.json and Data API setup</p>
  </div>
  
  <div class="card">
    <h3><a href="features">✨ Features</a></h3>
    <p>Detailed overview of all capabilities including cartridge generation, documentation access, and log analysis</p>
  </div>
  
  <div class="card">
    <h3><a href="tools">🛠️ Available Tools</a></h3>
    <p>Comprehensive documentation of all available MCP tools</p>
  </div>
  
  <div class="card">
    <h3><a href="examples">💡 Examples</a></h3>
    <p>Real-world AI assistant interactions and use cases</p>
  </div>
  
  <div class="card">
    <h3><a href="security">🔒 Security</a></h3>
    <p>Security guidelines and best practices for credential management</p>
  </div>
  
  <div class="card">
    <h3><a href="troubleshooting">🐛 Troubleshooting</a></h3>
    <p>Common issues and debugging techniques</p>
  </div>
</div>

## 🎯 Operating Modes

### Documentation-Only Mode
Perfect for learning and reference - no SFCC credentials required. Access to:
- Complete SFCC API documentation
- Best practices guides  
- SFRA documentation
- Cartridge generation tools

### Full Mode
Complete development experience with SFCC instance access:
- All documentation-only features
- Real-time log analysis
- System object definitions
- Site preference management

## 🔗 Quick Links

- [Installation Guide](installation) - Get started in minutes
- [Tool Reference](tools) - Complete tool documentation  
- [Configuration](configuration) - Setup your SFCC credentials
- [GitHub Repository](https://github.com/taurgis/sfcc-dev-mcp) - Source code and issues

---

*This MCP server empowers AI assistants to provide accurate, real-time assistance for SFCC development workflows, significantly improving developer productivity and code quality.*
