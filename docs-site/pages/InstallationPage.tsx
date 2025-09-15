import React from 'react';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import useSEO from '../hooks/useSEO';

const InstallationPage: React.FC = () => {
  useSEO({
    title: 'Installation & Setup - SFCC Development MCP Server',
    description: 'Step-by-step installation guide for the SFCC Development MCP Server. Learn how to install via npm, configure with dw.json, and integrate with AI assistants like Claude Desktop and GitHub Copilot.',
    keywords: 'SFCC MCP server installation, npm install sfcc-dev-mcp, Claude Desktop setup, GitHub Copilot integration, SFCC development setup, Commerce Cloud tools installation',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/installation',
    ogTitle: 'SFCC Development MCP Server Installation Guide',
    ogDescription: 'Complete installation and setup guide for SFCC Development MCP Server with AI assistant integration.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/installation'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="installation-setup">📦 Installation & Setup</H1>
      <PageSubtitle>
        The SFCC Development MCP Server can be installed and run in several ways. Choose the option that best fits your workflow.
      </PageSubtitle>

      <div className="space-y-8">
        <section>
          <H2 id="option-1-using-npx">Option 1: Using npx (Recommended)</H2>
          <p className="text-gray-600 mb-4">
            The easiest way to use this MCP server is with npx, which automatically handles installation and updates:
          </p>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-4">
            <CodeBlock language="bash" code={`# Test the server (Documentation-only mode)
npx sfcc-dev-mcp

# Use with custom dw.json file
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Enable debug mode
npx sfcc-dev-mcp --debug

# Combine options
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug`} />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <H3 id="advantages-of-npx">Advantages of npx</H3>
            <ul className="space-y-1 text-green-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                No installation required
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                Always uses the latest version
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                No global package management
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                Perfect for CI/CD workflows
              </li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> When using npx, make sure your <InlineCode>dw.json</InlineCode> file is in the current working directory or specify the full path using the <InlineCode>--dw-json</InlineCode> parameter.
            </p>
          </div>
        </section>

        <section>
          <H2 id="option-2-global-installation">Option 2: Global Installation</H2>
          <p className="text-gray-600 mb-4">
            Install the package globally for use across multiple projects:
          </p>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-4">
            <CodeBlock language="bash" code={`# Install globally
npm install -g sfcc-dev-mcp

# Run from anywhere
sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Enable debug mode
sfcc-dev-mcp --debug

# Check installed version
npm list -g sfcc-dev-mcp`} />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <H3 id="when-to-use-global-installation">When to use global installation</H3>
            <ul className="space-y-1 text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                Working with multiple SFCC projects
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                Want consistent version across projects
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">🎯</span>
                Offline development scenarios
              </li>
            </ul>
          </div>
        </section>

        <section>
          <H2 id="option-3-local-development-installation">Option 3: Local Development Installation</H2>
          <p className="text-gray-600 mb-4">
            For contributing to the project or local modifications:
          </p>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-4">
            <CodeBlock language="bash" code={`# Clone the repository
git clone https://github.com/taurgis/sfcc-dev-mcp.git
cd sfcc-dev-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Run locally using npm scripts
npm run dev -- --dw-json /path/to/your/dw.json

# Or run built version
npm run build
npm start -- --dw-json /path/to/your/dw.json

# Enable debug mode during development
npm run dev -- --debug

# Run tests
npm test`} />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <H3 id="development-features">Development features</H3>
            <ul className="space-y-1 text-purple-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🔧</span>
                TypeScript source code access
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🔧</span>
                Full test suite
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🔧</span>
                Watch mode for rapid iteration
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">🔧</span>
                Debugging capabilities
              </li>
            </ul>
          </div>
        </section>

        <section>
          <H2 id="system-requirements">System Requirements</H2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Node.js:</span>
                Version 18 or higher
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Operating System:</span>
                macOS, Linux, or Windows
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Memory:</span>
                Minimum 512MB RAM available
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Network:</span>
                Internet access for SFCC API calls (Full Mode only)
              </li>
            </ul>
          </div>
        </section>

        <section>
          <H2 id="command-line-options">Command-Line Options</H2>
          <p className="text-gray-600 mb-4">
            The server supports several command-line parameters to customize its behavior:
          </p>

          <div className="space-y-6">
            <div>
              <H3 id="dw-json-option">
                <InlineCode>--dw-json &lt;path&gt;</InlineCode>
              </H3>
              <p className="text-gray-600 mb-3">
                Specify a custom path to your <InlineCode>dw.json</InlineCode> configuration file:
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <CodeBlock language="bash" code={`npx sfcc-dev-mcp --dw-json /path/to/your/dw.json
npx sfcc-dev-mcp --dw-json ./config/dw.json`} />
              </div>
            </div>

            <div>
              <H3 id="debug-option">
                <InlineCode>--debug [true|false]</InlineCode>
              </H3>
              <p className="text-gray-600 mb-3">
                Control debug logging output:
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                <CodeBlock language="bash" code={`# Enable debug logging (detailed messages, timing info)
npx sfcc-dev-mcp --debug
npx sfcc-dev-mcp --debug true

# Disable debug logging (essential info only)
npx sfcc-dev-mcp --debug false`} />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Debug logging includes:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Method entry and exit logs</li>
                  <li>• Detailed timing information for operations</li>
                  <li>• Full response previews for debugging</li>
                  <li>• Additional context for troubleshooting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <H2 id="configuration-loading-priority">Configuration Loading Priority</H2>
          <p className="text-gray-600 mb-4">
            The server loads configuration in the following order:
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <div>
                  <span className="font-semibold">Command line <InlineCode>--dw-json</InlineCode> argument</span>
                  <span className="text-blue-600 ml-2">(highest priority)</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span className="font-semibold"><InlineCode>./dw.json</InlineCode> file in current directory</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <div>
                  <span className="font-semibold">Environment variables</span>
                  <span className="text-gray-500 ml-2">(lowest priority)</span>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <H2 id="verification">Verification</H2>
          <p className="text-gray-600 mb-4">
            After installation, verify the server is working:
          </p>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <CodeBlock language="bash" code={`# Test basic functionality (documentation-only mode)
npx sfcc-dev-mcp

# Test with debug output
npx sfcc-dev-mcp --debug

# Test with your configuration
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json

# Test with configuration and debug mode
npx sfcc-dev-mcp --dw-json /path/to/your/dw.json --debug`} />
          </div>
        </section>

        <section>
          <H2 id="next-steps">Next Steps</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <H3 id="ai-interface-setup">
                <a href="/#/ai-interfaces" className="text-blue-600 hover:text-blue-800">📖 AI Interface Setup</a>
              </H3>
              <p className="text-gray-600 text-sm">Configure your preferred AI assistant</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <H3 id="configuration-guide-link">
                <a href="/#/configuration" className="text-blue-600 hover:text-blue-800">⚙️ Configuration Guide</a>
              </H3>
              <p className="text-gray-600 text-sm">Set up SFCC credentials and options</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <H3 id="available-tools-link">
                <a href="/#/tools" className="text-blue-600 hover:text-blue-800">🛠️ Available Tools</a>
              </H3>
              <p className="text-gray-600 text-sm">Explore what the server can do</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstallationPage;