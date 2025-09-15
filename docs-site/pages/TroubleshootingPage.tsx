import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const TroubleshootingPage: React.FC = () => {
    useSEO({
        title: 'Troubleshooting & Debugging - SFCC Development MCP Server',
        description: 'Common issues and solutions for the SFCC Development MCP Server. Includes authentication problems, network connectivity, AI interface integration, and debugging tips.',
        keywords: 'SFCC troubleshooting, Commerce Cloud debugging, MCP server issues, SFCC authentication problems, OCAPI troubleshooting, WebDAV issues',
        canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/troubleshooting',
        ogTitle: 'SFCC Development MCP Server Troubleshooting Guide',
        ogDescription: 'Comprehensive troubleshooting guide for SFCC Development MCP Server. Solutions for authentication, connectivity, and AI integration issues.',
        ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/troubleshooting'
    });

    return (
        <>
            <H1 id="troubleshooting">🐛 Troubleshooting & Debugging</H1>
            <PageSubtitle>Common issues and solutions for the SFCC Development MCP Server.</PageSubtitle>

            <H2 id="quick-diagnostics">🚨 Quick Diagnostics</H2>

            <H3 id="server-wont-start">Server Won't Start</H3>
            <p><strong>Symptoms:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>MCP server fails to initialize</li>
                <li>AI assistant shows "connection failed"</li>
                <li>No tools available in AI interface</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <h4 className="font-semibold text-yellow-800">Permission Issues</h4>
                <CodeBlock language="bash" code={`
# Fix file permissions
chmod 600 dw.json

# Check file accessibility  
ls -la dw.json
# Should show: -rw------- (600)
                `} />
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <h4 className="font-semibold text-red-800">Node.js Version Issues</h4>
                <CodeBlock language="bash" code={`
# Check Node.js version (requires 18+)
node --version

# Update if needed
nvm install 18
nvm use 18
                `} />
            </div>

            <H2 id="authentication-problems">🔐 Authentication Problems</H2>

            <H3 id="sfcc-api-authentication-failures">SFCC API Authentication Failures</H3>
            <p><strong>Symptoms:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>"401 Unauthorized" errors in logs</li>
                <li>System object tools not working</li>
                <li>Log analysis tools failing</li>
            </ul>

            <p><strong>Diagnostic Commands:</strong></p>
            <CodeBlock language="bash" code={`
# Test SFCC connectivity
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Test WebDAV credentials
curl -u "username:password" \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Cartridges/

# Test OCAPI credentials
curl -X POST \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/dw/oauth2/access_token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
            `} />

            <p><strong>Solutions:</strong></p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <h4 className="font-semibold text-blue-800">Update Expired Credentials</h4>
                <CodeBlock language="json" code={`
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
                `} />
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
                <h4 className="font-semibold text-gray-800">Verify Business Manager Permissions</h4>
                <ol className="list-decimal pl-6 space-y-1">
                    <li><strong>Login to Business Manager</strong></li>
                    <li><strong>Check User Permissions:</strong> Administration → Organization → Users</li>
                    <li><strong>Verify Role:</strong> User should have "Administrator" or "Developer" role</li>
                    <li><strong>Check OCAPI Settings:</strong> Administration → Site Development → Open Commerce API Settings</li>
                </ol>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                <h4 className="font-semibold text-green-800">Regenerate API Credentials</h4>
                <ol className="list-decimal pl-6 space-y-1">
                    <li><strong>Account Manager:</strong> account.demandware.com</li>
                    <li><strong>API Client:</strong> Account Settings → API Client</li>
                    <li><strong>Regenerate:</strong> Create new client ID and secret</li>
                    <li><strong>Update:</strong> Replace in dw.json file</li>
                </ol>
            </div>

            <H2 id="network-connectivity-issues">🌐 Network & Connectivity Issues</H2>

            <H3 id="connection-timeouts">Connection Timeouts</H3>
            <p><strong>Symptoms:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Tools hang or timeout</li>
                <li>Intermittent failures</li>
                <li>Slow response times</li>
            </ul>

            <p><strong>Solutions:</strong></p>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 my-4">
                <h4 className="font-semibold text-purple-800">Check Network Configuration</h4>
                <CodeBlock language="bash" code={`
# Test DNS resolution
nslookup your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Test network connectivity
ping your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Check for proxy issues
curl -v https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com
                `} />
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 my-4">
                <h4 className="font-semibold text-orange-800">Corporate Firewall Issues</h4>
                <CodeBlock language="bash" code={`
# Check if behind corporate firewall
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Configure proxy if needed
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
                `} />
            </div>

            <H2 id="ai-interface-integration-issues">🤖 AI Interface Integration Issues</H2>

            <H3 id="claude-desktop-setup-problems">Claude Desktop Setup Problems</H3>
            <p><strong>Configuration File Location Issues:</strong></p>

            <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">OS</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Config File Location</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Common Issues</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">macOS</td>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>~/Library/Application Support/Claude/claude_desktop_config.json</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Hidden folder, requires Finder → Go → Go to Folder</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">Windows</td>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>%APPDATA%\Claude\claude_desktop_config.json</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Environment variable not expanded</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">Linux</td>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>~/.config/Claude/claude_desktop_config.json</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Directory doesn't exist</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p><strong>Fix Configuration Issues:</strong></p>
            <CodeBlock language="bash" code={`
# macOS - Create config directory if missing
mkdir -p ~/Library/Application\\ Support/Claude/

# Windows - Navigate to correct location
cd %APPDATA%\\Claude\\

# Linux - Create config directory
mkdir -p ~/.config/Claude/

# Validate JSON syntax
cat claude_desktop_config.json | python -m json.tool
            `} />

            <p><strong>Sample Working Configuration:</strong></p>
            <CodeBlock language="json" code={`
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx", 
      "args": ["sfcc-dev-mcp", "--dw-json", "/absolute/path/to/dw.json"]
    }
  }
}
            `} />

            <H3 id="github-copilot-issues">GitHub Copilot Issues</H3>
            <p><strong>Instructions Not Working:</strong></p>
            <CodeBlock language="bash" code={`
# Verify file location
ls -la .github/copilot-instructions.md

# Check VS Code Copilot status
code --extensions-dir ~/.vscode/extensions --list-extensions | grep copilot

# Restart VS Code to reload instructions
            `} />

            <p><strong>Context Not Available:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Ensure instructions file is in project root</li>
                <li>Check GitHub Copilot subscription status</li>
                <li>Verify VS Code extension is updated</li>
            </ul>

            <H3 id="cursor-setup-issues">Cursor Setup Issues</H3>
            <p><strong>Rules Not Loading:</strong></p>
            <CodeBlock language="bash" code={`
# Check rules directory structure
ls -la .cursor/

# Verify rule file syntax
head .cursor/rules/sfcc-development.mdc

# Check Cursor version compatibility
            `} />
            <H2 id="tool-specific-issues">📊 Tool-Specific Issues</H2>

            <H3 id="log-analysis-tools-failing">Log Analysis Tools Failing</H3>
            <p><strong>"No logs found" Errors:</strong></p>

            <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-semibold text-blue-800">1. Check Log Access Permissions:</h4>
                    <CodeBlock language="bash" code={`
# Test WebDAV access to logs
curl -u "username:password" \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Logs/
                    `} />
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h4 className="font-semibold text-green-800">2. Verify Instance Activity:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Ensure SFCC instance is active</li>
                        <li>Check if logs are being generated</li>
                        <li>Verify log retention settings</li>
                    </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h4 className="font-semibold text-yellow-800">3. Check Date Format:</h4>
                    <CodeBlock language="javascript" code={`
// Use correct date format (YYYYMMDD)
get_latest_error({ date: "20241218" })

// Not: "2024-12-18" or "12/18/2024"
                    `} />
                </div>
            </div>

            <H3 id="system-object-tools-not-working">System Object Tools Not Working</H3>
            <p><strong>"OAuth authentication failed" Errors:</strong></p>

            <div className="space-y-4">
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                    <h4 className="font-semibold text-purple-800">1. Verify OCAPI Configuration:</h4>
                    <CodeBlock language="json" code={`
// Business Manager → Open Commerce API Settings
{
  "resource_id": "/system_object_definitions/*",
  "methods": ["get"],
  "read_attributes": "(**)",
  "write_attributes": "(**)"
}
                    `} />
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
                    <h4 className="font-semibold text-indigo-800">2. Check Client Credentials:</h4>
                    <CodeBlock language="bash" code={`
# Test OAuth token generation
curl -X POST \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/dw/oauth2/access_token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
                    `} />
                </div>

                <div className="bg-pink-50 border-l-4 border-pink-400 p-4">
                    <h4 className="font-semibold text-pink-800">3. Verify Scopes:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Client needs <InlineCode>SALESFORCE_COMMERCE_API:CONFIGURE</InlineCode> scope</li>
                        <li>Check Account Manager API client configuration</li>
                    </ul>
                </div>
            </div>

            <H2 id="debug-mode-logging">🔍 Debug Mode & Logging</H2>

            <H3 id="enable-debug-logging">Enable Debug Logging</H3>
            <p><strong>Command Line Method:</strong></p>
            <CodeBlock language="bash" code={`
# Enable debug mode
npx sfcc-dev-mcp --debug --dw-json ./dw.json

# Enable debug mode with explicit true
npx sfcc-dev-mcp --debug true --dw-json ./dw.json

# Disable debug mode explicitly
npx sfcc-dev-mcp --debug false --dw-json ./dw.json
            `} />

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <p className="text-blue-800"><strong>Note:</strong> Environment variables like <InlineCode>DEBUG=sfcc-dev-mcp:*</InlineCode> are not supported. Use the <InlineCode>--debug</InlineCode> command-line argument instead.</p>
            </div>

            <H3 id="log-file-locations">Log File Locations</H3>
            <p><strong>MCP Server Logs:</strong></p>

            <p>Logs are stored in the operating system's temporary directory via Node.js <InlineCode>os.tmpdir()</InlineCode>:</p>

            <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">OS</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Log Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">macOS</td>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>/var/folders/{"{user-id}"}/T/sfcc-mcp-logs/</InlineCode></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">Linux</td>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>/tmp/sfcc-mcp-logs/</InlineCode> (typically)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">Windows</td>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>%TEMP%\sfcc-mcp-logs\</InlineCode></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="text-yellow-800"><strong>Note:</strong> On macOS, the actual path includes a user-specific folder ID. This provides better security and user isolation compared to the system-wide <InlineCode>/tmp</InlineCode> directory.</p>
            </div>

            <p><strong>Find Your Exact Log Directory:</strong></p>
            <CodeBlock language="bash" code={`
# Get the exact path for your system
node -e "console.log(require('os').tmpdir() + '/sfcc-mcp-logs')"

# Or check the debug logs which show the directory on startup
            `} />

            <p><strong>Log Files Generated:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>sfcc-mcp-info.log</InlineCode> - Informational messages and startup logs</li>
                <li><InlineCode>sfcc-mcp-warn.log</InlineCode> - Warning messages</li>
                <li><InlineCode>sfcc-mcp-error.log</InlineCode> - Error messages and stack traces</li>
                <li><InlineCode>sfcc-mcp-debug.log</InlineCode> - Debug messages (only when <InlineCode>--debug</InlineCode> is enabled)</li>
            </ul>

            <p><strong>View Logs in Real-Time:</strong></p>
            <CodeBlock language="bash" code={`
# Find and view error logs (macOS)
find /var/folders -name "sfcc-mcp-error.log" 2>/dev/null | head -1 | xargs tail -f

# Find and view info logs (macOS)  
find /var/folders -name "sfcc-mcp-info.log" 2>/dev/null | head -1 | xargs tail -f

# Linux - use traditional /tmp path
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-error.log

# Windows - use PowerShell
Get-Content -Wait "$env:TEMP\\sfcc-mcp-logs\\sfcc-mcp-error.log"

# View last 100 lines (replace path with your actual log directory)
tail -n 100 /path/to/your/sfcc-mcp-logs/sfcc-mcp-error.log
            `} />

            <H2 id="testing-validation">🧪 Testing & Validation</H2>

            <H3 id="test-server-functionality">Test Server Functionality</H3>
            <p><strong>Basic Functionality Test:</strong></p>
            <CodeBlock language="bash" code={`
# Test documentation-only mode
npx sfcc-dev-mcp

# Test with debug mode
npx sfcc-dev-mcp --debug

# Test with SFCC credentials
npx sfcc-dev-mcp --dw-json ./dw.json --debug
            `} />

            <p><strong>Configuration Validation:</strong></p>
            <CodeBlock language="bash" code={`
# Validate dw.json syntax manually
cat dw.json | python -m json.tool

# Test SFCC connectivity manually
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Check if credentials work
curl -u "username:password" \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/
            `} />

            <H2 id="getting-help">🆘 Getting Help</H2>

            <H3 id="collect-diagnostic-information">Collect Diagnostic Information</H3>
            <p><strong>Manual Diagnostic Collection:</strong></p>
            <CodeBlock language="bash" code={`
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
            `} />

            <p><strong>Sensitive Information Handling:</strong></p>
            <CodeBlock language="bash" code={`
# Sanitize logs before sharing
sed 's/password":"[^"]*"/password":"***"/g' dw.json > dw-sanitized.json
sed 's/client-secret":"[^"]*"/client-secret":"***"/g' dw-sanitized.json > dw-safe.json
            `} />

            <H3 id="community-resources">Community Resources</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>GitHub Issues:</strong> <a href="https://github.com/taurgis/sfcc-dev-mcp/issues" className="text-blue-600 hover:text-blue-800 underline">Report bugs and feature requests</a></li>
                <li><strong>Discussions:</strong> <a href="https://github.com/taurgis/sfcc-dev-mcp/discussions" className="text-blue-600 hover:text-blue-800 underline">Community Q&A and discussions</a></li>
                <li><strong>Documentation:</strong> <a href="https://sfcc-mcp-dev.rhino-inquisitor.com/" className="text-blue-600 hover:text-blue-800 underline">Complete documentation</a></li>
            </ul>

            <H3 id="common-error-codes">Common Error Codes</H3>
            <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Error Code</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Solution</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>ECONNREFUSED</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Cannot connect to SFCC instance</td>
                            <td className="border border-gray-300 px-4 py-2">Check hostname and network connectivity</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>401 Unauthorized</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Invalid credentials</td>
                            <td className="border border-gray-300 px-4 py-2">Verify username/password and API credentials</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>403 Forbidden</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Insufficient permissions</td>
                            <td className="border border-gray-300 px-4 py-2">Check Business Manager user permissions</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>404 Not Found</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Resource not found</td>
                            <td className="border border-gray-300 px-4 py-2">Verify endpoint URLs and paths</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>429 Too Many Requests</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Rate limiting</td>
                            <td className="border border-gray-300 px-4 py-2">Implement backoff and retry logic</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>500 Internal Server Error</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">SFCC server error</td>
                            <td className="border border-gray-300 px-4 py-2">Check SFCC instance status and logs</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <H2 id="next-steps">Next Steps</H2>
            <div className="flex flex-wrap gap-4 mt-4">
                <a href="#/configuration" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    📖 Configuration Guide
                </a>
                <a href="#/tools" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    🛠️ Available Tools
                </a>
                <a href="#/examples" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    💡 Examples
                </a>
            </div>
        </>
    );
};

export default TroubleshootingPage;