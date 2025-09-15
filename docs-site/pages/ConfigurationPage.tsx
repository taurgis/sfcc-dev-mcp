import React from 'react';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import useSEO from '../hooks/useSEO';

const ConfigurationPage: React.FC = () => {
  useSEO({
    title: 'Configuration Guide - SFCC Development MCP Server',
    description: 'Complete configuration guide for SFCC Development MCP Server. Learn dw.json setup, environment variables, operating modes, authentication, and security best practices.',
    keywords: 'SFCC MCP configuration, dw.json setup, SFCC authentication, OCAPI credentials, WebDAV configuration, Commerce Cloud API setup, SFCC development environment',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/configuration',
    ogTitle: 'SFCC Development MCP Server Configuration Guide',
    ogDescription: 'Comprehensive configuration guide for SFCC Development MCP Server with authentication, security, and environment setup.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/configuration'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="configuration-guide">⚙️ Configuration Guide</H1>
      
      <div className="prose prose-lg max-w-none">
        <PageSubtitle>
          The SFCC Development MCP Server supports multiple configuration methods to fit different development workflows.
        </PageSubtitle>

        <H2 id="configuration-methods">Configuration Methods</H2>

        <H3 id="method-1-dw-json-file">Method 1: dw.json File (Recommended)</H3>
        <p>The <InlineCode>dw.json</InlineCode> file is the standard SFCC configuration format, compatible with most SFCC tooling.</p>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Basic dw.json Structure</h4>
        <CodeBlock language="json" code={`{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret",
  "site-id": "your-site-id"
}`} />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> The <InlineCode>site-id</InlineCode> field is optional and only needed for site-specific operations.
          </p>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Advanced dw.json Configuration</h4>
        <CodeBlock language="json" code={`{
  "hostname": "dev01-na01-company.demandware.net",
  "username": "your-username",
  "password": "your-password",
  "client-id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "client-secret": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "code-version": "version1",
  "site-id": "RefArch"
}`} />

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Supported fields:</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><InlineCode>hostname</InlineCode> (required) - Your SFCC instance hostname</li>
          <li><InlineCode>username</InlineCode> (required) - Your SFCC username</li>
          <li><InlineCode>password</InlineCode> (required) - Your SFCC password</li>
          <li><InlineCode>client-id</InlineCode> (optional) - OAuth client ID for API access</li>
          <li><InlineCode>client-secret</InlineCode> (optional) - OAuth client secret for API access</li>
          <li><InlineCode>code-version</InlineCode> (optional) - Code version identifier</li>
          <li><InlineCode>site-id</InlineCode> (optional) - Site ID for site-specific operations</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Using dw.json</h4>
        <CodeBlock language="bash" code={`# Specify dw.json path
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Enable debug logging
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug true

# Auto-detect dw.json in current directory
npx sfcc-dev-mcp`} />

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Available command-line options:</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><InlineCode>--dw-json &lt;path&gt;</InlineCode> - Path to your dw.json configuration file</li>
          <li><InlineCode>--debug &lt;true|false&gt;</InlineCode> - Enable debug logging (optional, defaults to false)</li>
        </ul>

        <H3 id="method-2-environment-variables">Method 2: Environment Variables</H3>
        <p>Set environment variables for containerized or CI/CD environments:</p>

        <CodeBlock language="bash" code={`export SFCC_HOSTNAME="your-instance.sandbox.us01.dx.commercecloud.salesforce.com"
export SFCC_USERNAME="your-username"
export SFCC_PASSWORD="your-password"
export SFCC_CLIENT_ID="your-client-id"
export SFCC_CLIENT_SECRET="your-client-secret"

npx sfcc-dev-mcp`} />

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Supported environment variables:</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><InlineCode>SFCC_HOSTNAME</InlineCode> - Your SFCC instance hostname</li>
          <li><InlineCode>SFCC_USERNAME</InlineCode> - Your SFCC username</li>
          <li><InlineCode>SFCC_PASSWORD</InlineCode> - Your SFCC password</li>
          <li><InlineCode>SFCC_CLIENT_ID</InlineCode> - OAuth client ID for API access</li>
          <li><InlineCode>SFCC_CLIENT_SECRET</InlineCode> - OAuth client secret for API access</li>
        </ul>

        <H3 id="method-3-configuration-loading-priority">Method 3: Configuration Loading Priority</H3>
        <p>The server loads configuration in the following order of preference:</p>
        <ol className="list-decimal pl-6 space-y-1">
          <li><strong>Command line <InlineCode>--dw-json</InlineCode> argument</strong> (highest priority)</li>
          <li><strong>Auto-detected dw.json files</strong> in this order:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><InlineCode>./dw.json</InlineCode> (current directory)</li>
              <li><InlineCode>../dw.json</InlineCode> (parent directory)</li>
              <li><InlineCode>../../dw.json</InlineCode> (grandparent directory)</li>
              <li><InlineCode>~/dw.json</InlineCode> (home directory)</li>
            </ul>
          </li>
          <li><strong>Environment variables</strong> (lowest priority)</li>
        </ol>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="bash" code={`# Examples of different approaches
npx sfcc-dev-mcp --dw-json ./config/production.json  # Specific file
npx sfcc-dev-mcp                                     # Auto-detect or env vars`} />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Important: Data API Configuration Required</h4>
          <p className="text-yellow-800">
            For full API functionality, you'll need to configure OCAPI settings in Business Manager. 
            See the <strong>Data API Configuration</strong> section below for required settings.
          </p>
        </div>

                <H2 id="data-api-configuration">🔧 Data API Configuration</H2>
        <p className="text-gray-600 mb-6">
          For system object definition tools (<InlineCode>get_system_object_definitions</InlineCode>, <InlineCode>search_system_object_attribute_definitions</InlineCode>, <InlineCode>search_site_preferences</InlineCode>, etc.), you need additional Business Manager setup.
        </p>

        <H3 id="step-1-create-api-client">Step 1: Create API Client in Account Manager</H3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li><strong>Login to Account Manager</strong>: Go to account.demandware.com (not Business Manager)</li>
            <li><strong>Navigate to API Client</strong> section</li>
            <li><strong>Click Add API Client</strong></li>
            <li><strong>Configure the API client:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li><strong>Name</strong>: <InlineCode>SFCC Dev MCP Server</InlineCode> (or any descriptive name)</li>
                <li><strong>Password</strong>: Generate a secure password</li>
                <li><strong>Scopes</strong>: Select <strong>SFCC</strong> scope</li>
                <li><strong>Roles</strong>: Assign appropriate roles for your organization</li>
              </ul>
            </li>
          </ol>
        </div>

        <H3 id="step-2-configure-data-api-access">Step 2: Configure Data API Access in Business Manager</H3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li><strong>Login to Business Manager</strong> for your instance</li>
            <li><strong>Navigate to</strong>: Administration → Site Development → Open Commerce API Settings</li>
            <li><strong>Click on Data API</strong> tab</li>
            <li><strong>Configure the following settings:</strong></li>
          </ol>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Client Configuration:</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="json" code={`{
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
}`} />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">Required Settings:</h4>
          <ul className="text-green-800 space-y-1">
            <li><strong>Client ID</strong>: Your API client ID (e.g., <InlineCode>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</InlineCode>)</li>
            <li><strong>Methods</strong>: <InlineCode>get</InlineCode> and <InlineCode>post</InlineCode> (required for retrieving and searching)</li>
            <li><strong>Read Attributes</strong>: <InlineCode>(**)</InlineCode> (allows reading all attributes)</li>
            <li><strong>Write Attributes</strong>: <InlineCode>(**)</InlineCode> (may be required for some operations)</li>
          </ul>
        </div>

        <H3 id="step-3-update-configuration">Step 3: Update Your Configuration</H3>
        <p className="text-gray-600 mb-4">Add Data API credentials to your dw.json:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="json" code={`{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username", 
  "password": "your-password",
  "client-id": "your-ocapi-client-id",
  "client-secret": "your-ocapi-client-secret"
}`} />
        </div>

        <H3 id="troubleshooting-data-api-access">🐛 Troubleshooting Data API Access</H3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-red-800 mb-2">Common Issues:</h4>
          <ul className="text-red-800 space-y-2">
            <li><strong>403 Forbidden</strong>: Check that your API client has the correct scopes and roles</li>
            <li><strong>401 Unauthorized</strong>: Verify your client credentials are correct</li>
            <li><strong>Resource not found</strong>: Ensure the resource ID pattern matches exactly</li>
          </ul>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Testing Your Configuration:</h4>
        <p className="text-gray-600 mb-4">Use the MCP tools to test your Data API access:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-8">
          <CodeBlock language="bash" code={`# This will log system object access errors
npx sfcc-dev-mcp --dw-json ./dw.json --debug true`} />
        </div>

        <H2 id="operating-mode-configuration">🎯 Operating Mode Configuration</H2>

        <H3 id="documentation-only-mode">Documentation-Only Mode</H3>
        <p className="text-gray-600 mb-4">No SFCC credentials required - perfect for learning and reference:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="bash" code={`# Run without any credentials
npx sfcc-dev-mcp

# Or explicitly enable debug mode
npx sfcc-dev-mcp --debug true`} />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">Available tools in this mode:</h4>
          <ul className="text-blue-800 space-y-1">
            <li>SFCC API documentation (5 tools)</li>
            <li>Best practices guides (4 tools)</li>
            <li>SFRA documentation (5 tools)</li>
            <li>Cartridge generation (1 tool)</li>
            <li>Total: 15 tools</li>
          </ul>
        </div>

        <H3 id="full-mode">Full Mode</H3>
        <p className="text-gray-600 mb-4">Complete development experience with SFCC instance access:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="bash" code={`# Run with your dw.json file
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Enable debug logging for troubleshooting
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug true`} />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-green-800 mb-2">Available tools in this mode:</h4>
          <ul className="text-green-800 space-y-1">
            <li>All documentation-only tools (15 tools)</li>
            <li>Log analysis tools (13 tools)</li>
            <li>System object management (6 tools)</li>
            <li>Code version control (2 tools)</li>
            <li>Total: 36 tools</li>
          </ul>
        </div>

        <H2 id="security-configuration">🔒 Security Configuration</H2>

        <H3 id="protecting-credentials">Protecting Credentials</H3>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Best Practice: Use .gitignore</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="bash" code={`# Add to your .gitignore file
echo "dw.json" >> .gitignore
echo "*.dw.json" >> .gitignore`} />
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Environment Variable Override</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="bash" code={`# Use dw.json for non-sensitive data, override secrets via environment
export SFCC_CLIENT_SECRET="your-secret"
export SFCC_PASSWORD="your-password"
npx sfcc-dev-mcp --dw-json ./dw.json`} />
        </div>

        <H3 id="file-permissions">File Permissions</H3>
        <p className="text-gray-600 mb-4">Ensure proper file permissions on configuration files:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="bash" code={`# Secure your dw.json file
chmod 600 dw.json

# Verify permissions
ls -la dw.json
# Should show: -rw------- (600)`} />
        </div>

        <H2 id="configuration-examples">📝 Configuration Examples</H2>

        <H3 id="development-environment">Development Environment</H3>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="json" code={`{
  "hostname": "dev01-sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "dev-user@company.com",
  "password": "dev-password",
  "client-id": "development-client-id",
  "client-secret": "development-client-secret",
  "code-version": "dev_branch",
  "site-id": "SiteGenesis"
}`} />
        </div>

        <H3 id="staging-environment">Staging Environment</H3>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="json" code={`{
  "hostname": "staging-sandbox.us01.dx.commercecloud.salesforce.com", 
  "username": "staging-user@company.com",
  "password": "staging-password",
  "client-id": "staging-client-id",
  "client-secret": "staging-client-secret",
  "code-version": "staging_release",
  "site-id": "RefArch"
}`} />
        </div>

        <H3 id="documentation-only-no-credentials">Documentation-Only (No Credentials)</H3>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="json" code={`{}`} />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            <strong>Note:</strong> Empty configuration file works for documentation-only mode, or simply run without any dw.json file.
          </p>
        </div>

        <H2 id="configuration-reference">📋 Configuration Reference</H2>

        <H3 id="configuration-loading-order">Configuration Loading Order</H3>
        <p className="text-gray-600 mb-4">The server loads configuration with the following priority:</p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <div>
                <div className="font-semibold text-gray-900">Command-line arguments</div>
                <div className="text-gray-600 text-sm">
                  <InlineCode>--dw-json /path/to/file.json</InlineCode><br/>
                  <InlineCode>--debug true</InlineCode>
                </div>
                <span className="text-blue-600 text-sm">(highest priority)</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <div>
                <div className="font-semibold text-gray-900">Auto-detected dw.json files</div>
                <div className="text-gray-600 text-sm">
                  <InlineCode>./dw.json</InlineCode> (current directory)<br/>
                  <InlineCode>../dw.json</InlineCode> (parent directory)<br/>
                  <InlineCode>../../dw.json</InlineCode> (grandparent directory)<br/>
                  <InlineCode>~/dw.json</InlineCode> (home directory)
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <div>
                <div className="font-semibold text-gray-900">Environment variables</div>
                <div className="text-gray-600 text-sm">
                  <InlineCode>SFCC_HOSTNAME</InlineCode>, <InlineCode>SFCC_USERNAME</InlineCode>, <InlineCode>SFCC_PASSWORD</InlineCode><br/>
                  <InlineCode>SFCC_CLIENT_ID</InlineCode>, <InlineCode>SFCC_CLIENT_SECRET</InlineCode>
                </div>
                <span className="text-gray-500 text-sm">(lowest priority)</span>
              </div>
            </li>
          </ol>
        </div>

        <H3 id="supported-dw-json-fields">Supported dw.json Fields</H3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Field</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Required</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>hostname</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">Yes</td>
                <td className="px-4 py-3 text-sm">SFCC instance hostname</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>username</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">Yes</td>
                <td className="px-4 py-3 text-sm">SFCC username for WebDAV access</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>password</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">Yes</td>
                <td className="px-4 py-3 text-sm">SFCC password for WebDAV access</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>client-id</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">No</td>
                <td className="px-4 py-3 text-sm">OAuth client ID for OCAPI access</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>client-secret</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">No</td>
                <td className="px-4 py-3 text-sm">OAuth client secret for OCAPI access</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>code-version</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">No</td>
                <td className="px-4 py-3 text-sm">Code version identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm"><InlineCode>site-id</InlineCode></td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">No</td>
                <td className="px-4 py-3 text-sm">Site ID for site-specific operations</td>
              </tr>
            </tbody>
          </table>
        </div>

        <H3 id="tool-availability-by-configuration">Tool Availability by Configuration</H3>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Tool Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Required Fields</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-semibold">Documentation Tools</td>
                <td className="px-4 py-3 text-sm">None</td>
                <td className="px-4 py-3 text-sm">5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold">Best Practices</td>
                <td className="px-4 py-3 text-sm">None</td>
                <td className="px-4 py-3 text-sm">4</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold">SFRA Documentation</td>
                <td className="px-4 py-3 text-sm">None</td>
                <td className="px-4 py-3 text-sm">5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold">Cartridge Generation</td>
                <td className="px-4 py-3 text-sm">None</td>
                <td className="px-4 py-3 text-sm">1</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold">Log Analysis</td>
                <td className="px-4 py-3 text-sm">hostname, username, password</td>
                <td className="px-4 py-3 text-sm">8</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold">System Objects</td>
                <td className="px-4 py-3 text-sm">hostname, client-id, client-secret</td>
                <td className="px-4 py-3 text-sm">6</td>
              </tr>
            </tbody>
          </table>
        </div>

        <H2 id="troubleshooting-configuration-issues">🐛 Troubleshooting Configuration Issues</H2>

        <H3 id="common-issues">Common Issues</H3>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Configuration Loading Problems</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="bash" code={`# Check if dw.json is valid JSON
python -m json.tool dw.json
# or
node -e "console.log(JSON.parse(require('fs').readFileSync('dw.json')))"`} />
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Connection Testing</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="bash" code={`# Test with debug mode to see connection details
npx sfcc-dev-mcp --dw-json ./dw.json --debug true`} />
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Permission Errors</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="bash" code={`# Check file permissions
ls -la dw.json

# Fix permissions if needed
chmod 600 dw.json`} />
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Network Issues</h4>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <CodeBlock language="bash" code={`# Test SFCC connectivity
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com`} />
        </div>

        <H3 id="debug-mode">Debug Mode</H3>
        <p className="text-gray-600 mb-4">Enable debug logging for configuration issues:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <CodeBlock language="bash" code={`# Enable debug mode with explicit flag
npx sfcc-dev-mcp --dw-json ./dw.json --debug true

# Debug mode without value defaults to true
npx sfcc-dev-mcp --dw-json ./dw.json --debug`} />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-blue-800 mb-2">Debug output includes:</h4>
          <ul className="text-blue-800 space-y-1">
            <li>Configuration loading details</li>
            <li>Connection attempt information</li>
            <li>Tool availability status</li>
            <li>Error details and stack traces</li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-2">❌ Authentication Failed</h4>
            <p className="text-gray-600 mb-2"><strong>Problem:</strong> Cannot connect to SFCC instance</p>
            <p className="text-gray-600 mb-2"><strong>Solutions:</strong></p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Verify hostname format: <InlineCode>*.sandbox.us01.dx.commercecloud.salesforce.com</InlineCode></li>
              <li>Check username and password are correct</li>
              <li>Ensure client-id and client-secret are valid</li>
              <li>Try with debug mode to see detailed error messages</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-2">❌ Configuration File Not Found</h4>
            <p className="text-gray-600 mb-2"><strong>Problem:</strong> Cannot locate dw.json file</p>
            <p className="text-gray-600 mb-2"><strong>Solutions:</strong></p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Specify full path: <InlineCode>--dw-json /full/path/to/dw.json</InlineCode></li>
              <li>Create dw.json in current directory</li>
              <li>Use environment variables instead</li>
              <li>Check file permissions</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-2">❌ System Object Access Denied</h4>
            <p className="text-gray-600 mb-2"><strong>Problem:</strong> Cannot access system objects or site preferences</p>
            <p className="text-gray-600 mb-2"><strong>Solutions:</strong></p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Complete Data API configuration in Business Manager</li>
              <li>Verify API client has correct permissions</li>
              <li>Check resource ID patterns match exactly</li>
              <li>Test with a simple system object first</li>
            </ul>
          </div>
        </div>

        <H2 id="next-steps">🔗 Next Steps</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="ai-interface-setup-link">
              <a href="/#/ai-interfaces" className="text-blue-600 hover:text-blue-800">🤖 AI Interface Setup</a>
            </H3>
            <p className="text-gray-600 text-sm">Configure your preferred AI assistant to work with the MCP server</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="available-tools-link">
              <a href="/#/tools" className="text-blue-600 hover:text-blue-800">🛠️ Available Tools</a>
            </H3>
            <p className="text-gray-600 text-sm">Explore all 36 tools and their capabilities</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="examples-link">
              <a href="/#/examples" className="text-blue-600 hover:text-blue-800">💡 Examples</a>
            </H3>
            <p className="text-gray-600 text-sm">See real-world usage examples and AI assistant interactions</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="troubleshooting-link">
              <a href="/#/troubleshooting" className="text-blue-600 hover:text-blue-800">🐛 Troubleshooting</a>
            </H3>
            <p className="text-gray-600 text-sm">Common issues and debugging techniques</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
