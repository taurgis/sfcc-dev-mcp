---
title: Configuration Guide
layout: page
nav_order: 4
---

# ⚙️ Configuration Guide

The SFCC Development MCP Server supports multiple configuration methods to fit different development workflows.

## Configuration Methods

### Method 1: dw.json File (Recommended)

The `dw.json` file is the standard SFCC configuration format, compatible with most SFCC tooling.

#### Basic dw.json Structure
```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret"
}
```

#### Advanced dw.json Configuration
```json
{
  "hostname": "dev01-na01-company.demandware.net",
  "username": "your-username",
  "password": "your-password",
  "client-id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "client-secret": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "code-version": "version1",
  "version": "1.0.0",
  "cartridge": ["plugin_cartridge", "int_cybersource"],
  "auto-upload": ["src/**/*"],
  "exclude": ["node_modules/**", ".git/**"]
}
```

#### Using dw.json
```bash
# Specify dw.json path
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Auto-detect in current directory
npx sfcc-dev-mcp --working-dir /path/to/your/project
```

### Method 2: Environment Variables

Set environment variables for containerized or CI/CD environments:

```bash
export SFCC_HOSTNAME="your-instance.sandbox.us01.dx.commercecloud.salesforce.com"
export SFCC_USERNAME="your-username"
export SFCC_PASSWORD="your-password"
export SFCC_CLIENT_ID="your-client-id"
export SFCC_CLIENT_SECRET="your-client-secret"

npx sfcc-dev-mcp
```

### Method 3: Command Line Arguments

Override specific settings without modifying configuration files:

```bash
npx sfcc-dev-mcp \
  --hostname "your-instance.sandbox.us01.dx.commercecloud.salesforce.com" \
  --username "your-username" \
  --password "your-password" \
  --client-id "your-client-id" \
  --client-secret "your-client-secret"
```

## 🔧 Data API Configuration

For system object definition tools, you need additional Business Manager setup.

### Step 1: Create API Client in Account Manager

1. **Login to Account Manager**: Go to account.demandware.com
2. **Navigate to API Client**: Account Settings → API Client
3. **Create New Client**:
   - Name: `SFCC Dev MCP Server`
   - Scopes: `SALESFORCE_COMMERCE_API:CONFIGURE`
4. **Save Client ID and Secret**: Store securely in your dw.json

### Step 2: Configure Data API Access in Business Manager

1. **Login to Business Manager**
2. **Navigate to**: Administration → Site Development → Open Commerce API Settings
3. **Add Resource Configuration**:
   ```json
   {
     "resource_id": "/system_object_definitions/*",
     "methods": ["get"],
     "read_attributes": "(**)",
     "write_attributes": "(**)"
   }
   ```
4. **Save Configuration**

### Step 3: Update Your Configuration

Add Data API credentials to your dw.json:

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username", 
  "password": "your-password",
  "client-id": "your-ocapi-client-id",
  "client-secret": "your-ocapi-client-secret"
}
```

## 🎯 Operating Mode Configuration

### Documentation-Only Mode

No SFCC credentials required - perfect for learning and reference:

```bash
# Explicit documentation-only mode
npx sfcc-dev-mcp --mode docs-only

# Or simply omit credentials
npx sfcc-dev-mcp
```

**Available tools in this mode:**
- SFCC API documentation (5 tools)
- Best practices guides (4 tools)
- SFRA documentation (5 tools)
- Cartridge generation (1 tool)

### Full Mode

Requires SFCC instance credentials for complete functionality:

```bash
# With dw.json file
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# With environment variables
npx sfcc-dev-mcp --mode full
```

**Additional tools in full mode:**
- Log analysis (7 tools)
- System object definitions (6 tools)
- Site preference management (2 tools)

## 🔒 Security Configuration

### Protecting Credentials

#### Option 1: Separate Credentials File
```bash
# Store credentials separately
echo '{"client-id":"xxx","client-secret":"yyy"}' > ~/.sfcc-credentials.json
chmod 600 ~/.sfcc-credentials.json

# Merge with dw.json
npx sfcc-dev-mcp --dw-json ./dw.json --credentials ~/.sfcc-credentials.json
```

#### Option 2: Environment Variable Override
```bash
# Use dw.json for non-sensitive data
# Override sensitive data with environment variables
export SFCC_CLIENT_SECRET="your-secret"
npx sfcc-dev-mcp --dw-json ./dw.json
```

### File Permissions

Ensure proper file permissions on configuration files:

```bash
# Secure your dw.json file
chmod 600 dw.json

# Verify permissions
ls -la dw.json
# Should show: -rw------- (600)
```

## 🐛 Configuration Troubleshooting

### Common Issues

#### Invalid JSON Format
```bash
# Validate your dw.json
npx sfcc-dev-mcp --validate-config --dw-json ./dw.json
```

#### Missing Credentials
```bash
# Test configuration
npx sfcc-dev-mcp --test-connection --dw-json ./dw.json
```

#### Permission Errors
```bash
# Check file permissions
ls -la dw.json

# Fix permissions if needed
chmod 600 dw.json
```

#### Network Issues
```bash
# Test SFCC connectivity
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com
```

### Debug Mode

Enable debug logging for configuration issues:

```bash
# Enable debug mode
DEBUG=sfcc-dev-mcp:* npx sfcc-dev-mcp --dw-json ./dw.json

# Or set log level
npx sfcc-dev-mcp --log-level debug --dw-json ./dw.json
```

## 📝 Configuration Examples

### Development Environment
```json
{
  "hostname": "dev01-sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "dev-user@company.com",
  "password": "dev-password",
  "client-id": "development-client-id",
  "client-secret": "development-client-secret",
  "code-version": "dev_branch"
}
```

### Staging Environment
```json
{
  "hostname": "staging-sandbox.us01.dx.commercecloud.salesforce.com", 
  "username": "staging-user@company.com",
  "password": "staging-password",
  "client-id": "staging-client-id",
  "client-secret": "staging-client-secret",
  "code-version": "staging_release"
}
```

## 🔄 Configuration Migration

### From Prophet Debugger
```bash
# Convert existing prophet configuration
npx sfcc-dev-mcp --migrate-from-prophet --config ./prophet.json
```

### From SFCC Build Suite
```bash
# Use existing build configuration
npx sfcc-dev-mcp --dw-json ./build/dw.json
```

---

## Next Steps

- 🛠️ **[Available Tools](tools)** - Explore server capabilities
- 💡 **[Examples](examples)** - See real-world usage patterns  
- 🐛 **[Troubleshooting](troubleshooting)** - Common issues and solutions
