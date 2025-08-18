---
title: AI Interface Setup
layout: page
nav_order: 3
---

# 🤖 AI Interface Setup

The SFCC Development MCP Server integrates with multiple AI interfaces. Each has specific setup procedures and capabilities.

## Quick Setup Summary

| AI Interface | Best For | Setup Complexity | MCP Support |
|--------------|----------|------------------|-------------|
| **Claude Desktop** | Multi-turn conversations, complex debugging | ⭐⭐ Medium | Native |
| **GitHub Copilot** | In-editor code completion, VS Code integration | ⭐ Easy | Via instructions |
| **Cursor** | Modern AI-powered editing, rule-based assistance | ⭐⭐⭐ Advanced | Via extensions |

---

## GitHub Copilot Setup

Perfect for developers who want SFCC context directly in VS Code with inline suggestions and code completion.

### Installation Steps

1. **Copy the instruction file** to your SFCC project root:
   ```bash
   cp ai-instructions/github-copilot/copilot-instructions.md your-sfcc-project/.github/copilot-instructions.md
   ```

2. **Configure MCP server** (for MCP-compatible tools):
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

### Features Enabled
- ✅ **Inline code suggestions** with SFCC context
- ✅ **Auto-completion** for SFCC APIs and patterns  
- ✅ **Template generation** for controllers, hooks, and components
- ✅ **Real-time error detection** and fixes
- ✅ **SFCC-aware refactoring** suggestions

### Best Practices
- Place the instructions file in every SFCC project
- Keep the instructions updated with your project-specific patterns
- Use descriptive commit messages for better context

---

## Claude Desktop Setup

The most comprehensive setup with full MCP integration for complex debugging and architecture discussions.

### Installation Steps

1. **Copy the instruction file** to your project:
   ```bash
   cp ai-instructions/claude-desktop/claude_custom_instructions.md your-sfcc-project/claude-instructions.md
   ```

2. **Locate your Claude Desktop config file**:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

3. **Choose your operating mode**:

#### Documentation-Only Mode (No SFCC credentials needed)
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

#### Full Mode (With SFCC credentials)
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

4. **Create your dw.json file** (for Full Mode):
   ```json
   {
     "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
     "username": "your-username", 
     "password": "your-password",
     "client-id": "your-client-id",
     "client-secret": "your-client-secret"
   }
   ```

### Features Enabled
- ✅ **Real-time SFCC documentation** access
- ✅ **Multi-turn debugging** conversations
- ✅ **Architecture review** and planning
- ✅ **Complete log analysis** (Full Mode)
- ✅ **System object exploration** (Full Mode)
- ✅ **Site preference management** (Full Mode)

### Troubleshooting Claude Desktop
- **Server not starting**: Check config file syntax with [JSON validator](https://jsonlint.com/)
- **Permission errors**: Ensure dw.json file permissions are readable
- **Connection issues**: Verify SFCC credentials and network access

---

## Cursor Setup

Advanced setup with multiple context-aware rules for modern AI-powered development.

### Installation Steps

1. **Copy the rules structure** to your SFCC project:
   ```bash
   cp -r ai-instructions/cursor/.cursor your-sfcc-project/
   ```

2. **Configure MCP server** (for MCP-compatible extensions):
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

### Available Cursor Rules

#### Always Applied
- **`sfcc-development.mdc`** - Core SFCC patterns and conventions

#### Auto-Applied (Context Aware)
- **`sfra-controllers.mdc`** - Controller development patterns
- **`hooks-development.mdc`** - Hook implementation guidelines  
- **`system-objects.mdc`** - Data model and attribute patterns
- **`testing-patterns.mdc`** - Testing templates and best practices

#### Manual Application
- **`@debugging-workflows`** - Debugging guidance and log analysis
- **`@security-patterns`** - Security best practices and vulnerability prevention
- **`@performance-optimization`** - Performance tuning and optimization strategies

### Features Enabled
- ✅ **Context-aware code completion** based on file type
- ✅ **Real-time validation** against SFCC APIs
- ✅ **File-aware refactoring** across cartridge structures
- ✅ **Security-first development** patterns
- ✅ **Automatic rule application** based on context

### Using Cursor Rules
```typescript
// Trigger specific rules with @mentions
// @security-patterns - Apply security best practices
// @performance-optimization - Focus on performance
// @debugging-workflows - Get debugging assistance
```

---

## Comparison & Recommendations

### Choose Claude Desktop if:
- 🎯 You need **complex multi-turn conversations**
- 🎯 You want **full log analysis capabilities**
- 🎯 You prefer **comprehensive debugging sessions**
- 🎯 You work on **architecture and design decisions**

### Choose GitHub Copilot if:
- 🎯 You primarily work **in VS Code**
- 🎯 You want **inline code suggestions**
- 🎯 You prefer **lightweight integration**
- 🎯 You focus on **rapid code completion**

### Choose Cursor if:
- 🎯 You want **modern AI-powered editing**
- 🎯 You need **context-aware rule application**
- 🎯 You prefer **file-based intelligence**
- 🎯 You want **advanced refactoring capabilities**

---

## Next Steps

- ⚙️ **[Configuration Guide](configuration)** - Set up SFCC credentials
- 🛠️ **[Available Tools](tools)** - Explore server capabilities
- 💡 **[Examples](examples)** - See real-world usage patterns
