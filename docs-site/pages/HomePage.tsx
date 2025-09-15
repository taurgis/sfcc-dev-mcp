import React from 'react';
import { H1, H2, H3, PageSubtitle } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import useSEO from '../hooks/useSEO';

const HomePage: React.FC = () => {
  useSEO({
    title: 'SFCC Development MCP Server - AI-Powered Commerce Cloud Development Tools',
    description: 'Model Context Protocol server for Salesforce B2C Commerce Cloud development. Access comprehensive documentation, analyze logs, explore system objects, and get best practices with AI assistance.',
    keywords: 'SFCC, Salesforce Commerce Cloud, Model Context Protocol, MCP server, AI development tools, SFCC documentation, Commerce Cloud development, SFCC debugging, AI-assisted development, SFCC best practices',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/',
    ogTitle: 'SFCC Development MCP Server - AI-Powered Commerce Cloud Development',
    ogDescription: 'Comprehensive MCP server for SFCC development with AI-powered documentation access, log analysis, and development best practices.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="sfcc-development-mcp-server">SFCC Development MCP Server</H1>
      <PageSubtitle>AI-powered Model Context Protocol server for Salesforce B2C Commerce Cloud development with comprehensive documentation, log analysis, and best practices</PageSubtitle>
      
      <div className="hero-section bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center mb-8">
        <H2 id="quick-start">🚀 Quick Start</H2>
        <p className="text-lg text-gray-700 mb-6">
          Get immediate access to SFCC documentation and best practices without any credentials using documentation-only mode
        </p>
        
        <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto text-left">
          <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx", 
      "args": ["sfcc-dev-mcp"]
    }
  }
}`} />
        </div>
        
        <p className="text-sm text-gray-600 mt-4">
          For full functionality including log analysis and system objects, provide SFCC credentials via <InlineCode>--dw-json</InlineCode> parameter
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <H3 id="important-mcp-ai-instructions">⚠️ Important: MCP + AI Instructions Required</H3>
        <p className="text-red-800 mb-4">
          The MCP server alone may not be sufficient for optimal AI assistance. This project includes ready-to-use 
          <strong> AI instruction files</strong> for GitHub Copilot, Claude, and Cursor that guide the AI to use the MCP 
          correctly and prioritize SFCC-specific knowledge.
        </p>
        <div className="space-y-2">
          <p className="text-red-800">
            📁 <strong>Get the files:</strong> <a href="https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions" className="text-red-600 underline" target="_blank" rel="noopener noreferrer">ai-instructions folder on GitHub</a>
          </p>
          <p className="text-red-800">
            📖 <strong>Setup guide:</strong> <a href="/#/ai-interfaces" className="text-red-600 underline">AI Interface Setup page</a>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <H3 id="documentation-only-mode">📖 Documentation-Only Mode</H3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              No SFCC credentials required
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Complete SFCC documentation access
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              SFRA documentation and guides
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Best practices and security guidelines
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Cartridge generation tools
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <H3 id="full-mode">🔧 Full Mode</H3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              All documentation-only features
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Real-time log analysis
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              System object exploration
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Site preference management
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Code version control
            </li>
          </ul>
        </div>
      </div>

      <H2 id="key-features">✨ Key Features</H2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <H3 id="cartridge-generation">Cartridge Generation</H3>
          <p className="text-gray-600 text-sm">Generate complete SFCC cartridge structures with all necessary files and configurations</p>
        </div>
        
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <H3 id="documentation-access">Documentation Access</H3>
          <p className="text-gray-600 text-sm">Complete SFCC API documentation and SFRA guides with intelligent search</p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <H3 id="log-analysis-feature">Log Analysis</H3>
          <p className="text-gray-600 text-sm">Real-time log monitoring, error analysis, and system health summaries</p>
        </div>
      </div>

      <H2 id="perfect-for-ai-development">🎯 Perfect for AI-Assisted Development</H2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <p className="text-blue-800 mb-4">
          This MCP server is specifically designed to work with AI assistants like GitHub Copilot, Claude, and Cursor, 
          providing them with real-time access to SFCC knowledge and development tools.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">With GitHub Copilot:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>Context-aware code suggestions</li>
              <li>SFCC-specific template generation</li>
              <li>Real-time error detection</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">With Claude Desktop:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>Full MCP integration</li>
              <li>Complex debugging assistance</li>
              <li>Architecture discussions</li>
            </ul>
          </div>
        </div>
      </div>

      <H2 id="available-tools">🛠️ Available Tools</H2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Documentation & Best Practices</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>SFCC class information (5 tools)</li>
            <li>Best practice guides (4 tools)</li>
            <li>SFRA documentation (5 tools)</li>
            <li>Cartridge generation (1 tool)</li>
          </ul>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Development & Operations</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Log analysis tools (13 tools)</li>
            <li>System object management (6 tools)</li>
            <li>Code version control (2 tools)</li>
            <li>Total: 36 tools available</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <H3 id="data-api-configuration-warning" className="text-yellow-800">⚠️ Important: Data API Configuration Required</H3>
        <p className="text-yellow-800">
          For full API functionality, you'll need to configure OCAPI settings in Business Manager. 
          See the <a href="/#/configuration" className="text-yellow-600 underline">Configuration Guide</a> for required Data API settings.
        </p>
      </div>

      <H2 id="full-mode-configuration">📖 Full Mode Configuration</H2>
      
      <p className="text-gray-600 mb-4">
        For complete functionality including log analysis and system objects:
      </p>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
    }
  }
}`} />
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">dw.json configuration file:</h4>
        <CodeBlock language="json" code={`{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username", 
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret",
  "site-id": "your-site-id"
}`} />
        <p className="text-sm text-gray-600 mt-2">
          <em>Note: The <InlineCode>site-id</InlineCode> field is optional and only needed for site-specific operations.</em>
        </p>
      </div>

      <H2 id="documentation">📚 Documentation</H2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/installation" className="text-blue-600 hover:text-blue-800">📦 Installation</a>
          </h3>
          <p className="text-gray-600 text-sm">Multiple installation options including npx, global, and local development</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/ai-interfaces" className="text-blue-600 hover:text-blue-800">🤖 AI Interface Setup</a>
          </h3>
          <p className="text-gray-600 text-sm">Detailed setup guides for Claude Desktop, GitHub Copilot, and Cursor</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/configuration" className="text-blue-600 hover:text-blue-800">⚙️ Configuration</a>
          </h3>
          <p className="text-gray-600 text-sm">Complete configuration guide including dw.json and Data API setup</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/features" className="text-blue-600 hover:text-blue-800">✨ Features</a>
          </h3>
          <p className="text-gray-600 text-sm">Detailed overview of all capabilities including cartridge generation, documentation access, and log analysis</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/tools" className="text-blue-600 hover:text-blue-800">🛠️ Available Tools</a>
          </h3>
          <p className="text-gray-600 text-sm">Comprehensive documentation of all available MCP tools</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/examples" className="text-blue-600 hover:text-blue-800">💡 Examples</a>
          </h3>
          <p className="text-gray-600 text-sm">Real-world AI assistant interactions and use cases</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/security" className="text-blue-600 hover:text-blue-800">🔒 Security</a>
          </h3>
          <p className="text-gray-600 text-sm">Security guidelines and best practices for credential management</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href="/#/troubleshooting" className="text-blue-600 hover:text-blue-800">🐛 Troubleshooting</a>
          </h3>
          <p className="text-gray-600 text-sm">Common issues and debugging techniques</p>
        </div>
      </div>

      <H2 id="quick-links">🔗 Quick Links</H2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ul className="space-y-2">
            <li><a href="/#/installation" className="text-blue-600 hover:text-blue-800">Installation Guide</a> - Get started in minutes</li>
            <li><a href="/#/tools" className="text-blue-600 hover:text-blue-800">Tool Reference</a> - Complete tool documentation</li>
            <li><a href="/#/configuration" className="text-blue-600 hover:text-blue-800">Configuration</a> - Setup your SFCC credentials</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ul className="space-y-2">
            <li><a href="https://github.com/taurgis/sfcc-dev-mcp" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">GitHub Repository</a> - Source code and issues</li>
            <li><a href="/#/ai-interfaces" className="text-blue-600 hover:text-blue-800">AI Interface Setup</a> - Connect with your AI assistant</li>
            <li><a href="/#/examples" className="text-blue-600 hover:text-blue-800">Examples</a> - See it in action</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-600 text-sm border-t border-gray-200 pt-8">
        <p><em>This MCP server empowers AI assistants to provide accurate, real-time assistance for SFCC development workflows, significantly improving developer productivity and code quality.</em></p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <a 
          href="/#/installation" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
        >
          Get Started →
        </a>
        <a 
          href="/#/features" 
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-50 transition-colors"
        >
          View Features
        </a>
        <a 
          href="/#/tools" 
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-50 transition-colors"
        >
          Browse Tools
        </a>
      </div>
    </div>
  );
};

export default HomePage;