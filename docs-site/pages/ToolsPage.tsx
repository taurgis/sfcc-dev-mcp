import React from 'react';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { InlineCode } from '../components/CodeBlock';
import useSEO from '../hooks/useSEO';

const ToolsPage: React.FC = () => {
  useSEO({
    title: 'Available Tools & APIs - SFCC Development MCP Server',
    description: 'Complete reference of SFCC Development MCP Server tools and APIs. Documentation tools, log analysis, system objects, cartridge generation, best practices, and development utilities.',
    keywords: 'SFCC MCP tools, Commerce Cloud APIs, SFCC documentation tools, log analysis APIs, system object tools, cartridge tools, SFCC development APIs, MCP server tools reference',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/tools',
    ogTitle: 'SFCC Development MCP Server - Tools & APIs Reference',
    ogDescription: 'Complete reference guide for all SFCC Development MCP Server tools and APIs with detailed documentation and examples.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/tools'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="available-tools">🛠️ Available Tools</H1>
      
      <div className="prose prose-lg max-w-none">
        <PageSubtitle>
          The SFCC Development MCP Server provides 36 specialized tools organized into logical categories based on functionality and required credentials.
        </PageSubtitle>

        <H2 id="tool-availability-by-mode">Tool Availability by Mode</H2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Total Tools</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><strong>Documentation-Only</strong></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 tools</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No SFCC credentials required</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><strong>Full Mode</strong></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">36 tools</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Requires SFCC instance access</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="sfcc-documentation-tools">📚 SFCC Documentation Tools (5 tools)</H2>
        <p className="text-gray-600 italic">Available in both modes</p>

        <div className="space-y-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-sfcc-class-info"><InlineCode>get_sfcc_class_info</InlineCode></H3>
            <p>Get detailed information about any SFCC class including properties, methods, and descriptions.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><InlineCode>className</InlineCode> (required): The SFCC class name (e.g., 'Catalog', 'dw.catalog.Catalog')</li>
              <li><InlineCode>expand</InlineCode> (optional): Include detailed information about referenced types (boolean, default: false)</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="search-sfcc-classes"><InlineCode>search_sfcc_classes</InlineCode></H3>
            <p>Find SFCC classes by name with partial matching capabilities.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>query</code> (required): Search query for class names (single word only)</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="search-sfcc-methods"><code>search_sfcc_methods</code></H3>
            <p>Find methods across all SFCC classes by method name.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>methodName</code> (required): Method name to search for (single word only)</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="list-sfcc-classes"><code>list_sfcc_classes</code></H3>
            <p>Get a complete list of all available SFCC classes for exploration and discovery.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-sfcc-class-documentation"><code>get_sfcc_class_documentation</code></H3>
            <p>Get the complete raw Markdown documentation for an SFCC class.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>className</code> (required): The SFCC class name</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="best-practices-tools">📖 Best Practices Tools (4 tools)</H2>
        <p className="text-gray-600 italic">Available in both modes</p>

        <div className="space-y-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-available-best-practice-guides"><code>get_available_best_practice_guides</code></H3>
            <p>List all available SFCC best practice guides covering various development areas.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-best-practice-guide"><code>get_best_practice_guide</code></H3>
            <p>Get complete best practice guides with all sections and content.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>guideName</code> (required): Guide name (cartridge_creation, isml_templates, ocapi_hooks, etc.)</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="search-best-practices"><code>search_best_practices</code></H3>
            <p>Search across all best practice guides for specific terms, patterns, or concepts.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>query</code> (required): Search term or concept</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-hook-reference"><code>get_hook_reference</code></H3>
            <p>Get comprehensive hook reference tables showing all available OCAPI or SCAPI hook endpoints.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>guideName</code> (required): Hook guide name ("ocapi_hooks" or "scapi_hooks")</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="sfra-documentation-tools">🏗️ SFRA Documentation Tools (5 tools)</H2>
        <p className="text-gray-600 italic">Available in both modes</p>

        <div className="space-y-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-available-sfra-documents"><code>get_available_sfra_documents</code></H3>
            <p>Get a list of all available SFRA documentation including Server, Request, Response, models, and more.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-sfra-document"><code>get_sfra_document</code></H3>
            <p>Get complete SFRA class, module, or model documentation with detailed information.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>documentName</code> (required): SFRA document name (server, request, response, cart, product-full, etc.)</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="search-sfra-documentation"><code>search_sfra_documentation</code></H3>
            <p>Search across all SFRA documentation for specific terms, concepts, or functionality.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>query</code> (required): Search term or concept</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-sfra-categories"><code>get_sfra_categories</code></H3>
            <p>Get all available SFRA document categories with counts and descriptions.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-sfra-documents-by-category"><code>get_sfra_documents_by_category</code></H3>
            <p>Get SFRA documents filtered by category (core, product, order, customer, pricing, store, other).</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>category</code> (required): Category to filter by</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="cartridge-generation-tools">🚀 Cartridge Generation Tools (1 tool)</H2>
        <p className="text-gray-600 italic">Available in both modes</p>

        <div className="space-y-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="generate-cartridge-structure"><code>generate_cartridge_structure</code></H3>
            <p>Generate a complete cartridge directory structure with all necessary files and configurations.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>cartridgeName</code> (required): Name of the cartridge (e.g., "plugin_example")</li>
              <li><code>targetPath</code> (optional): Target directory path where cartridge files should be placed</li>
              <li><code>fullProjectSetup</code> (optional): Whether to create complete project setup (default: true)</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="log-analysis-tools">📊 Log Analysis Tools (13 tools)</H2>
        <p className="text-gray-600 italic">Requires Full Mode - SFCC credentials needed</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Note:</strong> Log analysis tools require SFCC instance access and are only available in Full Mode with valid credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
            <ul className="text-sm space-y-1">
              <li><code>get_latest_error</code></li>
              <li><code>get_latest_warn</code></li>
              <li><code>get_latest_info</code></li>
              <li><code>get_latest_debug</code></li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Log Search &amp; Analysis</h4>
            <ul className="text-sm space-y-1">
              <li><code>search_logs</code></li>
              <li><code>summarize_logs</code></li>
              <li><code>list_log_files</code></li>
              <li><code>get_log_file_contents</code></li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Job Log Tools</h4>
            <ul className="text-sm space-y-1">
              <li><code>get_latest_job_log_files</code></li>
              <li><code>get_job_log_entries</code></li>
              <li><code>search_job_logs</code></li>
              <li><code>search_job_logs_by_name</code></li>
              <li><code>get_job_execution_summary</code></li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="system-object-tools-section">🗄️ System Object Tools (6 tools)</H2>
        <p className="text-gray-600 italic">Requires Full Mode - SFCC credentials needed</p>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">System Object Management</h4>
            <ul className="text-sm space-y-1">
              <li><code>get_system_object_definitions</code> - Get all system object definitions</li>
              <li><code>get_system_object_definition</code> - Get specific system object metadata</li>
              <li><code>search_system_object_attribute_definitions</code> - Search system object attributes</li>
              <li><code>search_system_object_attribute_groups</code> - Search attribute groups</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Site Preferences &amp; Custom Objects</h4>
            <ul className="text-sm space-y-1">
              <li><code>search_site_preferences</code> - Search site preferences by group</li>
              <li><code>search_custom_object_attribute_definitions</code> - Search custom object attributes</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="code-version-tools">🔄 Code Version Tools (2 tools)</H2>
        <p className="text-gray-600 italic">Requires Full Mode - SFCC credentials needed</p>

        <div className="space-y-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="get-code-versions"><code>get_code_versions</code></H3>
            <p>Get all code versions from an SFCC instance for deployment management.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <H3 id="activate-code-version"><code>activate_code_version</code></H3>
            <p>Activate a specific code version for code-switch fixes and deployment troubleshooting.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>codeVersionId</code> (required): The ID of the code version to activate</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-8">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">💡 Getting Started</h4>
          <p className="text-blue-800">
            Start with <strong>Documentation-Only Mode</strong> to explore SFCC documentation and best practices without any setup. 
            When you're ready for full functionality, configure your SFCC credentials to access the complete toolkit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
