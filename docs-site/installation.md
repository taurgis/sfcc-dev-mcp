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

# Enable debug mode
npx sfcc-dev-mcp --debug

# Combine options
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug
```

### Advantages of npx
- ✅ No installation required
- ✅ Always uses the latest version
- ✅ No global package management
- ✅ Perfect for CI/CD workflows

**Note:** When using npx, make sure your `dw.json` file is in the current working directory or specify the full path using the `--dw-json` parameter.

## Option 2: Global Installation

Install the package globally for use across multiple projects:

```bash
# Install globally
npm install -g sfcc-dev-mcp

# Run from anywhere
sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Enable debug mode
sfcc-dev-mcp --debug

# Check installed version
npm list -g sfcc-dev-mcp
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

# Run locally using npm scripts
npm run dev -- --dw-json /path/to/your/dw.json

# Or run built version
npm run build
npm start -- --dw-json /path/to/your/dw.json

# Enable debug mode during development
npm run dev -- --debug

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

## Command-Line Options

The server supports several command-line parameters to customize its behavior:

### `--dw-json <path>`
Specify a custom path to your `dw.json` configuration file:
```bash
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json
npx sfcc-dev-mcp --dw-json ./config/dw.json
```

### `--debug [true|false]`
Control debug logging output:
```bash
# Enable debug logging (detailed messages, timing info)
npx sfcc-dev-mcp --debug
npx sfcc-dev-mcp --debug true

# Disable debug logging (essential info only)
npx sfcc-dev-mcp --debug false
```

**Debug logging includes:**
- Method entry and exit logs
- Detailed timing information for operations  
- Full response previews for debugging
- Additional context for troubleshooting

### Configuration Loading Priority

The server loads configuration in the following order:

1. **Command line `--dw-json` argument** (highest priority)
2. **`./dw.json` file in current directory**
3. **Environment variables** (lowest priority)

## Verification

After installation, verify the server is working:

```bash
# Test basic functionality (documentation-only mode)
npx sfcc-dev-mcp

# Test with debug output
npx sfcc-dev-mcp --debug

# Test with your configuration
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Test with configuration and debug mode
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug
```

## Next Steps

- 📖 **[AI Interface Setup](ai-interfaces)** - Configure your preferred AI assistant
- ⚙️ **[Configuration Guide](configuration)** - Set up SFCC credentials and options
- 🛠️ **[Available Tools](tools)** - Explore what the server can do
