import React from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Collapsible } from '../components/Collapsible';
import { SITE_DATES } from '../constants';

const badge = (label: string) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mr-2 mb-2 bg-slate-100 text-slate-700 border border-slate-200">{label}</span>
);

const FeaturesPage: React.FC = () => {
  const featuresStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Features & Capabilities - SFCC Development MCP Server",
  "description": "Comprehensive overview of SFCC Development MCP Server features: documentation access, real-time log & job log analysis, system & custom object exploration, site preferences, cartridge generation, agent skills, and AI-powered development tools.",
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
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/features/",
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
    ],
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "SFCC Development MCP Server",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Node.js",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "SFCC API Documentation Access",
  "Real-time Log & Job Log Analysis", 
  "System & Custom Object Exploration",
        "Cartridge Generation",
        "Agent Skills",
        "AI Assistant Integration"
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <SEO 
        title="Features & Capabilities"
  description="Comprehensive overview of SFCC Development MCP Server features: documentation access, real-time log & job log analysis, system & custom object exploration, site preferences, cartridge generation, agent skills, and AI-powered development tools."
        keywords="SFCC MCP features, Commerce Cloud development tools, SFCC documentation access, log analysis tools, system object tools, cartridge generation, SFCC agent skills, AI development features"
        canonical="/features/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Features", url: "/features/" }
      ]} />
      <StructuredData structuredData={featuresStructuredData} />
      
      <header className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
          Feature Surface
        </div>
        <H1 id="features" className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">Discover & Apply Faster</H1>
        <PageSubtitle className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Lean overview of every capability—expand only what you need. Optimized for AI-assisted flows and rapid onboarding.
        </PageSubtitle>

          </header>
                  <div className="flex flex-wrap gap-2 mt-2">
          {badge('Docs')}
          {badge('SFRA')}
          {badge('ISML')}
              {badge('Skills')}
          {badge('Logs')}
          {badge('Jobs')}
    {badge('Objects')}
          {badge('Code Versions')}
          {badge('Security')}
        </div>
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <strong className="block font-semibold text-blue-900">Getting started</strong>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Generate a cartridge with <code>generate_cartridge_structure</code></li>
            <li>Or ask your AI assistant: <em>"Show me dw.catalog.Product methods"</em></li>
          </ul>
          <p className="mt-3 m-0 text-blue-800">Ready for deeper insight? Expand the sections below.</p>
        </div>
    

      {/* DEEP DIVES */}
  <section className="space-y-8" aria-label="Feature deep dives">
        <Collapsible id="cartridge-generation" title="🚀 Cartridge Generation" defaultOpen>
          <p className="text-sm">Create a production-ready SFCC cartridge (or full project) in seconds via <code>generate_cartridge_structure</code>.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Controllers, models, ISML templates, static assets, config, lint, build</li>
            <li>Full project mode adds package.json, Webpack, linting, scripts</li>
            <li>Direct file creation in specified target path (no manual copy)</li>
            <li>Consistent patterns for AI to reason about project shape</li>
          </ul>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"Generate a cartridge named <em>training_core</em> and show the created directories."</li>
              <li>"What files does generate_cartridge_structure create in full project mode?"</li>
              <li>"Add a controller skeleton to my generated cartridge for listing products."</li>
            </ul>
          </div>
        </Collapsible>

    <Collapsible id="agent-skills" title="🧩 Agent Skills (Guidance Packs)">
      <p className="text-sm mb-2">
        The curated best-practice guides have been migrated into portable <strong>skills</strong>.
        Each skill is a versioned instruction pack (Markdown) your AI assistant can load to follow consistent SFCC patterns.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-1">What you get</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Cartridge development patterns</li>
            <li>SFRA controllers, models, and client-side JS</li>
            <li>ISML development patterns</li>
            <li>OCAPI & SCAPI hooks guidance</li>
            <li>Security and performance skills</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-1">How to use</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Install/merge skills into your repo using <code>sync_agent_instructions</code></li>
            <li>Or browse and copy a specific skill from GitHub</li>
            <li>Pick the smallest relevant skill to reduce noise</li>
          </ul>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-600">
        <p className="font-semibold mb-1 text-slate-700">Next step:</p>
        <NavLink to="/skills/" className="text-orange-700 hover:text-orange-900 font-medium">Browse available skills →</NavLink>
      </div>
    </Collapsible>

        <Collapsible id="sfcc-documentation" title="🔍 SFCC API Documentation">
          <p className="text-sm">Query the entire <code>dw.*</code> namespace surface area.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Get class info (properties, methods, descriptions)</li>
            <li>Search classes & methods with partial matching</li>
            <li>List all classes for discovery</li>
            <li>Retrieve raw markdown documentation</li>
          </ul>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"What methods does dw.catalog.Product have for pricing?"</li>
              <li>"Search SFCC classes related to inventory."</li>
              <li>"Show raw documentation for dw.system.Transaction."</li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible id="sfra-docs" title="🏗️ Enhanced SFRA Documentation">
          <p className="text-sm">26+ documents with smart categorization (core, product, order, customer, pricing, store, other).</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Relevance-scored search with highlighted context</li>
            <li>Category filtering and model coverage</li>
            <li>Core classes: server, request, response, querystring, render</li>
            <li>Extensive product/order/customer/pricing/store models</li>
          </ul>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"Search SFRA docs for middleware examples."</li>
              <li>"Show differences between product-full and product-tile models."</li>
              <li>"List order-related SFRA documents and summarize each."</li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible id="isml-docs" title="📄 ISML Template Reference">
          <p className="text-sm">Complete ISML (Internet Store Markup Language) element documentation for template development.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Control flow elements (isif, isloop, isnext, isbreak, iscontinue)</li>
            <li>Output formatting (isprint with various formatting options)</li>
            <li>Includes & components (isinclude, iscomponent, isslot, isdecorate, isreplace)</li>
            <li>Scripting elements (isscript, isset for server-side logic)</li>
            <li>Caching (iscache for performance optimization)</li>
            <li>Category-based browsing and advanced search</li>
          </ul>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"Show me how to use isloop with paging."</li>
              <li>"What ISML elements are available for caching?"</li>
              <li>"Explain the difference between isinclude and iscomponent."</li>
              <li>"Search ISML elements for redirect functionality."</li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible id="logs" title="📊 Log & Job Log Analysis">
          <p className="text-sm mb-2">Real-time visibility into runtime behaviour plus deep job execution insight (multi-level logs in single files).</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Runtime Logs</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Latest error / warn / info / debug</li>
                <li>Pattern search & daily summarization</li>
                <li>Full file listing & tail reads</li>
                <li>Health & recurrence analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Job Logs</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Latest job log files</li>
                <li>Search by job name or pattern</li>
                <li>Execution summary (steps, timings)</li>
                <li>Unified multi-level parsing</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <strong className="font-semibold">Requires full mode:</strong> WebDAV / log tools need sandbox <code>username</code> & <code>password</code> (basic auth) plus any required realm access.
          </div>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"Show the latest 10 error log entries containing 'OCAPI'."</li>
              <li>"Summarize today’s log health and top recurring issues."</li>
              <li>"Get the latest job execution summary for ProductFeedJob."</li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible id="system-objects" title="⚙️ System & Custom Objects / Data Model">
          <p className="text-sm">Explore system & custom object schemas, attributes, groups and site preferences with advanced querying.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>List all system objects with metadata</li>
            <li>Attribute & group searches (boolean, text, sort)</li>
            <li>Custom object attribute discovery (targeted or match-all queries)</li>
            <li>Site preference group & value exploration</li>
          </ul>
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <strong className="font-semibold">Requires full mode:</strong> OCAPI system object & preference tools need <code>client_id</code> and <code>client_secret</code> with proper scopes (Data API + Shop as applicable).
          </div>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"List custom attributes for Product containing 'brand'."</li>
              <li>"Search site preferences in the SEO group for description fields."</li>
              <li>"Show attribute definitions for custom object Global_String matching 'locale'."</li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible id="code-versions" title="🔄 Code Version Management">
          <p className="text-sm">Manage deployment states directly via MCP.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>List available code versions</li>
            <li>Activate version to resolve endpoint or job issues</li>
            <li>AI can propose switches based on log diagnostics</li>
          </ul>
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <strong className="font-semibold">Requires full mode:</strong> Code version tools require OCAPI <code>client_id</code> and <code>client_secret</code> authorized for code/version management.
          </div>
          <div className="mt-4 text-xs text-slate-600">
            <p className="font-semibold mb-1 text-slate-700">Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"List code versions and highlight the active one."</li>
              <li>"Activate code version <em>int_release_2025_09</em>."</li>
              <li>"Which inactive code versions look safe to remove?"</li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible id="security-performance" title="🛡️ Security & Performance">
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Security</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Credential isolation & never persisted plaintext</li>
                <li>Path traversal & input validation guards</li>
                <li>Scoped tool surface (principle of least privilege)</li>
                <li>Structured error sanitization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Performance</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Layered caching & deduplicated requests</li>
                <li>Chunked log tailing (range reads)</li>
                <li>Lazy loading of heavy docs</li>
                <li>Resource bounding for single-dev usage</li>
              </ul>
            </div>
          </div>
        </Collapsible>

        <Collapsible id="ai-integration" title="🤖 AI Integration Rationale">
          <p className="text-sm">Designed so assistants like GitHub Copilot, Claude, and Cursor can produce higher-quality SFCC code with deterministic tool surfaces and enriched local context.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Deterministic tool naming & argument shapes</li>
            <li>High-signal, low-noise responses (agent friendly)</li>
            <li>Semantic grouping reduces prompt tokens</li>
            <li>Guides & raw docs unify knowledge surface</li>
          </ul>
        </Collapsible>
      </section>

      {/* NEXT STEPS (aligned with home/config CTA style) */}
      <section className="mt-20 mb-12 text-center" aria-labelledby="next-steps">
        <H2 id="next-steps" className="text-3xl font-bold mb-4">🔗 Next Steps</H2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8">Pick a direction—inspect the precise tool surface first or jump straight into multi-step usage patterns.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <NavLink 
            to="/tools/" 
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline"
          >
            Browse Tools
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </NavLink>
          <NavLink 
            to="/examples/" 
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline"
          >
            Examples & Use Cases
          </NavLink>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8 text-left">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-sm mb-2">Need exact tool names?</h3>
            <p className="text-xs text-gray-600">The tools catalog lists arguments & intent so you can craft precise, low-token prompts.</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-semibold text-sm mb-2 text-blue-800">Prefer guided flows?</h3>
            <p className="text-xs text-blue-800">Example sequences show chained usage (docs → logs → versions) ready to reuse.</p>
          </div>
        </div>
        <div className="mx-auto max-w-xl p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          💡 <strong>Tip:</strong> Ask: <em>"Suggest a workflow to inspect a product attribute then trace related log errors using available tools."</em>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
