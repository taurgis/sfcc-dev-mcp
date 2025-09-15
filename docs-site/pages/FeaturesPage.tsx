import React from 'react';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const FeaturesPage: React.FC = () => {
  useSEO({
    title: 'Features & Capabilities - SFCC Development MCP Server',
    description: 'Comprehensive overview of SFCC Development MCP Server features. Documentation access, log analysis, system object exploration, cartridge generation, best practices, and AI-powered development tools.',
    keywords: 'SFCC MCP features, Commerce Cloud development tools, SFCC documentation access, log analysis tools, system object tools, cartridge generation, SFCC best practices, AI development features',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/features',
    ogTitle: 'SFCC Development MCP Server Features & Capabilities',
    ogDescription: 'Explore comprehensive SFCC development features: documentation access, log analysis, system exploration, and AI-powered development tools.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/features'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="features">✨ Features</H1>
      
      <div className="prose prose-lg max-w-none">
        <PageSubtitle>
          The SFCC Development MCP Server provides comprehensive tools and documentation access for Salesforce B2C Commerce Cloud development.
        </PageSubtitle>

        <H2 id="cartridge-generation">🚀 Cartridge Generation</H2>
        <p><strong>Generate Complete Cartridge Structure</strong> - Create a complete SFCC cartridge directory structure with all necessary files and configurations using the <code>generate_cartridge_structure</code> tool.</p>

        <H3 id="cartridge-features">Features:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Proper directory organization with controllers, models, templates, and client assets</li>
          <li>Complete package.json with all necessary dependencies</li>
          <li>Webpack configuration for asset bundling</li>
          <li>ESLint setup for code quality</li>
          <li>All standard cartridge subdirectories (controllers, models, templates, static assets)</li>
          <li>Support for both full project setup (new projects) and cartridge-only setup (adding to existing projects)</li>
          <li>Creates files directly in the specified target directory for precise control over cartridge placement</li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <H2 id="sfcc-best-practices-guides">📚 SFCC Best Practices Guides</H2>
        <p><strong>Comprehensive Development Guidelines</strong> - Access curated best practice guides covering all major SFCC development areas.</p>

        <H3 id="available-guides">Available Guides:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Get Available Guides</strong> - List all available SFCC best practice guides</li>
          <li><strong>Get Complete Guide</strong> - Retrieve comprehensive guides with structured content</li>
          <li><strong>Search Best Practices</strong> - Search across all guides for specific terms and concepts</li>
          <li><strong>Get Hook Reference</strong> - Access detailed hook reference tables for OCAPI and SCAPI hooks</li>
        </ul>

        <H3 id="coverage-areas">Coverage Areas:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cartridge creation and architecture patterns</li>
          <li>ISML templates with security and performance guidelines</li>
          <li>Job framework development (task-oriented and chunk-oriented patterns)</li>
          <li>LocalServiceRegistry service integrations with OAuth flows and reusable patterns</li>
          <li>OCAPI hooks (legacy API extension patterns)</li>
          <li>SCAPI hooks (modern API hooks with transactional integrity)</li>
          <li>SFRA controllers and middleware chains</li>
          <li>SFRA models and JSON object layer design</li>
          <li>Custom SCAPI endpoints with three-pillar architecture</li>
          <li>Performance optimization and scalability best practices</li>
          <li>Security guidelines with OWASP compliance</li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <H2 id="sfcc-documentation-querying">🔍 SFCC Documentation Querying</H2>
        <p><strong>Complete API Documentation Access</strong> - Search and explore all SFCC API classes and methods with intelligent discovery.</p>

        <H3 id="documentation-capabilities">Capabilities:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Get Class Information</strong> - Retrieve detailed information about any SFCC class including properties, methods, and descriptions</li>
          <li><strong>Search Classes</strong> - Find SFCC classes by name with partial matching capabilities</li>
          <li><strong>Search Methods</strong> - Find methods across all SFCC classes by method name</li>
          <li><strong>List All Classes</strong> - Get a complete list of available SFCC classes for exploration</li>
          <li><strong>Get Raw Documentation</strong> - Access the complete Markdown documentation for any class with examples and detailed descriptions</li>
        </ul>

        <H3 id="supported-namespaces">Supported Namespaces:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><code>dw.campaign</code> - Campaign and promotion management</li>
          <li><code>dw.catalog</code> - Product and catalog management</li>
          <li><code>dw.content</code> - Content management systems</li>
          <li><code>dw.customer</code> - Customer profile and authentication</li>
          <li><code>dw.order</code> - Order processing and management</li>
          <li><code>dw.system</code> - System utilities and configurations</li>
          <li><code>dw.web</code> - Web framework and request handling</li>
          <li><code>dw.util</code> - Utility functions and helpers</li>
          <li>And many more specialized namespaces...</li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <H2 id="enhanced-sfra-documentation-access">🏗️ Enhanced SFRA Documentation Access</H2>
        <p><strong>Advanced Storefront Reference Architecture Documentation</strong> - Comprehensive access to all SFRA components with intelligent categorization.</p>

        <H3 id="sfra-document-categories">📂 SFRA Document Categories (26+ documents total):</H3>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Core SFRA Classes (5 documents)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>server</code> - Main server functionality and routing</li>
              <li><code>request</code> - Request object handling and middleware</li>
              <li><code>response</code> - Response management and rendering</li>
              <li><code>querystring</code> - Query parameter processing</li>
              <li><code>render</code> - Template rendering and view management</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Product Models (5 documents)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>product-full</code> - Complete product model with all attributes</li>
              <li><code>product-bundle</code> - Product bundle handling</li>
              <li><code>product-tile</code> - Product tile display models</li>
              <li><code>product-search</code> - Search result product models</li>
              <li><code>product-line-items</code> - Cart line item product models</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Order &amp; Cart Models (6 documents)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>cart</code> - Shopping cart functionality</li>
              <li><code>order</code> - Order processing models</li>
              <li><code>billing</code> - Billing address and payment models</li>
              <li><code>shipping</code> - Shipping address and method models</li>
              <li><code>totals</code> - Price calculation and tax models</li>
              <li><code>payment</code> - Payment processing models</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Customer Models (4 documents)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>account</code> - Customer account management</li>
              <li><code>address</code> - Address handling and validation</li>
              <li><code>customer</code> - Customer profile models</li>
              <li><code>profile</code> - Extended customer profile data</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Additional Models</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>pricing</code> - Pricing models and calculations</li>
              <li><code>store</code> - Store locator and inventory models</li>
              <li><code>content</code> - Content asset models</li>
              <li><code>search</code> - Search functionality models</li>
              <li><code>locale</code> - Localization and currency models</li>
            </ul>
          </div>
        </div>

        <H3 id="sfra-capabilities">SFRA Capabilities:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Dynamic Discovery</strong> - Automatically finds all 26+ SFRA documents including core classes and extensive model documentation</li>
          <li><strong>Smart Categorization</strong> - Organizes documents into 7 logical categories for efficient discovery</li>
          <li><strong>Advanced Search</strong> - Relevance-scored search across all documents with context highlighting</li>
          <li><strong>Category Filtering</strong> - Explore documents by functional areas</li>
          <li><strong>Complete Coverage</strong> - Core SFRA classes plus comprehensive model documentation</li>
        </ul>

        <H2 id="sfcc-system-object-definitions">⚙️ SFCC System Object Definitions</H2>
        <p><strong>Deep System Integration</strong> - Explore and understand SFCC's data model with comprehensive system object access.</p>

        <H3 id="system-object-tools">System Object Tools:</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Get All System Objects</strong> - Retrieve complete list of all system object definitions with metadata</li>
          <li><strong>Get System Object Definition</strong> - Detailed information about specific objects (Product, Customer, Order, etc.)</li>
          <li><strong>Search System Object Attribute Definitions</strong> - Find specific attributes using complex queries</li>
          <li><strong>Search Site Preferences</strong> - Discover custom site preferences and configurations</li>
          <li><strong>Search System Object Attribute Groups</strong> - Find attribute groups and preference categories</li>
          <li><strong>Search Custom Object Attribute Definitions</strong> - Explore custom object structures</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Advanced Query Capabilities:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Text search on id/display_name/description</li>
          <li>Filtering by properties (mandatory/searchable/system)</li>
          <li>Sorting and pagination support</li>
          <li>Boolean query combinations (AND/OR/NOT)</li>
          <li>Match-all queries for complete attribute lists</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Use Cases:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Discovering custom attributes added to standard SFCC objects</li>
          <li>Understanding site preference configurations</li>
          <li>Exploring custom object definitions</li>
          <li>Finding attributes with specific characteristics</li>
          <li>Mapping data model relationships</li>
        </ul>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
          <p className="text-yellow-800">
            <strong>Note:</strong> Requires OAuth credentials (clientId and clientSecret) for full functionality
          </p>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="log-analysis-monitoring">📊 Log Analysis & Monitoring</H2>
        <p><strong>Real-time Debugging and Monitoring</strong> - Comprehensive log analysis tools for SFCC instance monitoring and debugging.</p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Log Analysis Tools:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Get Latest Errors</strong> - Retrieve the most recent error messages from SFCC logs</li>
          <li><strong>Get Latest Warnings</strong> - Fetch recent warning messages and deprecation notices</li>
          <li><strong>Get Latest Info</strong> - Access recent info-level log entries for application flow</li>
          <li><strong>Get Latest Debug</strong> - Detailed debug messages for step-by-step execution tracing</li>
          <li><strong>Summarize Logs</strong> - Get overview of log activity with error counts and key issues</li>
          <li><strong>Search Logs</strong> - Search for specific patterns, keywords, or error messages across log files</li>
          <li><strong>List Log Files</strong> - View available log files with metadata including sizes and modification dates</li>
          <li><strong>Get Log File Contents</strong> - Read complete contents of specific log files for detailed analysis</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Monitoring Capabilities:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Real-time error tracking and alerting</li>
          <li>Performance monitoring through log analysis</li>
          <li>Pattern recognition for recurring issues</li>
          <li>System health assessment</li>
          <li>Debugging assistance with detailed execution traces</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Log Types Supported:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Application logs (info, warn, error, debug)</li>
          <li>System logs with performance metrics</li>
          <li>Custom log entries from cartridge code</li>
          <li>WebDAV access logs</li>
          <li>OCAPI/SCAPI request logs</li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <H2 id="code-version-management">🔄 Code Version Management</H2>
        <p><strong>Code Version Control and Deployment</strong> - Manage code versions and handle deployment-related issues.</p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Features:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>List Code Versions</strong> - Get all available code versions with status information</li>
          <li><strong>Activate Code Versions</strong> - Switch between code versions for troubleshooting and deployment fixes</li>
          <li><strong>Deployment Troubleshooting</strong> - Resolve SCAPI endpoint registration issues and job deployment problems</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">💡 Perfect for AI-Assisted Development</h4>
          <p className="text-blue-800">
            All features are designed to work seamlessly with AI assistants like GitHub Copilot, Claude, and Cursor. 
            The MCP protocol enables real-time access to SFCC knowledge, making AI suggestions more accurate and context-aware.
          </p>
        </div>

        <H2 id="operating-modes">🎯 Operating Modes</H2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <H3 id="documentation-only-mode">📖 Documentation-Only Mode (15 tools)</H3>
            <p className="text-gray-600 mb-4">Perfect for learning, reference, and development without requiring SFCC instance access:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Complete SFCC API documentation (5 tools)</li>
              <li>Best practices guides (4 tools)</li>
              <li>SFRA documentation access (5 tools)</li>
              <li>Cartridge generation (1 tool)</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <H3 id="full-mode">🔧 Full Mode (36 tools)</H3>
            <p className="text-gray-600 mb-4">Complete development experience with SFCC instance access:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>All documentation-only features (15 tools)</li>
              <li>Real-time log analysis and job debugging (13 tools)</li>
              <li>System object definitions (6 tools)</li>
              <li>Code version management (2 tools)</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <H2 id="security-performance">🔒 Security & Performance</H2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">� Built-in Security Features:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Secure credential management</li>
              <li>Path traversal protection</li>
              <li>Input validation and sanitization</li>
              <li>Rate limiting and resource management</li>
              <li>Audit logging for all operations</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Performance Optimizations:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Intelligent caching systems</li>
              <li>Lazy loading for large datasets</li>
              <li>Connection pooling for SFCC APIs</li>
              <li>Request deduplication</li>
              <li>Background processing for heavy operations</li>
            </ul>
          </div>
        </div>

        <H2 id="next-steps">🔗 Next Steps</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <a href="/#/tools" className="text-blue-600 hover:text-blue-800">🛠️ Available Tools</a>
            </h3>
            <p className="text-gray-600 text-sm">Detailed tool documentation and usage examples</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <a href="/#/examples" className="text-blue-600 hover:text-blue-800">💡 Examples</a>
            </h3>
            <p className="text-gray-600 text-sm">Real-world usage patterns and AI assistant interactions</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <a href="/#/configuration" className="text-blue-600 hover:text-blue-800">⚙️ Configuration</a>
            </h3>
            <p className="text-gray-600 text-sm">Setup and credential configuration guide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
