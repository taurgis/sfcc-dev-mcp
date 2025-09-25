import React from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import Collapsible from '../components/Collapsible';
import Badge from '../components/Badge';
import { SITE_DATES } from '../constants';

const TroubleshootingPage: React.FC = () => {
    const troubleshootingStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Troubleshooting & Debugging - SFCC Development MCP Server",
        "description": "Common issues and solutions for the SFCC Development MCP Server. Includes authentication problems, network connectivity, AI interface integration, and debugging tips.",
        "author": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "publisher": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "datePublished": SITE_DATES.PUBLISHED,
        "dateModified": SITE_DATES.MODIFIED,
        "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/troubleshooting/",
        "mainEntity": {
            "@type": "Guide",
            "name": "SFCC MCP Troubleshooting Guide"
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <SEO 
                title="Troubleshooting & Debugging"
                description="Common issues and solutions for the SFCC Development MCP Server. Includes authentication problems, network connectivity, AI interface integration, and debugging tips."
                keywords="SFCC troubleshooting, Commerce Cloud debugging, MCP server issues, SFCC authentication problems, OCAPI troubleshooting, WebDAV issues"
                canonical="/troubleshooting/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Troubleshooting", url: "/troubleshooting/" }
            ]} />
            <StructuredData data={troubleshootingStructuredData} />
            
            <H1 id="troubleshooting">🐛 Troubleshooting & Debugging</H1>
            <PageSubtitle>Quick solutions to get you back to developing SFCC features with AI assistance.</PageSubtitle>
            <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">Surface: <strong>36+ specialized tools</strong> (docs, best practices, SFRA, cartridge gen, runtime logs, job logs, system & custom objects, site preferences, code versions)</p>

            {/* Quick Diagnostics Checklist */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                    ⚡ Quick Diagnostics Checklist
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Basic Checks</h3>
                        <ul className="space-y-1 text-sm">
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Node.js 18+ installed</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Package installed via npm</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Valid dw.json file (600 permissions)</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SFCC instance is active</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Quick Test</h3>
                        <CodeBlock language="bash" code="npx sfcc-dev-mcp --debug" />
                        <p className="text-xs text-blue-700 mt-1">Should start without errors.</p>
                    </div>
                </div>
            </div>

            <H2 id="startup-issues">🚀 Startup & Connectivity Issues</H2>

            <Collapsible title="Server Won't Start" intent="danger" id="server-wont-start" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <Badge variant="error" size="sm" className="mt-1">Common</Badge>
                            <h4 className="font-semibold">Node.js Version Mismatch</h4>
                        </div>
                        <CodeBlock language="bash" code={`# Check version (requires 18+)
node --version

# Update if needed
nvm install 18 && nvm use 18`} />
                        
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-4">
                            <h5 className="font-semibold text-orange-800 mb-2">Working with Older SFRA/SiteGenesis Projects</h5>
                            <p className="text-sm text-orange-700 mb-3">
                                When working with older SFRA or SiteGenesis projects that require Node.js 8, 12, or 16, 
                                you need to set a higher Node.js version as the <strong>default</strong> for MCP to work. 
                                Simply switching via <InlineCode>nvm use</InlineCode> is not sufficient.
                            </p>
                            <CodeBlock language="bash" code={`# Set Node 24 as default for MCP compatibility
nvm alias default 24

# For project work, switch to older version as needed
nvm use 12.22.6

# Verify MCP still works with npx
npx sfcc-dev-mcp --version`} />
                            <p className="text-xs text-orange-600 mt-2">
                                <strong>Why this works:</strong> npx uses the default Node version for global packages, 
                                while your terminal session can use a different version for project compilation.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <Badge variant="warning" size="sm" className="mt-1">Frequent</Badge>
                            <h4 className="font-semibold">File Permission Issues</h4>
                        </div>
                        <CodeBlock language="bash" code={`# Fix dw.json permissions
chmod 600 dw.json

# Verify permissions
ls -la dw.json
# Should show: -rw------- (600)`} />
                    </div>

                    <div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <Badge variant="info" size="sm" className="mt-1">Setup</Badge>
                            <h4 className="font-semibold">Package Installation</h4>
                        </div>
                        <CodeBlock language="bash" code={`# Global installation
npm install -g sfcc-dev-mcp

# Or use npx (recommended)
npx sfcc-dev-mcp --version`} />
                    </div>
                </div>
            </Collapsible>

            <Collapsible title="AI Interface Not Connecting" intent="warn" id="ai-not-connecting" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Claude Desktop Configuration</h4>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h5 className="font-medium mb-2">Config File Locations:</h5>
                            <ul className="text-sm space-y-1">
                                <li><strong>macOS:</strong> <InlineCode>~/Library/Application Support/Claude/</InlineCode></li>
                                <li><strong>Windows:</strong> <InlineCode>%APPDATA%\Claude\</InlineCode></li>
                                <li><strong>Linux:</strong> <InlineCode>~/.config/Claude/</InlineCode></li>
                            </ul>
                        </div>
                        
                        <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/absolute/path/to/dw.json"]
    }
  }
}`} />
                        
                        <div className="mt-3">
                            <h5 className="font-medium mb-1">Validation Commands:</h5>
                            <CodeBlock language="bash" code={`# Validate JSON syntax
python -m json.tool claude_desktop_config.json

# Test server manually
npx sfcc-dev-mcp --debug`} />
                        </div>
                    </div>
                </div>
            </Collapsible>

            <H2 id="authentication-issues">🔐 Authentication & Credentials</H2>

            <Collapsible title="SFCC Authentication Failures" intent="danger" id="sfcc-auth-failures" className="mb-6">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-red-700 mb-2">Common Symptoms</h4>
                            <ul className="text-sm space-y-1">
                                <li>401 Unauthorized errors</li>
                                <li>System object tools failing</li>
                                <li>Log analysis not working</li>
                                <li>"OAuth authentication failed"</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-700 mb-2">Quick Test</h4>
                            <CodeBlock language="bash" code={`# Test connectivity
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com`} />
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Update dw.json Credentials</h4>
                        <CodeBlock language="json" code={`{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "current-username",
  "password": "current-password",
  "client-id": "current-client-id",
  "client-secret": "current-client-secret",
  "site-id": "SiteGenesis",
  "code-version": "version1"
}`} />
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Business Manager Permissions</h4>
                        <ol className="text-sm space-y-1">
                            <li>1. Login to Business Manager</li>
                            <li>2. Administration → Organization → Users</li>
                            <li>3. Verify "Administrator" or "Developer" role</li>
                            <li>4. Check OCAPI Settings in Site Development</li>
                        </ol>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Regenerate API Credentials</h4>
                        <p className="text-sm mb-2">Go to Account Manager → API Client → Create new client</p>
                        <CodeBlock language="bash" code={`# Test new credentials
curl -X POST \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/dw/oauth2/access_token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials&client_id=NEW_ID&client_secret=NEW_SECRET"`} />
                    </div>
                </div>
            </Collapsible>

            <H2 id="tool-issues">📊 Tool-Specific Issues</H2>

            <Collapsible title="Log Analysis Tools Not Working" intent="warn" id="log-tools-failing" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <Badge variant="error" size="sm" className="mt-1">Common</Badge>
                            <h4 className="font-semibold">"No logs found" Error</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Usually caused by WebDAV access issues</p>
                        <CodeBlock language="bash" code={`# Test WebDAV access
curl -u "username:password" \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Logs/`} />
                    </div>

                    <div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <Badge variant="warning" size="sm" className="mt-1">Frequent</Badge>
                            <h4 className="font-semibold">Wrong Date Format</h4>
                        </div>
                        <CodeBlock language="javascript" code={`// ✅ Correct format (YYYYMMDD)
get_latest_error({ date: "20241218" })

// ❌ Wrong formats
get_latest_error({ date: "2024-12-18" })
get_latest_error({ date: "12/18/2024" })`} />
                    </div>

                    <div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <Badge variant="info" size="sm" className="mt-1">Check</Badge>
                            <h4 className="font-semibold">Instance Activity</h4>
                        </div>
                        <ul className="text-sm space-y-1">
                            <li>Ensure SFCC instance is active</li>
                            <li>Check if logs are being generated</li>
                            <li>Verify log retention settings</li>
                        </ul>
                    </div>
                </div>
            </Collapsible>

            <Collapsible title="System & Custom Object / Site Preference Tools Failing" intent="warn" id="system-object-issues" className="mb-6">
                                <div className="space-y-6">
                                        <div>
                                                <h4 className="font-semibold mb-2">Canonical Data API Resource Mapping (Matches Configuration Page)</h4>
                                                <p className="text-sm text-gray-600 mb-3">Business Manager → Administration → Site Development → Open Commerce API Settings → Data API tab. Add (or verify) a client with the resources below. This is the <strong>source of truth</strong> for all metadata, search and code version tools.</p>
                                                <CodeBlock language="json" code={`{
    "_v": "23.2",
    "clients": [{
        "client_id": "YOUR_CLIENT_ID",
        "resources": [
            { "resource_id": "/system_object_definitions", "methods": ["get"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/system_object_definitions/*", "methods": ["get"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/system_object_definition_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/system_object_definitions/*/attribute_definition_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/system_object_definitions/*/attribute_group_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/custom_object_definitions/*/attribute_definition_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/site_preferences/preference_groups/*/*/preference_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/code_versions", "methods": ["get"], "read_attributes": "(**)", "write_attributes": "(**)" },
            { "resource_id": "/code_versions/*", "methods": ["get", "patch"], "read_attributes": "(**)", "write_attributes": "(**)" }
        ]
    }]
}`} />
                                                <ul className="mt-4 text-xs text-gray-600 space-y-1 list-disc pl-5">
                                                    <li><strong>Search endpoints use POST</strong> (definition_search / preference_search) – required for filtering & pagination tools.</li>
                                                    <li><strong>(**)</strong> read/write attributes maximize introspection; narrow later for principle-of-least-privilege.</li>
                                                    <li><strong>code_versions/* patch</strong> enables activation (switch active code version).</li>
                                                    <li>Older examples using <InlineCode>/site_preferences/*</InlineCode> or <InlineCode>/custom_object_definitions/*</InlineCode> with only <InlineCode>get</InlineCode> are incomplete for search tools.</li>
                                                    <li>Password-type site preference values remain masked—design constraint, not a permission issue.</li>
                                                </ul>
                                        </div>
                                        <div>
                                                <h4 className="font-semibold mb-2">Client Scope Requirements</h4>
                                                <p className="text-sm text-gray-600 mb-2">Account Manager → API Client must include scopes:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="info">SALESFORCE_COMMERCE_API:CONFIGURE</Badge>
                                                    <Badge variant="info">SALESFORCE_COMMERCE_API:READ_ONLY</Badge>
                                                </div>
                                        </div>
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                                <h4 className="font-semibold text-yellow-800 mb-2">Empty Search Results?</h4>
                                                <ul className="list-disc pl-5 text-xs space-y-1 text-yellow-800">
                                                    <li>Confirm <InlineCode>definition_search</InlineCode> endpoints are present (POST) – not just wildcard GET.</li>
                                                    <li>Remove filters: use <InlineCode>match_all_query</InlineCode> then refine client-side.</li>
                                                    <li>Check attribute group existence with <InlineCode>search_system_object_attribute_groups</InlineCode>.</li>
                                                    <li>Validate client_id matches dw.json entry (no trailing spaces).</li>
                                                    <li>Rare replication lag? Wait 1–2 minutes after BM changes.</li>
                                                </ul>
                                        </div>
                                </div>
            </Collapsible>

            <Collapsible title="Job Log Tools Issues" intent="info" id="job-log-issues" className="mb-6">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Job Log Access</h4>
                        <p className="text-sm text-gray-600 mb-3">Job logs are stored in deeper folder structure: <InlineCode>/Logs/jobs/[job-name-id]/</InlineCode> (all levels in a single file).</p>
                        <CodeBlock language="bash" code={`# Test job log access root
curl -u "username:password" \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Logs/jobs/`} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Minimal Health Flow</h4>
                        <CodeBlock language="bash" code={`# 1. Name filter (fast existence check)
aegis query search_job_logs_by_name 'jobName:MyJob|limit:3'
# 2. Tail entries
aegis query get_job_log_entries 'jobName:MyJob|limit:40'
# 3. Summary
aegis query get_job_execution_summary 'jobName:MyJob'`} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">No Logs Returned?</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                          <li>Confirm job executed recently</li>
                          <li>Check filename prefix (Job-)</li>
                          <li>Limit too small (increase to 100)</li>
                          <li>WebDAV credential mismatch</li>
                        </ul>
                    </div>
                </div>
            </Collapsible>

            <H2 id="ai-interfaces">🤖 AI Interface Setup</H2>

            <Collapsible title="GitHub Copilot Integration" intent="info" id="github-copilot-setup" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Instructions File Location</h4>
                        <p className="text-sm text-gray-600 mb-2">File must be in project root for VS Code to detect:</p>
                        <CodeBlock language="bash" code={`# Verify file exists
ls -la .github/copilot-instructions.md

# Check VS Code Copilot extension
code --list-extensions | grep copilot`} />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-800 mb-2">Troubleshooting Steps</h5>
                        <ul className="text-sm space-y-1">
                            <li>Ensure GitHub Copilot subscription is active</li>
                            <li>Update VS Code Copilot extension</li>
                            <li>Restart VS Code to reload instructions</li>
                            <li>Check if instructions file is in correct location</li>
                        </ul>
                    </div>
                </div>
            </Collapsible>

            <Collapsible title="Cursor Editor Setup" intent="info" id="cursor-setup" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Rules Directory Structure</h4>
                        <CodeBlock language="bash" code={`# Check rules directory
ls -la .cursor/

# Verify rule files
find .cursor -name "*.md" -o -name "*.mdc"`} />
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Common Issues</h4>
                        <ul className="text-sm space-y-1">
                            <li>Rules directory doesn't exist</li>
                            <li>Wrong file extension (.md vs .mdc)</li>
                            <li>Cursor version compatibility</li>
                        </ul>
                    </div>
                </div>
            </Collapsible>

            <H2 id="performance-debug">🔍 Performance & Debug</H2>

            <Collapsible title="Enable Debug Logging" intent="plain" id="debug-logging" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Debug Mode Commands</h4>
                        <CodeBlock language="bash" code={`# Enable debug mode
npx sfcc-dev-mcp --debug --dw-json /Users/username/sfcc-project/dw.json

# Documentation-only debug mode
npx sfcc-dev-mcp --debug

# Disable debug explicitly
npx sfcc-dev-mcp --debug false --dw-json /Users/username/sfcc-project/dw.json`} />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                            <strong>Note:</strong> Environment variables like <InlineCode>DEBUG=sfcc-dev-mcp:*</InlineCode> are not supported. 
                            Use the <InlineCode>--debug</InlineCode> command-line argument.
                        </p>
                    </div>
                </div>
            </Collapsible>

            <Collapsible title="Log File Locations" intent="plain" id="log-locations" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">OS-Specific Paths</h4>
                        <div className="space-y-2 text-sm">
                            <div><strong>macOS:</strong> <InlineCode>/var/folders/{'{user-id}'}/T/sfcc-mcp-logs/</InlineCode></div>
                            <div><strong>Linux:</strong> <InlineCode>/tmp/sfcc-mcp-logs/</InlineCode></div>
                            <div><strong>Windows:</strong> <InlineCode>%TEMP%\sfcc-mcp-logs\</InlineCode></div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-2">Find Your Path</h4>
                        <CodeBlock language="bash" code={`# Get exact path
node -e "console.log(require('os').tmpdir() + '/sfcc-mcp-logs')"`} />
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Generated Log Files</h4>
                        <ul className="text-sm space-y-1">
                            <li><InlineCode>sfcc-mcp-info.log</InlineCode> - Startup and informational messages</li>
                            <li><InlineCode>sfcc-mcp-warn.log</InlineCode> - Warning messages</li>
                            <li><InlineCode>sfcc-mcp-error.log</InlineCode> - Error messages and stack traces</li>
                            <li><InlineCode>sfcc-mcp-debug.log</InlineCode> - Debug messages (when --debug enabled)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">View Logs Real-Time</h4>
                        <CodeBlock language="bash" code={`# macOS - Find and tail error logs
find /var/folders -name "sfcc-mcp-error.log" 2>/dev/null | head -1 | xargs tail -f

# Linux - Direct path
tail -f /tmp/sfcc-mcp-logs/sfcc-mcp-error.log

# Windows - PowerShell
Get-Content -Wait "$env:TEMP\\sfcc-mcp-logs\\sfcc-mcp-error.log"`} />
                    </div>
                </div>
            </Collapsible>

            <Collapsible title="Testing & Validation" intent="plain" id="testing-validation" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Basic Functionality Tests</h4>
                        <CodeBlock language="bash" code={`# Test documentation-only mode
npx sfcc-dev-mcp

# Test with debug mode
npx sfcc-dev-mcp --debug

# Test with SFCC credentials
npx sfcc-dev-mcp --dw-json /Users/username/sfcc-project/dw.json --debug`} />
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Manual Validation</h4>
                        <CodeBlock language="bash" code={`# Validate dw.json syntax
python -m json.tool dw.json

# Test SFCC connectivity
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com

# Test WebDAV access
curl -u "username:password" \\
  https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/`} />
                    </div>
                </div>
            </Collapsible>

            <H2 id="getting-help">🆘 Getting Help</H2>

            <Collapsible title="Collect Support Information" intent="info" id="support-info" className="mb-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Diagnostic Data Collection</h4>
                        <CodeBlock language="bash" code={`# System information
echo "Node.js: $(node --version)" > debug-info.txt
echo "npm: $(npm --version)" >> debug-info.txt
echo "OS: $(uname -a)" >> debug-info.txt

# Package version
npm list sfcc-dev-mcp >> debug-info.txt 2>&1

# dw.json structure (sanitized)
cat dw.json | jq 'keys' >> debug-info.txt 2>/dev/null`} />
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h5 className="font-semibold text-red-800 mb-2">⚠️ Sanitize Sensitive Data</h5>
                        <CodeBlock language="bash" code={`# Remove sensitive information before sharing
sed 's/password":"[^"]*"/password":"***"/g' dw.json > dw-safe.json
sed 's/client-secret":"[^"]*"/client-secret":"***"/g' dw-safe.json > dw-final.json`} />
                    </div>
                </div>
            </Collapsible>

            <Collapsible title="Common Error Codes" intent="plain" id="error-codes" className="mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Error Code</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Meaning</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Quick Fix</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><Badge variant="error" size="sm">ECONNREFUSED</Badge></td>
                                <td className="border border-gray-300 px-4 py-2">Cannot connect to SFCC</td>
                                <td className="border border-gray-300 px-4 py-2">Check hostname and network</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><Badge variant="error" size="sm">401</Badge></td>
                                <td className="border border-gray-300 px-4 py-2">Invalid credentials</td>
                                <td className="border border-gray-300 px-4 py-2">Update username/password/API keys</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><Badge variant="warning" size="sm">403</Badge></td>
                                <td className="border border-gray-300 px-4 py-2">Insufficient permissions / missing OCAPI resource</td>
                                <td className="border border-gray-300 px-4 py-2">Add required resource entry & redeploy settings</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><Badge variant="warning" size="sm">404</Badge></td>
                                <td className="border border-gray-300 px-4 py-2">Resource not found</td>
                                <td className="border border-gray-300 px-4 py-2">Verify URLs and paths</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><Badge variant="info" size="sm">409</Badge></td>
                                <td className="border border-gray-300 px-4 py-2">Concurrent code version activation</td>
                                <td className="border border-gray-300 px-4 py-2">Retry after ensuring no parallel activation</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><Badge variant="info" size="sm">429</Badge></td>
                                <td className="border border-gray-300 px-4 py-2">Rate limiting</td>
                                <td className="border border-gray-300 px-4 py-2">Wait and retry</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Collapsible>

            {/* Next Steps */}
            <div className="mb-24">
                <div className="text-center mb-8">
                    <h2 id="next-steps-troubleshooting" className="text-2xl font-bold text-gray-900 mb-2">🔗 Next Steps</h2>
                    <PageSubtitle className="text-base text-gray-600">Now that you've resolved your issues, explore the full capabilities.</PageSubtitle>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <NavLink to="/configuration/" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline">
                        Configuration Guide
                        <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </NavLink>
                    <NavLink to="/tools/" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline">
                        Available Tools
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default TroubleshootingPage;