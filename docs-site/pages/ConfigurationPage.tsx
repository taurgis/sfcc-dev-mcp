import React from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { PageSubtitle, H2, H3 } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import ConfigHero from '../components/ConfigHero';
import ConfigModeTabs from '../components/ConfigModeTabs';
import ConfigBuilder from '../components/ConfigBuilder';
import { SITE_DATES } from '../constants';
import Collapsible from '../components/Collapsible';

const ConfigurationPage: React.FC = () => {
  const configurationStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Configuration Guide - SFCC Development MCP Server",
  "description": "Complete configuration guide for SFCC Development MCP Server. Learn dw.json setup, environment variables, operating modes, authentication, security best practices, and how to enable logs, job logs, system & custom objects, site preferences, and code versions.",
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
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/configuration/",
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "SFCC Development MCP Server",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Node.js",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <SEO 
        title="Configuration Guide"
  description="Complete configuration guide for SFCC Development MCP Server. Learn dw.json setup, environment variables, operating modes, authentication, security best practices, and how to enable logs, job logs, system & custom objects, site preferences, and code versions."
        keywords="SFCC MCP configuration, dw.json setup, SFCC authentication, OCAPI credentials, WebDAV configuration, Commerce Cloud API setup, SFCC development environment"
        canonical="/configuration/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Configuration", url: "/configuration/" }
      ]} />
      <StructuredData structuredData={configurationStructuredData} />
      
      <ConfigHero />
      <div className="mb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-blue-100">
          <div className="text-center mb-10">
            <H2 id="quick-start" className="text-3xl font-bold mb-3">🚀 Quick Start</H2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg">Pick a mode, generate <InlineCode>dw.json</InlineCode>, run the server. Minimal friction, fast feedback.</p>
          </div>
          <ConfigModeTabs />
      </div>

      <div className="mb-16 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-8 shadow-xl border border-amber-100">
          <div className="text-center mb-8">
            <H2 id="config-discovery" className="text-2xl font-bold mb-3">🔍 Configuration Discovery</H2>
            <p className="text-gray-700 max-w-3xl mx-auto">The server discovers SFCC credentials automatically using this priority order:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border-2 border-amber-300 p-6 shadow-md relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">1</div>
              <h4 className="font-semibold text-lg mb-2 text-amber-800">CLI Parameter</h4>
              <p className="text-sm text-gray-600 mb-3">Explicit path via <InlineCode>--dw-json</InlineCode></p>
              <CodeBlock language="bash" code={`npx sfcc-dev-mcp --dw-json /path/to/dw.json`} />
              <p className="text-xs text-amber-700 mt-2">Highest priority – always takes precedence</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">2</div>
              <h4 className="font-semibold text-lg mb-2">Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-3">Set credentials via environment</p>
              <CodeBlock language="bash" code={`export SFCC_HOSTNAME="..."\nexport SFCC_USERNAME="..."\nexport SFCC_PASSWORD="..."`} />
              <p className="text-xs text-gray-500 mt-2">Great for CI/CD or sensitive secrets</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-green-300 p-6 shadow-md relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">3</div>
              <h4 className="font-semibold text-lg mb-2 text-green-800">Workspace Auto-Discovery</h4>
              <p className="text-sm text-gray-600 mb-3">Automatic for VS Code users</p>
              <p className="text-sm text-gray-700">Just open a workspace with a <InlineCode>dw.json</InlineCode> file – the server discovers it automatically!</p>
              <p className="text-xs text-green-700 mt-2">✨ Recommended for VS Code/Copilot users</p>
            </div>
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>💡 How it works:</strong> When no CLI path or environment variables are set, the server starts in documentation-only mode. After VS Code connects, the MCP workspace roots capability automatically discovers your project's <InlineCode>dw.json</InlineCode> and unlocks authenticated tools based on your available credentials (logs/job logs with <InlineCode>username/password</InlineCode>; Data API tools when <InlineCode>client-id</InlineCode>/<InlineCode>client-secret</InlineCode> are present).
          </div>
      </div>

      <div className="mb-20 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-emerald-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <H2 id="interactive-config" className="text-2xl font-bold mb-2">🧪 Interactive dw.json Builder</H2>
              <p className="text-sm text-gray-600 max-w-xl">Start minimal (only <InlineCode>hostname</InlineCode> + <InlineCode>username/password</InlineCode> for runtime & job logs). Add Data API credentials when you need system & custom objects, site preferences or code version tooling.</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 max-w-sm">
              <p className="font-semibold mb-1">Tips</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Keep separate <InlineCode>dw.dev.json</InlineCode> / <InlineCode>dw.qa.json</InlineCode></li>
                <li>Use env vars to override secrets in CI</li>
                <li>Remove unused OAuth fields to stay minimal</li>
              </ul>
            </div>
          </div>
          <ConfigBuilder />
      </div>
      <div className="space-y-20 mb-20">
        <div className="space-y-16">
          <section id="data-api" className="scroll-mt-24">
            <div className="mb-4 space-y-2">
              <span className="inline-block bg-yellow-100 text-yellow-700 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide uppercase">Optional – Enables Data API Tools</span>
              <h2 id="data-api-configuration" className="text-2xl font-bold text-gray-900">🔧 Data API Configuration</h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Required for system object definitions, custom object attribute searches, site preferences & code version tools. Not required for runtime logs or job log analysis (basic auth only). Skip entirely if you only need docs + log visibility.</p>
            <div className="space-y-6">
            <Collapsible id="api-client" title="Step 1: Create API Client (Account Manager)" intent="info" defaultOpen>
              <ol className="list-decimal list-inside space-y-1">
                <li>Login to <strong>Account Manager</strong> (not Business Manager)</li>
                <li>Navigate to <strong>API Client</strong> → Add API Client</li>
                <li>Set name (e.g. <InlineCode>SFCC Dev MCP</InlineCode>) & generate password</li>
                <li>Select <strong>SFCC</strong> scope and grant required roles</li>
              </ol>
            </Collapsible>
            <Collapsible id="bm-settings" title="Step 2: Business Manager Data API Settings" intent="warn">
              <ol className="list-decimal list-inside space-y-1 mb-4">
                <li>Business Manager → Administration → Site Development → Open Commerce API Settings</li>
                <li>Open the <strong>Data API</strong> tab</li>
                <li>Add client with required resources (below)</li>
              </ol>
              <CodeBlock language="json" code={`{\n  \"_v\": \"23.2\",\n  \"clients\": [{\n    \"client_id\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n    \"resources\": [\n      { \"resource_id\": \"/system_object_definitions\", \"methods\": [\"get\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/system_object_definitions/*\", \"methods\": [\"get\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/system_object_definition_search\", \"methods\": [\"post\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/system_object_definitions/*/attribute_definition_search\", \"methods\": [\"post\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/system_object_definitions/*/attribute_group_search\", \"methods\": [\"post\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/custom_object_definitions/*/attribute_definition_search\", \"methods\": [\"post\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/site_preferences/preference_groups/*/*/preference_search\", \"methods\": [\"post\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/code_versions\", \"methods\": [\"get\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" },\n      { \"resource_id\": \"/code_versions/*\", \"methods\": [\"get\", \"patch\"], \"read_attributes\": \"(**)\", \"write_attributes\": \"(**)\" }\n    ]\n  }]\n}\n`} />
              <ul className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-4 mt-4 space-y-1">
                <li><strong>Client ID</strong> must match your credentials</li>
                <li>Allow <InlineCode>get</InlineCode>/<InlineCode>post</InlineCode> for search + retrieval (and <InlineCode>patch</InlineCode> for code version activation)</li>
                <li><InlineCode>(**)</InlineCode> attributes needed for broad introspection</li>
              </ul>
            </Collapsible>
            <Collapsible id="update-config" title="Step 3: Update dw.json" intent="plain">
              <CodeBlock language="json" code={`{\n  \"hostname\": \"your-instance.sandbox.us01.dx.commercecloud.salesforce.com\",\n  \"username\": \"your-username\",\n  \"password\": \"your-password\",\n  \"client-id\": \"your-ocapi-client-id\",\n  \"client-secret\": \"your-ocapi-client-secret\"\n}`} />
              <p className="text-[11px] text-gray-500 -mt-3">Add <InlineCode>client-id</InlineCode>/<InlineCode>client-secret</InlineCode> only when you need Data API tooling (system & custom objects, site preferences, code versions). Omit for docs + log visibility only.</p>
            </Collapsible>
            <Collapsible id="data-api-troubleshooting" title="Troubleshooting Data API Access" intent="danger">
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li><strong>403</strong>: Missing scope/role – verify Account Manager roles + BM resource mapping</li>
                <li><strong>401</strong>: Credential mismatch – regenerate client secret</li>
                <li><strong>Missing resource</strong>: Pattern mismatch – copy exact resource IDs above</li>
              </ul>
              <CodeBlock language="bash" code={`npx sfcc-dev-mcp --dw-json /Users/username/sfcc-project/dw.json --debug true`} />
            </Collapsible>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Total surface: 38 tools spanning documentation, SFRA, ISML, agent instructions, cartridge generation, runtime logs, job logs, system & custom objects, site preferences, and code versions.</p>
          </section>
          <section id="security" className="scroll-mt-24 space-y-6">
            <div className="mb-4 space-y-2">
              <span className="inline-block bg-blue-100 text-blue-700 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide uppercase">Protect Credentials</span>
              <h2 id="security-basics" className="text-2xl font-bold text-gray-900">🔒 Security Basics</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h4 className="font-semibold text-sm mb-3">.gitignore</h4>
                <CodeBlock language="bash" code={`echo 'dw.json' >> .gitignore\necho '*.dw.json' >> .gitignore`} />
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h4 className="font-semibold text-sm mb-3">Environment Overrides</h4>
                <CodeBlock language="bash" code={`export SFCC_CLIENT_SECRET=\"your-secret\"\nexport SFCC_PASSWORD=\"your-password\"\n\nnpx sfcc-dev-mcp --dw-json /Users/username/sfcc-project/dw.json`} />
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h4 className="font-semibold text-sm mb-3">Permissions</h4>
                <CodeBlock language="bash" code={`chmod 600 dw.json\nls -la dw.json`} />
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h4 className="font-semibold text-sm mb-3">Debug Mode</h4>
                <CodeBlock language="bash" code={`npx sfcc-dev-mcp --dw-json /Users/username/sfcc-project/dw.json --debug true`} />
        </div>
            </div>
          </section>
          <section id="reference" className="scroll-mt-24 space-y-8">
            <div className="mb-4 space-y-2">
              <span className="inline-block bg-purple-100 text-purple-700 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide uppercase">Reference</span>
              <h2 id="key-reference-tables" className="text-2xl font-bold text-gray-900">📋 Key Reference Tables</h2>
            </div>
            <div>
              <H3 id="field-reference" className="text-lg font-semibold mb-3">Supported dw.json Fields</H3>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b">Field</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b">Required For</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">hostname</td>
                      <td className="px-3 py-2 text-xs">All authenticated tools</td>
                      <td className="px-3 py-2 text-xs">Sandbox domain</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">username/password</td>
                      <td className="px-3 py-2 text-xs">Logs & Job Logs (WebDAV)</td>
                      <td className="px-3 py-2 text-xs">WebDAV auth (runtime + job log files)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">client-id/secret</td>
                      <td className="px-3 py-2 text-xs">System & custom objects, site prefs, code versions</td>
                      <td className="px-3 py-2 text-xs">OCAPI Data API + code version management</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">code-version</td>
                      <td className="px-3 py-2 text-xs">Code version operations</td>
                      <td className="px-3 py-2 text-xs">Optional</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">site-id</td>
                      <td className="px-3 py-2 text-xs">Site-specific actions</td>
                      <td className="px-3 py-2 text-xs">Optional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <H3 id="tool-availability" className="text-lg font-semibold mb-3">Tool Availability by Mode</H3>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b">Category</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b">Docs Only</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b">Authenticated (Capability-Gated)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">Documentation</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">Agent Instructions (AGENTS.md + Skills)</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">SFRA Docs</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">ISML Docs</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">Cartridge Generation</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                      <td className="px-3 py-2 text-xs">✔</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">Log Analysis (runtime)</td>
                      <td className="px-3 py-2 text-xs">—</td>
                      <td className="px-3 py-2 text-xs">✔ (requires WebDAV-capable creds)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">Job Logs</td>
                      <td className="px-3 py-2 text-xs">—</td>
                      <td className="px-3 py-2 text-xs">✔ (requires WebDAV-capable creds)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">System & Custom Objects / Site Prefs</td>
                      <td className="px-3 py-2 text-xs">—</td>
                      <td className="px-3 py-2 text-xs">✔ (requires client-id/client-secret)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium">Code Versions</td>
                      <td className="px-3 py-2 text-xs">—</td>
                      <td className="px-3 py-2 text-xs">✔ (requires client-id/client-secret)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          <section id="troubleshooting" className="scroll-mt-24 space-y-6">
            <div className="mb-4 space-y-2">
              <span className="inline-block bg-red-100 text-red-700 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide uppercase">Common Issues</span>
              <h2 id="troubleshooting" className="text-2xl font-bold text-gray-900">🐛 Troubleshooting</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">Auth Failed</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Verify hostname format</li>
                  <li>Check username/password</li>
                  <li>Match client-id/secret</li>
                  <li>Run with <InlineCode>--debug</InlineCode></li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">dw.json Not Found</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Open workspace with dw.json (auto-discovery)</li>
                  <li>Or use <InlineCode>--dw-json /path/to/dw.json</InlineCode></li>
                  <li>Or set env vars instead</li>
                  <li>Check file permissions (600)</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">System Object Denied</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Complete Data API config</li>
                  <li>Verify resource IDs</li>
                  <li>Ensure (**) attributes</li>
                  <li>Check client roles</li>
                </ul>
              </div>
            </div>
          </section>
  </div>
      </div>
      <div className="mb-24">
        <div className="text-center mb-8">
          <h2 id="next-steps" className="text-2xl font-bold text-gray-900 mb-2">🔗 Next Steps</h2>
          <PageSubtitle className="text-base text-gray-600">Pick your next path—feature surface or concrete tool list.</PageSubtitle>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink to="/features/" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline">
            Features Overview
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

export default ConfigurationPage;
