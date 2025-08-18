---
title: Installation & Setup
layout: page
nav_order: 2
---

# 📦 Installation & Setup

The SFCC Development MCP Server can be installed and run in several ways. Choose the option that best fits your workflow.

## Option 1: Using npx (Recommended)

The easiest way to use this MCP server is with npx, which automatically handles installation and updates:

```bash
# Test the server (Documentation-only mode)
npx sfcc-dev-mcp

# Use with custom dw.json file
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Use with specific working directory
npx sfcc-dev-mcp --working-dir /path/to/your/project
```

### Advantages of npx
- ✅ No installation required
- ✅ Always uses the latest version
- ✅ No global package management
- ✅ Perfect for CI/CD workflows

## Option 2: Global Installation

Install the package globally for use across multiple projects:

```bash
# Install globally
npm install -g sfcc-dev-mcp

# Run from anywhere
sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Check version
sfcc-dev-mcp --version
```

### When to use global installation
- 🎯 Working with multiple SFCC projects
- 🎯 Want consistent version across projects
- 🎯 Offline development scenarios

## Option 3: Local Development Installation

For contributing to the project or local modifications:

```bash
# Clone the repository
git clone https://github.com/taurgis/sfcc-dev-mcp.git
cd sfcc-dev-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Run locally
npm start -- --dw-json /path/to/your/dw.json

# Run tests
npm test

# Watch mode for development
npm run dev
```

### Development features
- 🔧 TypeScript source code access
- 🔧 Full test suite
- 🔧 Watch mode for rapid iteration
- 🔧 Debugging capabilities

## System Requirements

- **Node.js**: Version 18 or higher
- **Operating System**: macOS, Linux, or Windows
- **Memory**: Minimum 512MB RAM available
- **Network**: Internet access for SFCC API calls (Full Mode only)

## Verification

After installation, verify the server is working:

```bash
# Test basic functionality
npx sfcc-dev-mcp --help

# Test documentation-only mode
npx sfcc-dev-mcp --mode docs-only

# Test with your configuration
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --test
```

## Next Steps

- 📖 **[AI Interface Setup](ai-interfaces)** - Configure your preferred AI assistant
- ⚙️ **[Configuration Guide](configuration)** - Set up SFCC credentials and options
- 🛠️ **[Available Tools](tools)** - Explore what the server can do
