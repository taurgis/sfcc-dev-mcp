---
title: Configuration Guide
layout: page
nav_order: 5
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
  "client-secret": "your-client-secret",
  "site-id": "your-site-id"
}
```

**Note**: The `site-id` field is optional and only needed for site-specific operations.

#### Advanced dw.json Configuration
```json
{
  "hostname": "dev01-na01-company.demandware.net",
  "username": "your-username",
  "password": "your-password",
  "client-id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "client-secret": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "code-version": "version1",
  "site-id": "RefArch"
}
```

**Supported fields:**
- `hostname` (required) - Your SFCC instance hostname
- `username` (required) - Your SFCC username  
- `password` (required) - Your SFCC password
- `client-id` (optional) - OAuth client ID for API access
- `client-secret` (optional) - OAuth client secret for API access
- `code-version` (optional) - Code version identifier
- `site-id` (optional) - Site ID for site-specific operations

#### Using dw.json
```bash
# Specify dw.json path
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Enable debug logging
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug true

# Auto-detect dw.json in current directory
npx sfcc-dev-mcp
```

**Available command-line options:**
- `--dw-json <path>` - Path to your dw.json configuration file
- `--debug <true|false>` - Enable debug logging (optional, defaults to false)

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

**Supported environment variables:**
- `SFCC_HOSTNAME` - Your SFCC instance hostname
- `SFCC_USERNAME` - Your SFCC username
- `SFCC_PASSWORD` - Your SFCC password  
- `SFCC_CLIENT_ID` - OAuth client ID for API access
- `SFCC_CLIENT_SECRET` - OAuth client secret for API access

### Method 3: Configuration Loading Priority

The server loads configuration in the following order of preference:

1. **Command line `--dw-json` argument** (highest priority)
2. **Auto-detected dw.json files** in this order:
   - `./dw.json` (current directory)
   - `../dw.json` (parent directory)  
   - `../../dw.json` (grandparent directory)
   - `~/dw.json` (home directory)
3. **Environment variables** (lowest priority)

```bash
# Examples of different approaches
npx sfcc-dev-mcp --dw-json ./config/production.json  # Specific file
npx sfcc-dev-mcp                                     # Auto-detect or env vars
```

## 🔧 Data API Configuration

For system object definition tools (`get_system_object_definitions`, `get_system_object_definition`, `search_system_object_attribute_definitions`, `search_site_preferences`, `search_system_object_attribute_groups`, `search_custom_object_attribute_definitions`), you need additional Business Manager setup.

### Step 1: Create API Client in Account Manager

1. **Login to Account Manager**: Go to account.demandware.com (not Business Manager)
2. **Navigate to API Client** section
3. **Click Add API Client**
4. **Configure the API client:**
   - **Name**: `SFCC Dev MCP Server` (or any descriptive name)
   - **Password**: Generate a secure password
   - **Scopes**: Select **SFCC** scope
   - **Roles**: Assign appropriate roles for your organization

### Step 2: Configure Data API Access in Business Manager

1. **Login to Business Manager** for your instance
2. **Navigate to**: Administration → Site Development → Open Commerce API Settings
3. **Click on Data API** tab
4. **Configure the following settings:**

**Client Configuration:**
```json
{
  "_v": "23.2",
  "clients": [
    {
      "client_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "resources": [
        {
          "resource_id": "/system_object_definitions",
          "methods": ["get"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definitions/*",
          "methods": ["get"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definition_search",
          "methods": ["post"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definitions/*/attribute_definition_search",
          "methods": ["post"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/system_object_definitions/*/attribute_group_search",
          "methods": ["post"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/custom_object_definitions/*/attribute_definition_search",
          "methods": ["post"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/site_preferences/preference_groups/*/*/preference_search",
          "methods": ["post"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/code_versions",
          "methods": ["get"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/code_versions/*",
          "methods": ["get", "patch"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        }
      ]
    }
  ]
}
```

**Required Settings:**
- **Client ID**: Your API client ID (e.g., `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)
- **Methods**: `get` and `post` (required for retrieving and searching)
- **Read Attributes**: `(**)` (allows reading all attributes)
- **Write Attributes**: `(**)` (may be required for some operations)

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

### Troubleshooting Data API Access

**Common Issues:**
- **403 Forbidden**: Check that your API client has the correct scopes and roles
- **401 Unauthorized**: Verify your client credentials are correct
- **Resource not found**: Ensure the resource ID pattern matches exactly

**Testing Your Configuration:**
Use the MCP tools to test your Data API access:
```bash
# This will log system object access errors
npx sfcc-dev-mcp --dw-json ./dw.json --debug true
```

## 🎯 Operating Mode Configuration

### Documentation-Only Mode

No SFCC credentials required - perfect for learning and reference:

```bash
# Run without any credentials
npx sfcc-dev-mcp

# Or explicitly enable debug mode
npx sfcc-dev-mcp --debug true
```

**Available tools in this mode:**
- SFCC API documentation (5 tools)
- Best practices guides (4 tools)
- SFRA documentation (5 tools)
- Cartridge generation (1 tool)

**Total: 15 tools available**

### Full Mode

Requires SFCC instance credentials for complete functionality:

```bash
# With dw.json file
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# With debug logging enabled
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug true
```

**Additional tools in full mode:**
- Log analysis (7 tools) - Requires hostname, username, password
- System object definitions (6 tools) - Requires client-id, client-secret

**Total: 28 tools available** (15 documentation + 13 full mode)

## 🔒 Security Configuration

### Protecting Credentials

#### Best Practice: Use .gitignore
```bash
# Add to your .gitignore file
echo "dw.json" >> .gitignore
echo "*.dw.json" >> .gitignore
```

#### Environment Variable Override
```bash
# Use dw.json for non-sensitive data, override secrets via environment
export SFCC_CLIENT_SECRET="your-secret"
export SFCC_PASSWORD="your-password"
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

#### Configuration Loading Problems
```bash
# Check if dw.json is valid JSON
python -m json.tool dw.json
# or
node -e "console.log(JSON.parse(require('fs').readFileSync('dw.json')))"
```

#### Connection Testing
```bash
# Test with debug mode to see connection details
npx sfcc-dev-mcp --dw-json ./dw.json --debug true
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
# Enable debug mode with explicit flag
npx sfcc-dev-mcp --dw-json ./dw.json --debug true

# Debug mode without value defaults to true
npx sfcc-dev-mcp --dw-json ./dw.json --debug
```

**Debug output includes:**
- Configuration loading details
- Connection attempt information
- Tool availability status
- Error details and stack traces

## 📝 Configuration Examples

### Development Environment
```json
{
  "hostname": "dev01-sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "dev-user@company.com",
  "password": "dev-password",
  "client-id": "development-client-id",
  "client-secret": "development-client-secret",
  "code-version": "dev_branch",
  "site-id": "SiteGenesis"
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
  "code-version": "staging_release",
  "site-id": "RefArch"
}
```

### Documentation-Only (No Credentials)
```json
{}
```
**Note**: Empty configuration file works for documentation-only mode, or simply run without any dw.json file.

## � Configuration Reference

### Configuration Loading Order

The server loads configuration with the following priority:

1. **Command-line arguments** (highest priority)
   - `--dw-json /path/to/file.json`
   - `--debug true`

2. **Auto-detected dw.json files**
   - `./dw.json` (current directory)
   - `../dw.json` (parent directory)
   - `../../dw.json` (grandparent directory)
   - `~/dw.json` (home directory)

3. **Environment variables** (lowest priority)
   - `SFCC_HOSTNAME`, `SFCC_USERNAME`, `SFCC_PASSWORD`
   - `SFCC_CLIENT_ID`, `SFCC_CLIENT_SECRET`

### Supported dw.json Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hostname` | string | Yes | SFCC instance hostname |
| `username` | string | Yes | SFCC username for WebDAV access |
| `password` | string | Yes | SFCC password for WebDAV access |
| `client-id` | string | No | OAuth client ID for OCAPI access |
| `client-secret` | string | No | OAuth client secret for OCAPI access |
| `code-version` | string | No | Code version identifier |
| `site-id` | string | No | Site ID for site-specific operations |

### Tool Availability by Configuration

| Tool Category | Required Fields | Count |
|---------------|----------------|-------|
| **Documentation Tools** | None | 5 |
| **Best Practices** | None | 4 |
| **SFRA Documentation** | None | 5 |
| **Cartridge Generation** | None | 1 |
| **Log Analysis** | hostname, username, password | 7 |
| **System Objects** | client-id, client-secret | 6 |

---

## Next Steps

- 🛠️ **[Available Tools](tools)** - Explore server capabilities
- 💡 **[Examples](examples)** - See real-world usage patterns  
- 🐛 **[Troubleshooting](troubleshooting)** - Common issues and solutions
