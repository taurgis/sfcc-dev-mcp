import React from 'react';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import useSEO from '../hooks/useSEO';

const AIInterfacesPage: React.FC = () => {
  useSEO({
    title: 'AI Interface Integration - SFCC Development MCP Server',
    description: 'Integration guide for AI assistants with SFCC Development MCP Server. Setup instructions for Claude Desktop, GitHub Copilot, Cursor, and other Model Context Protocol compatible AI tools.',
    keywords: 'Claude Desktop MCP, GitHub Copilot integration, Cursor AI setup, MCP AI assistants, SFCC AI development, Model Context Protocol integration, AI coding assistants',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/ai-interfaces',
    ogTitle: 'AI Interface Integration - SFCC Development MCP Server',
    ogDescription: 'Complete guide for integrating SFCC Development MCP Server with Claude Desktop, GitHub Copilot, Cursor, and other AI assistants.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/ai-interfaces'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="ai-interface-setup">🤖 AI Interface Setup</H1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          The SFCC Development MCP Server integrates with multiple AI interfaces. Each has specific setup procedures and capabilities.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            📁 <strong>Get AI instruction files:</strong> <a href="https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">ai-instructions folder on GitHub</a>
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Quick Start</h4>
          <p className="text-green-800 mb-4">
            Get immediate access to SFCC documentation and best practices without any credentials by using documentation-only mode:
          </p>
          <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx", 
      "args": ["sfcc-dev-mcp"]
    }
  }
}`} />
          <p className="text-green-800 mt-4">
            For full functionality including log analysis and system objects, provide SFCC credentials via <InlineCode>--dw-json</InlineCode> parameter.
          </p>
        </div>

        <H3 id="github-copilot-installation">Installation Steps</H3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Add the instruction file:</h4>
            <CodeBlock language="bash" code="cp ai-instructions/github-copilot/copilot-instructions.md your-sfcc-project/.github/copilot-instructions.md" />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Configure MCP server (for MCP-compatible tools):</h4>
            <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json", "--debug", "true"]
    }
  }
}`} />
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Available command-line options:</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><InlineCode>--dw-json &lt;path&gt;</InlineCode> - Path to your dw.json configuration file</li>
          <li><InlineCode>--debug &lt;true|false&gt;</InlineCode> - Enable debug logging (optional, defaults to false)</li>
        </ul>

        <H3 id="github-copilot-features">Features Enabled</H3>
        <ul className="list-none space-y-2">
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Inline code suggestions</strong> with SFCC context</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Auto-completion</strong> for SFCC APIs and patterns</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Template generation</strong> for controllers, hooks, and components</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Real-time error detection</strong> and fixes</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>SFCC-aware refactoring</strong> suggestions</li>
        </ul>

        <H3 id="github-copilot-best-practices">Best Practices</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Place the instructions file in every SFCC project</li>
          <li>Keep the instructions updated with your project-specific patterns</li>
          <li>Use descriptive commit messages for better context</li>
        </ul>

        <H3 id="github-copilot-troubleshooting">Troubleshooting GitHub Copilot</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Configuration not loading</strong>: Ensure the file is named exactly <code>copilot-instructions.md</code> and placed in <code>.github/</code> directory</li>
          <li><strong>Suggestions not SFCC-aware</strong>: Verify the instruction file is in the project root's <code>.github/</code> folder</li>
          <li><strong>MCP integration issues</strong>: Check that MCP client configuration matches the server command exactly</li>
        </ul>

        <H3 id="claude-desktop-installation">Installation Steps</H3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Copy the instruction file to your project:</h4>
            <CodeBlock language="bash" code="cp ai-instructions/claude-desktop/claude_custom_instructions.md your-sfcc-project/claude-instructions.md" />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Locate your Claude Desktop config file:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>macOS</strong>: <InlineCode>~/Library/Application Support/Claude/claude_desktop_config.json</InlineCode></li>
              <li><strong>Windows</strong>: <InlineCode>%APPDATA%\Claude\claude_desktop_config.json</InlineCode></li>
              <li><strong>Linux</strong>: <InlineCode>~/.config/Claude/claude_desktop_config.json</InlineCode></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Choose your operating mode:</h4>
            
            <h5 className="text-md font-semibold text-gray-800 mt-4 mb-2">Documentation-Only Mode (No SFCC credentials needed)</h5>
            <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}`} />

            <h5 className="text-md font-semibold text-gray-800 mt-4 mb-2">Full Mode (With SFCC credentials)</h5>
            <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json"]
    }
  }
}`} />
          </div>
        </div>

        <H3 id="claude-desktop-features">Features Enabled</H3>
        <ul className="list-none space-y-2">
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Full MCP integration</strong> with real-time tool access</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Log analysis</strong> and debugging assistance</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>System object exploration</strong> and schema analysis</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Cartridge generation</strong> and project setup</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Architecture discussions</strong> with SFCC context</li>
        </ul>

        <H3 id="cursor-installation">Installation Steps</H3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Copy the rules structure to your SFCC project:</h4>
            <CodeBlock language="bash" code="cp -r ai-instructions/cursor/.cursor your-sfcc-project/" />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Configure MCP server (for MCP-compatible extensions):</h4>
            <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json", "--debug", "true"]
    }
  }
}`} />
          </div>
        </div>

        <H3 id="cursor-available-rules">Available Cursor Rules</H3>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Always Applied</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>sfcc-development.mdc</strong> - Core SFCC patterns and conventions</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Auto-Applied (Context Aware)</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>sfra-controllers.mdc</strong> - Controller development patterns</li>
          <li><strong>sfra-models.mdc</strong> - SFRA model development and architecture patterns</li>
          <li><strong>hooks-development.mdc</strong> - Hook implementation guidelines</li>
          <li><strong>system-objects.mdc</strong> - Data model and attribute patterns</li>
          <li><strong>testing-patterns.mdc</strong> - Testing templates and best practices</li>
          <li><strong>isml-templates.mdc</strong> - ISML template development patterns</li>
          <li><strong>job-framework.mdc</strong> - Job framework development guidelines</li>
          <li><strong>scapi-endpoints.mdc</strong> - SCAPI endpoint development patterns</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Manual Application</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>@debugging-workflows</strong> - Debugging guidance and log analysis</li>
          <li><strong>@security-patterns</strong> - Security best practices and vulnerability prevention</li>
          <li><strong>@performance-optimization</strong> - Performance tuning and optimization strategies</li>
        </ul>

        <H3 id="cursor-features">Features Enabled</H3>
        <ul className="list-none space-y-2">
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Context-aware code completion</strong> based on file type</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Real-time validation</strong> against SFCC APIs</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>File-aware refactoring</strong> across cartridge structures</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Security-first development</strong> patterns</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Automatic rule application</strong> based on context</li>
        </ul>

        <H3 id="cursor-using-rules">Using Cursor Rules</H3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <CodeBlock language="javascript" code={`// Trigger specific rules with @mentions
// @security-patterns - Apply security best practices
// @performance-optimization - Focus on performance
// @debugging-workflows - Get debugging assistance`} />
        </div>

        <H3 id="cursor-troubleshooting">Troubleshooting Cursor</H3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Rules not applying</strong>: Ensure <InlineCode>.cursor</InlineCode> directory is copied to project root</li>
          <li><strong>Context-aware features not working</strong>: Verify file types match rule patterns</li>
          <li><strong>MCP integration issues</strong>: Check MCP client configuration and server connectivity</li>
          <li><strong>Performance issues</strong>: Consider disabling unused rules for better performance</li>
        </ul>

        <H2 id="available-tools-overview">Available Tools Overview</H2>
        <p>All AI interfaces can access these tools based on configuration mode:</p>

        <H3 id="docs-only-mode-tools">Documentation-Only Mode Tools (15 tools)</H3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <ul className="list-none space-y-2">
            <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>SFCC Documentation</strong> (5 tools) - Class information, search, and raw documentation</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Best Practices Guides</strong> (4 tools) - Comprehensive development guides and hook references</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Enhanced SFRA Documentation</strong> (5 tools) - Complete SFRA ecosystem with 26+ documents</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> <strong>Cartridge Generation</strong> (1 tool) - Automated cartridge structure creation</li>
          </ul>
        </div>

        <H3 id="full-mode-tools">Full Mode Additional Tools (21 tools)</H3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <ul className="list-none space-y-2">
            <li className="flex items-center"><span className="text-blue-500 mr-2">✅</span> <strong>Log Analysis & Job Debugging</strong> (13 tools) - Real-time error monitoring, pattern search, and job log analysis</li>
            <li className="flex items-center"><span className="text-blue-500 mr-2">✅</span> <strong>System Object Definitions</strong> (6 tools) - Custom attributes and site preferences</li>
            <li className="flex items-center"><span className="text-blue-500 mr-2">✅</span> <strong>Code Version Management</strong> (2 tools) - Code version control and activation</li>
          </ul>
        </div>

        <H2 id="comparison-recommendations">Comparison & Recommendations</H2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="choose-claude-desktop">Choose Claude Desktop if:</H3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                You need <strong>complex multi-turn conversations</strong>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                You want <strong>full log analysis capabilities</strong>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                You prefer <strong>comprehensive debugging sessions</strong>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                You work on <strong>architecture and design decisions</strong>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="choose-github-copilot">Choose GitHub Copilot if:</H3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">🎯</span>
                You primarily work <strong>in VS Code</strong>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">🎯</span>
                You want <strong>inline code suggestions</strong>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">🎯</span>
                You prefer <strong>lightweight integration</strong>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">🎯</span>
                You focus on <strong>rapid code completion</strong>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <H3 id="choose-cursor">Choose Cursor if:</H3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🎯</span>
                You want <strong>modern AI-powered editing</strong>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🎯</span>
                You need <strong>context-aware rule application</strong>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🎯</span>
                You prefer <strong>file-based intelligence</strong>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🎯</span>
                You want <strong>advanced refactoring capabilities</strong>
              </li>
            </ul>
          </div>
        </div>

        <H2 id="universal-mcp-configuration">Universal MCP Configuration</H2>
        <p>For any MCP-compatible AI interface, use this base configuration:</p>

        <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/your/dw.json", "--debug", "false"]
    }
  }
}`} />

        <H3 id="configuration-options">Configuration Options</H3>
        <ul className="list-disc pl-6 space-y-1 mb-6">
          <li><InlineCode>--dw-json &lt;path&gt;</InlineCode> - Path to dw.json file (optional for docs-only mode)</li>
          <li><InlineCode>--debug &lt;true|false&gt;</InlineCode> - Enable debug logging (default: false)</li>
        </ul>

        <H3 id="verification">Verification</H3>
        <p className="mb-4">Test your MCP connection by asking your AI assistant to:</p>
        <ul className="list-disc pl-6 space-y-1 mb-8">
          <li>Search for SFCC documentation on a specific topic</li>
          <li>Explain how to create a custom cartridge</li>
          <li>Analyze recent error logs (if credentials provided)</li>
          <li>Generate a controller template</li>
        </ul>

        <H2 id="next-steps">🔗 Next Steps</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <a href="/#/configuration" className="text-blue-600 hover:text-blue-800">⚙️ Configuration Guide</a>
            </h3>
            <p className="text-gray-600 text-sm">Set up SFCC credentials and configuration options</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <a href="/#/tools" className="text-blue-600 hover:text-blue-800">🛠️ Available Tools</a>
            </h3>
            <p className="text-gray-600 text-sm">Explore server capabilities and 36 available tools</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <a href="/#/examples" className="text-blue-600 hover:text-blue-800">💡 Examples</a>
            </h3>
            <p className="text-gray-600 text-sm">See real-world usage patterns and AI interactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterfacesPage;
