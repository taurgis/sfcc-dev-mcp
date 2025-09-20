import React from 'react';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, H2, H3, PageSubtitle } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import NewcomerCTA from '../components/NewcomerCTA';

// Small reusable bullet list with icon
const Check: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = 'text-green-500', children }) => (
  <li className="flex items-start gap-2 text-sm text-gray-700">
    <span className={`${color} mt-0.5`}>✅</span>
    <span>{children}</span>
  </li>
);

const SectionCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`rounded-2xl p-6 md:p-8 md:pt-0 border shadow-sm bg-white/90 backdrop-blur-sm ${className}`}>{children}</div>
);

const AIInterfacesPage: React.FC = () => {
  const aiInterfacesStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "AI Interface Integration - SFCC Development MCP Server",
    "description": "Integration guide for AI assistants (Claude Desktop, GitHub Copilot, Cursor, generic MCP clients) with SFCC Development MCP Server.",
    "author": {
      "@type": "Person",
      "name": "Thomas Theunen"
    },
    "publisher": {
      "@type": "Person",
      "name": "Thomas Theunen"
    },
    "datePublished": "2025-01-01",
    "dateModified": "2025-09-20",
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/ai-interfaces/",
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "Claude Desktop",
        "applicationCategory": "DeveloperApplication"
      },
      {
        "@type": "SoftwareApplication", 
        "name": "GitHub Copilot",
        "applicationCategory": "DeveloperApplication"
      },
      {
        "@type": "SoftwareApplication",
        "name": "Cursor",
        "applicationCategory": "DeveloperApplication"
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <SEO 
        title="AI Interface Integration"
        description="Integration guide for AI assistants (Claude Desktop, GitHub Copilot, Cursor, generic MCP clients) with SFCC Development MCP Server."
        keywords="Claude Desktop MCP, GitHub Copilot, Cursor AI, MCP server integration, SFCC AI tools"
        canonical="/ai-interfaces/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "AI Interfaces", url: "/ai-interfaces/" }
      ]} />
      <StructuredData structuredData={aiInterfacesStructuredData} />
      
      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
          AI Interface Integration
        </div>
        <H1 id="ai-interface-setup" className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">Connect Your AI Assistants</H1>
        <PageSubtitle className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Unified setup guide for Claude Desktop, GitHub Copilot, Cursor and any MCP-compatible client. Start
          in documentation-only mode then unlock full log analysis & system exploration with credentials.
        </PageSubtitle>
      </div>

      {/* Newcomer CTA */}
      <NewcomerCTA className="mb-20" />

      {/* Quick Start (Tabbed) */}
      <div id="quick-start" className="mb-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="text-center mb-10">
            <H2 id="environment-modes" className="text-3xl font-bold mb-4">🚀 Environment Modes</H2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Switch between zero-config documentation mode and full analytics mode with a single flag.</p>
          </div>
          {/* Tabs */}
          <ModeTabs />
      </div>

 

      {/* Configuration Options */}
      <div id="configuration" className="mb-20 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-10">
            <H2 id="configuration-flags" className="text-3xl font-bold mb-4">⚙️ Configuration Flags</H2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Minimal surface area – just two flags control operating mode & diagnostics.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 rounded-full p-2"><svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></div>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">--dw-json &lt;path&gt;</span>
              </div>
              <p className="text-gray-700 text-sm">Add credentials for log analysis, system object exploration & code version management.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 rounded-full p-2"><svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></div>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">--debug &lt;true|false&gt;</span>
              </div>
              <p className="text-gray-700 text-sm">Enable verbose internal logging for troubleshooting & development.</p>
            </div>
          </div>
      </div>

      {/* Assistant Tabs Section */}
      <div id="assistants" className="mb-24">
        <div className="text-center mb-10">
          <H2 id="ai-assistant-setup" className="text-3xl font-bold mb-4">AI Assistant Setup</H2>
          <p className="text-gray-600 max-w-3xl mx-auto">Choose your interface – configuration, strengths & verification prompts in one place.</p>
        </div>
        <SectionCard className="border-blue-200">
          <AssistantTabs />
        </SectionCard>
      </div>

      {/* Anchors preserved for deep links */}
      <div id="claude" className="hidden" aria-hidden="true" />
      <div id="copilot" className="hidden" aria-hidden="true" />
      <div id="cursor" className="hidden" aria-hidden="true" />

      {/* AI Instruction Files Section */}
      <div id="instruction-files" className="mb-24">
        <div className="text-center mb-10">
          <H2 id="ai-instruction-files" className="text-3xl font-bold mb-4">📋 AI Instruction Files</H2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Enhance your AI assistant's SFCC expertise with specialized instruction files that provide context about development patterns, security practices, and MCP tool usage.
          </p>
        </div>
        <SectionCard className="border-amber-200">
          <InstructionFilesTabs />
        </SectionCard>
      </div>

      {/* Universal Config */}
      <div id="universal" className="mb-24">
        <div className="text-center mb-8">
          <H2 id="universal-mcp-configuration" className="text-3xl font-bold mb-4">Universal MCP Configuration</H2>
          <p className="text-gray-600 max-w-3xl mx-auto">Works across any MCP-compatible AI (desktop, IDE plugin, CLI agent).</p>
        </div>
        <SectionCard>
          <CodeBlock language="json" code={`{\n  "mcpServers": {\n    "sfcc-dev": {\n      "command": "npx",\n      "args": ["sfcc-dev-mcp", "--dw-json", "/Users/username/sfcc-project/dw.json", "--debug", "false"]\n    }\n  }\n}`} />
          <ul className="list-disc pl-5 text-sm text-gray-700 mt-6 space-y-1">
            <li><InlineCode>--dw-json</InlineCode> optional for docs-only mode</li>
            <li><InlineCode>--debug</InlineCode> set true when diagnosing tool behavior</li>
          </ul>
        </SectionCard>
      </div>

      {/* Next Steps - HomePage style */}
      <div id="next" className="mb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-10 shadow-xl border border-blue-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  You're Set Up
                </div>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">Pick your next path—refine configuration or explore full capability surface.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/configuration/" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition group no-underline hover:no-underline focus:no-underline">
                    Configuration Guide
                    <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
                  </a>
                  <a href="/features/" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition group no-underline hover:no-underline focus:no-underline">
                    Explore Features
                    <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </div>
      </div>
    </div>
  );
};

export default AIInterfacesPage;

// --- Inline Tab Component (kept at bottom for clarity) ---
const ModeTabs: React.FC = () => {
  const [active, setActive] = React.useState<'docs' | 'full'>('docs');
  const tabBase = 'px-5 py-2 rounded-full text-sm font-medium transition border';
  return (
    <div>
      <div role="tablist" aria-label="Mode selection" className="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          role="tab"
          aria-selected={active === 'docs'}
          className={`${tabBase} ${active === 'docs' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}
          onClick={() => setActive('docs')}
        >Docs Mode</button>
        <button
          role="tab"
          aria-selected={active === 'full'}
          className={`${tabBase} ${active === 'full' ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-600'}`}
          onClick={() => setActive('full')}
        >Full Mode</button>
      </div>
      {/* Panels */}
      {active === 'docs' && (
        <div role="tabpanel" aria-label="Documentation Mode" className="space-y-8 animate-fade-in">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration (Docs Mode)</h3>
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <CodeBlock language="json" code={`{\n  "mcpServers": {\n    "sfcc-dev": {\n      "command": "npx",\n      "args": ["sfcc-dev-mcp"]\n    }\n  }\n}`} />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <BenefitCard title="Zero Setup" color="blue" text="Immediate access to SFCC API docs, SFRA, best practices." />
              <BenefitCard title="Fast Onboarding" color="green" text="Great for new devs or quick reference sessions." />
              <BenefitCard title="Safe & Local" color="purple" text="No credentials needed!" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Upgrade any time by adding <InlineCode>--dw-json</InlineCode>.</p>
        </div>
      )}
      {active === 'full' && (
        <div role="tabpanel" aria-label="Full Mode" className="space-y-8 animate-fade-in">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration (Full Mode)</h3>
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-4">
              <CodeBlock language="json" code={`{\n  "mcpServers": {\n    "sfcc-dev": {\n      "command": "npx",\n      "args": [\n         "sfcc-dev-mcp", \n         "--dw-json", \n         "/Users/username/sfcc-project/dw.json", \n         "--debug", \n         "false"\n      ]\n    }\n  }\n}`} />
            </div>
            <p className="text-sm text-gray-600">Set <InlineCode>--debug true</InlineCode> temporarily when diagnosing tool responses.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Additional Benefits</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <BenefitCard title="Live Logs" color="blue" text="Real-time error, warn, info & debug analysis." />
              <BenefitCard title="Job Insights" color="green" text="Job log discovery, execution summaries & step health." />
              <BenefitCard title="Data Model" color="purple" text="System objects, custom attributes & preferences." />
              <BenefitCard title="Code Versions" color="orange" text="List & activate versions for deployment fixes." />
              <BenefitCard title="Deeper Reasoning" color="indigo" text="More context = better AI architectural guidance." />
              <BenefitCard title="Unified Workflow" color="rose" text="Docs + analysis in one consistent interface." />
            </div>
          </div>
          <p className="text-xs text-gray-500">Credentials never leave your machine—local, this MCP server runs on your system.</p>
        </div>
      )}
    </div>
  );
};

const BenefitCard: React.FC<{ title: string; text: string; color: string }> = ({ title, text, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200'
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      <h5 className="font-semibold mb-1 text-sm">{title}</h5>
      <p className="text-xs leading-relaxed">{text}</p>
    </div>
  );
};

// AssistantTabs component for Claude / Copilot / Cursor (refined layout)
const AssistantTabs: React.FC = () => {
  type Assistant = 'claude' | 'copilot' | 'cursor';
  const [active, setActive] = React.useState<Assistant>('copilot');
  const tabBase = 'px-5 py-2 rounded-full text-sm font-medium transition border';
  // Unified configuration: keep identical parameters for all assistants for clarity
  const unifiedSnippet = `{"mcpServers":{"sfcc-dev":{"command":"npx","args":["sfcc-dev-mcp","--dw-json","/Users/username/sfcc-project/dw.json","--debug","false"]}}}`;
  const configSnippets: Record<Assistant, string> = {
    claude: unifiedSnippet,
    copilot: unifiedSnippet,
    cursor: unifiedSnippet
  };
  const benefits: Record<Assistant, Array<{ title: string; text: string; color: string }>> = {
    claude: [
      { title: 'Deep Reasoning', text: 'Great for architecture & multi-step planning.', color: 'blue' },
      { title: 'Debug Sessions', text: 'Explain logs & identify root causes.', color: 'green' },
      { title: 'Exploration', text: 'Modeling & refactor strategy guidance.', color: 'purple' }
    ],
    copilot: [
      { title: 'Inline Speed', text: 'Rapid completions & edits in VS Code.', color: 'green' },
      { title: 'Scaffolding', text: 'Generate controllers, models & tests.', color: 'blue' },
      { title: 'Everyday Flow', text: 'Low-friction iteration for daily work.', color: 'purple' }
    ],
    cursor: [
      { title: 'Rule Packs', text: 'Context-aware security & performance rules.', color: 'purple' },
      { title: 'Large Changes', text: 'Safely coordinate multi-file refactors.', color: 'blue' },
      { title: 'Consistency', text: 'Standardize patterns across the codebase.', color: 'green' }
    ]
  };
  const prompts: Record<Assistant, string[]> = {
    claude: [
      'List available SFCC documentation tools',
      'Analyze recent error logs',
      'Generate cartridge structure named demo_cartridge'
    ],
    copilot: [
      'Show methods on dw.catalog.Product',
      'Create SFRA controller for Product-Show'
    ],
    cursor: [
      'Suggest performance improvements for this controller',
      'Apply security patterns to this hook'
    ]
  };

  const renderSnippet = (assistant: Assistant) => {
    const json = configSnippets[assistant];
    const pretty = JSON.stringify(JSON.parse(json), null, 2);
    return <CodeBlock language="json" code={pretty} />;
  };

  return (
    <div>
      <div role="tablist" aria-label="Assistant selection" className="flex flex-wrap gap-3 mb-10 mt-10 justify-center">
        <button
          role="tab"
          aria-selected={active === 'copilot'}
          className={`${tabBase} ${active === 'copilot' ? 'bg-green-600 text-white border-green-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600'}`}
          onClick={() => setActive('copilot')}
        >GitHub Copilot</button>
        <button
          role="tab"
          aria-selected={active === 'claude'}
          className={`${tabBase} ${active === 'claude' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}
          onClick={() => setActive('claude')}
        >Claude Desktop</button>
        <button
          role="tab"
          aria-selected={active === 'cursor'}
          className={`${tabBase} ${active === 'cursor' ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-600'}`}
          onClick={() => setActive('cursor')}
        >Cursor</button>
      </div>
      <div className="space-y-10 animate-fade-in" role="tabpanel">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-6">
            {renderSnippet(active)}
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {active === 'copilot' && (
                <>
                  <a 
                    href="https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg no-underline hover:no-underline focus:no-underline"
                  >
                    📖 Copilot MCP Setup
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    href="https://www.youtube.com/watch?v=ZlrQJQV14xQ&t=215s" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg no-underline hover:no-underline focus:no-underline"
                  >
                    🎥 Video Guide
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </>
              )}
              {active === 'claude' && (
                <a 
                  href="https://support.anthropic.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg no-underline hover:no-underline focus:no-underline"
                >
                  📖 Claude MCP Setup
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {active === 'cursor' && (
                <a 
                  href="https://docs.cursor.com/advanced/model-context-protocol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 hover:text-purple-800 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg no-underline hover:no-underline focus:no-underline"
                >
                  📖 Cursor MCP Setup
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center">Docs-only mode: omit <InlineCode>--dw-json</InlineCode>. Enable verbose logging temporarily with <InlineCode>--debug true</InlineCode>.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Key Strengths</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {benefits[active].map(b => <BenefitCard key={b.title} title={b.title} text={b.text} color={b.color} />)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Verification Prompts</h4>
          <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
            {prompts[active].map(p => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

// InstructionFilesTabs component for AI instruction file setup
const InstructionFilesTabs: React.FC = () => {
  type InstructionTarget = 'copilot' | 'claude' | 'cursor';
  const [active, setActive] = React.useState<InstructionTarget>('copilot');
  const tabBase = 'px-5 py-2 rounded-full text-sm font-medium transition border';

  const instructionData: Record<InstructionTarget, {
    setupUrl: string;
    files: Array<{ name: string; path: string; description: string }>;
    instructions: string[];
  }> = {
    copilot: {
      setupUrl: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions',
      files: [
        {
          name: 'copilot-instructions.md',
          path: '.github/copilot-instructions.md',
          description: 'Main instruction file for GitHub Copilot with SFCC expertise and MCP tool usage patterns'
        }
      ],
      instructions: [
        'Copy the instruction file from the repository to your project',
        'Place it in the .github folder of your repository',
        'Copilot will automatically detect and use these instructions when working in your repo',
        'The file includes SFCC development patterns, security guidelines, and MCP tool usage'
      ]
    },
    claude: {
      setupUrl: 'https://support.anthropic.com/en/articles/10185728-understanding-claude-s-personalization-features',
      files: [
        {
          name: 'claude_custom_instructions.md',
          path: 'ai-instructions/claude-desktop/claude_custom_instructions.md',
          description: 'Claude Desktop-optimized instructions with conversational development patterns and MCP integration'
        }
      ],
      instructions: [
        'Copy the instruction content from the repository file',
        'Click your initials in the lower left corner of Claude',
        'Select "Settings" from the menu',
        'Under "What preferences should Claude consider in responses?", paste the content',
        'These profile preferences will apply to all your conversations with Claude'
      ]
    },
    cursor: {
      setupUrl: 'https://docs.cursor.com/en/context/rules',
      files: [
        {
          name: 'SFCC Rule Pack',
          path: 'ai-instructions/cursor/.cursor/rules/',
          description: 'Complete rule pack with 12 specialized files covering all SFCC development areas'
        }
      ],
      instructions: [
        'Copy the entire .cursor folder from the repository to your project root',
        'This includes 12 specialized rule files covering different SFCC development areas',
        'Cursor automatically applies rules based on file context and development patterns',
        'Rules cover cartridge development, SFRA patterns, security, performance, and debugging'
      ]
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Instruction files selection" className="flex flex-wrap gap-3 mb-10 mt-10 justify-center">
        <button
          role="tab"
          aria-selected={active === 'copilot'}
          className={`${tabBase} ${active === 'copilot' ? 'bg-green-600 text-white border-green-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600'}`}
          onClick={() => setActive('copilot')}
        >GitHub Copilot</button>
        <button
          role="tab"
          aria-selected={active === 'claude'}
          className={`${tabBase} ${active === 'claude' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}
          onClick={() => setActive('claude')}
        >Claude Desktop</button>
        <button
          role="tab"
          aria-selected={active === 'cursor'}
          className={`${tabBase} ${active === 'cursor' ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-600'}`}
          onClick={() => setActive('cursor')}
        >Cursor</button>
      </div>
      
      <div className="space-y-8 animate-fade-in" role="tabpanel">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Instruction Files</h3>
          <div className="space-y-4">
            {instructionData[active].files.map((file, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-2">{file.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href={`https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions/cursor/.cursor/rules`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 rounded-lg text-sm font-medium transition-all duration-200 no-underline hover:no-underline focus:no-underline"
                      >
                        📁 View on GitHub
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-mono">
                        {file.path}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Setup Instructions</h4>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
              {instructionData[active].instructions.map((instruction, index) => (
                <li key={index} className="leading-relaxed">{instruction}</li>
              ))}
            </ol>
          </div>
          
          <div className="flex justify-center mt-6">
            <a 
              href={instructionData[active].setupUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg no-underline hover:no-underline focus:no-underline"
            >
              📖 Official Setup Guide
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h5 className="font-semibold text-green-700 mb-2 text-sm">🎯 Enhanced Expertise</h5>
              <p className="text-xs text-green-600 leading-relaxed">Pre-loaded SFCC knowledge, development patterns, and security best practices</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-semibold text-blue-700 mb-2 text-sm">🔧 MCP Tool Awareness</h5>
              <p className="text-xs text-blue-600 leading-relaxed">Built-in knowledge of all 36 MCP tools and their optimal usage patterns</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h5 className="font-semibold text-purple-700 mb-2 text-sm">⚡ Faster Development</h5>
              <p className="text-xs text-purple-600 leading-relaxed">Immediate access to SFCC-specific patterns without requiring context</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h5 className="font-semibold text-amber-700 mb-2 text-sm">🔒 Security-First</h5>
              <p className="text-xs text-amber-600 leading-relaxed">Built-in security patterns and validation practices for SFCC development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
