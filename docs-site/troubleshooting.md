---
title: Troubleshooting
layout: default
nav_order: 7
---

# 🐛 Troubleshooting & Debugging

Common issues and solutions for the SFCC Development MCP Server.

## 🚨 Quick Diagnostics

### Server Won't Start

**Symptoms:**
- MCP server fails to initialize
- AI assistant shows "connection failed" 
- No tools available in AI interface

#### Permission Issues
```bash
# Fix file permissions
chmod 600 dw.json

# Check file accessibility  
ls -la dw.json
# Should show: -rw------- (600)
```

#### Node.js Version Issues
```bash
# Check Node.js version (requires 18+)
node --version

# Update if needed
nvm install 18
nvm use 18
```

---

## 🔐 Authentication Problems

### SFCC API Authentication Failures

**Symptoms:**
- "401 Unauthorized" errors in logs
- System object tools not working
- Log analysis tools failing

**Diagnostic Commands:**
```bash
# Test SFCC connectivity
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Test WebDAV credentials
curl -u "username:password" \
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Cartridges/

# Test OCAPI credentials
curl -X POST \
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/dw/oauth2/access_token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
```

**Solutions:**

#### Update Expired Credentials
```json
// Complete dw.json structure with all supported fields
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "current-username",
  "password": "current-password",
  "client-id": "current-client-id", 
  "client-secret": "current-client-secret",
  "site-id": "SiteGenesis",
  "code-version": "version1"
}
```

#### Verify Business Manager Permissions
1. **Login to Business Manager**
2. **Check User Permissions**: Administration → Organization → Users
3. **Verify Role**: User should have "Administrator" or "Developer" role
4. **Check OCAPI Settings**: Administration → Site Development → Open Commerce API Settings

#### Regenerate API Credentials
1. **Account Manager**: account.demandware.com
2. **API Client**: Account Settings → API Client  
3. **Regenerate**: Create new client ID and secret
4. **Update**: Replace in dw.json file

---

## 🌐 Network & Connectivity Issues

### Connection Timeouts

**Symptoms:**
- Tools hang or timeout
- Intermittent failures
- Slow response times

**Solutions:**

#### Increase Request Timeout
```javascript
// Note: timeout and retries are not configurable
// The server uses default timeout values
// For connection issues, check network connectivity instead
```

#### Check Network Configuration
```bash
# Test DNS resolution
nslookup your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Test network connectivity
ping your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Check for proxy issues
curl -v https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com
```

#### Corporate Firewall Issues
```bash
# Check if behind corporate firewall
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Configure proxy if needed
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

---

## 🤖 AI Interface Integration Issues

### Claude Desktop Setup Problems

**Configuration File Location Issues:**

| OS | Config File Location | Common Issues |
|----|---------------------|---------------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` | Hidden folder, requires Finder → Go → Go to Folder |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` | Environment variable not expanded |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` | Directory doesn't exist |

**Fix Configuration Issues:**
```bash
# macOS - Create config directory if missing
mkdir -p ~/Library/Application\ Support/Claude/

# Windows - Navigate to correct location
cd %APPDATA%\Claude\

# Linux - Create config directory
mkdir -p ~/.config/Claude/

# Validate JSON syntax
cat claude_desktop_config.json | python -m json.tool
```

**Sample Working Configuration:**
```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx", 
      "args": ["sfcc-dev-mcp", "--dw-json", "/absolute/path/to/dw.json"]
    }
  }
}
```

### GitHub Copilot Issues

**Instructions Not Working:**
```bash
# Verify file location
ls -la .github/copilot-instructions.md

# Check VS Code Copilot status
code --extensions-dir ~/.vscode/extensions --list-extensions | grep copilot

# Restart VS Code to reload instructions
```

**Context Not Available:**
- Ensure instructions file is in project root
- Check GitHub Copilot subscription status
- Verify VS Code extension is updated

### Cursor Setup Issues

**Rules Not Loading:**
```bash
# Check rules directory structure
ls -la .cursor/

# Verify rule file syntax
head .cursor/rules/sfcc-development.mdc

# Check Cursor version compatibility
```

---

## 📊 Tool-Specific Issues

### Log Analysis Tools Failing

**"No logs found" Errors:**

1. **Check Log Access Permissions:**
   ```bash
   # Test WebDAV access to logs
   curl -u "username:password" \
     https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Logs/
   ```

2. **Verify Instance Activity:**
   - Ensure SFCC instance is active
   - Check if logs are being generated
   - Verify log retention settings

3. **Check Date Format:**
   ```javascript
   // Use correct date format (YYYYMMDD)
   get_latest_error({ date: "20241218" })
   
   // Not: "2024-12-18" or "12/18/2024"
   ```

### System Object Tools Not Working

**"OAuth authentication failed" Errors:**

1. **Verify OCAPI Configuration:**
   ```json
   // Business Manager → Open Commerce API Settings
   {
     "resource_id": "/system_object_definitions/*",
     "methods": ["get"],
     "read_attributes": "(**)",
     "write_attributes": "(**)"
   }
   ```

2. **Check Client Credentials:**
   ```bash
   # Test OAuth token generation
   curl -X POST \
     https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/dw/oauth2/access_token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
   ```

3. **Verify Scopes:**
   - Client needs `SALESFORCE_COMMERCE_API:CONFIGURE` scope
   - Check Account Manager API client configuration

---

## 🔍 Debug Mode & Logging

### Enable Debug Logging

**Command Line Method:**
```bash
# Enable debug mode
npx sfcc-dev-mcp --debug --dw-json ./dw.json

# Enable debug mode with explicit true
npx sfcc-dev-mcp --debug true --dw-json ./dw.json

# Disable debug mode explicitly
npx sfcc-dev-mcp --debug false --dw-json ./dw.json
```

**Note:** Environment variables like `DEBUG=sfcc-dev-mcp:*` are not supported. Use the `--debug` command-line argument instead.

### Log File Locations

**MCP Server Logs:**

Logs are stored in the system temporary directory under `sfcc-mcp-logs/`:

| OS | Base Log Location | 
|----|-------------------|
| **macOS** | `/tmp/sfcc-mcp-logs/` |
| **Windows** | `%TEMP%\sfcc-mcp-logs\` |
| **Linux** | `/tmp/sfcc-mcp-logs/` |

**Log Files Generated:**
- `sfcc-mcp-info.log` - Informational messages
- `sfcc-mcp-warn.log` - Warning messages  
- `sfcc-mcp-error.log` - Error messages
- `sfcc-mcp-debug.log` - Debug messages (when `--debug` is enabled)

**View Logs in Real-Time:**
```bash
# macOS/Linux - View error logs
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-error.log

# View info logs
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-info.log

# View debug logs (when debug mode is enabled)
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-debug.log

# Windows - View logs with PowerShell
Get-Content -Wait "$env:TEMP\sfcc-mcp-logs\sfcc-mcp-error.log"

# View last 100 lines
tail -n 100 /tmp/sfcc-mcp-logs/sfcc-mcp-error.log
```

---

## 🧪 Testing & Validation

### Test Server Functionality

**Basic Functionality Test:**
```bash
# Test documentation-only mode
npx sfcc-dev-mcp

# Test with debug mode
npx sfcc-dev-mcp --debug

# Test with SFCC credentials
npx sfcc-dev-mcp --dw-json ./dw.json --debug
```

**Configuration Validation:**
```bash
# Validate dw.json syntax manually
cat dw.json | python -m json.tool

# Test SFCC connectivity manually
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Check if credentials work
curl -u "username:password" \
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/
```

---

## 🆘 Getting Help

### Collect Diagnostic Information

**Manual Diagnostic Collection:**
```bash
# Check system information
echo "Node.js version: $(node --version)" > debug-info.txt
echo "npm version: $(npm --version)" >> debug-info.txt
echo "OS: $(uname -a)" >> debug-info.txt

# Check package version
npm list sfcc-dev-mcp >> debug-info.txt 2>&1

# Copy recent log files
cp /tmp/sfcc-mcp-logs/*.log . 2>/dev/null || echo "No log files found"

# Check dw.json structure (without sensitive data)
echo "dw.json structure:" >> debug-info.txt
cat dw.json | jq 'keys' >> debug-info.txt 2>/dev/null || echo "dw.json not found or invalid"
```

**Sensitive Information Handling:**
```bash
# Sanitize logs before sharing
sed 's/password":"[^"]*"/password":"***"/g' dw.json > dw-sanitized.json
sed 's/client-secret":"[^"]*"/client-secret":"***"/g' dw-sanitized.json > dw-safe.json
```

### Community Resources

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/taurgis/sfcc-dev-mcp/issues)
- **Discussions**: [Community Q&A and discussions](https://github.com/taurgis/sfcc-dev-mcp/discussions)
- **Documentation**: [Complete documentation](https://taurgis.github.io/sfcc-dev-mcp/)

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `ECONNREFUSED` | Cannot connect to SFCC instance | Check hostname and network connectivity |
| `401 Unauthorized` | Invalid credentials | Verify username/password and API credentials |
| `403 Forbidden` | Insufficient permissions | Check Business Manager user permissions |
| `404 Not Found` | Resource not found | Verify endpoint URLs and paths |
| `429 Too Many Requests` | Rate limiting | Implement backoff and retry logic |
| `500 Internal Server Error` | SFCC server error | Check SFCC instance status and logs |

---

## Next Steps

- 📖 **[Configuration Guide](configuration)** - Review setup options
- 🛠️ **[Available Tools](tools)** - Explore server capabilities  
- 💡 **[Examples](examples)** - See working usage patterns
