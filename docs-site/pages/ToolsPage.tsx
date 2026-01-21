import React from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, PageSubtitle } from '../components/Typography';
import ToolFilters from '../components/ToolFilters';
import ToolCard from '../components/ToolCard';
import { tools, popularTools } from '../utils/toolsData';
import { SITE_DATES } from '../constants';

const ToolsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [showPopularExpanded, setShowPopularExpanded] = React.useState(true);

  const popularQuickActions = React.useMemo(
    () => popularTools.filter((tool) => tool.id !== 'sync-agent-instructions'),
    []
  );

  const filtered = tools.filter(t => {
    const inCat = activeCategory === 'All' || t.category === activeCategory;
    if (!inCat) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.examples?.some(e => e.toLowerCase().includes(q)) ||
      t.params?.some(p => p.name.toLowerCase().includes(q)) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  });

  const toolsStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Available Tools & APIs - SFCC Development MCP Server",
    "description": "Interactive reference of SFCC Development MCP Server tools with filtering, search, examples, and quick start actions.",
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
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/tools/",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "SFCC Development MCP Server",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Node.js",
      "description": "Interactive API reference and tools catalog",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <SEO 
        title="Available Tools & APIs"
        description="Interactive reference of SFCC Development MCP Server tools with filtering, search, examples, and quick start actions."
        keywords="SFCC MCP tools, Commerce Cloud APIs, log analysis, system objects, cartridge generation, agent instructions, skills"
        canonical="/tools/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Tools", url: "/tools/" }
      ]} />
      <StructuredData structuredData={toolsStructuredData} />
      
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>🛠️</span> Available Tools
        </div>
        <H1 id="available-tools" className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">Interactive Tool Explorer</H1>
        <PageSubtitle className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {tools.length} specialized tools. Filter by category, search prompts, copy examples, and get productive in seconds.
        </PageSubtitle>
      </div>

      {/* Quick Actions / Popular */}
      <section className="mb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-xl border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h2 id="quick-actions" className="text-2xl font-bold text-gray-900 mb-1">🚀 Quick Actions</h2>
              <p className="text-sm text-gray-600">Most common starting points – copy and ask your AI now.</p>
            </div>
            <button onClick={() => setShowPopularExpanded(e=>!e)} className="text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg transition">
              {showPopularExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {showPopularExpanded && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {popularQuickActions.map(tool => (
                <div key={tool.id} className="relative rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm group">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-xs font-semibold text-gray-800">{tool.name}</p>
                    <button
                      onClick={() => {
                        const ex = tool.examples?.[0];
                        if (ex) navigator.clipboard.writeText(ex);
                      }}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded transition"
                    >Copy</button>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all">{tool.description}</p>
                  {tool.examples && tool.examples.length > 0 && (
                    <p className="mt-2 text-[11px] text-gray-500 italic">{tool.examples[0]}</p>
                  )}
                  <a href={`#${tool.id}`} className="absolute inset-0" aria-label={`Jump to ${tool.name}`}></a>
                </div>
              ))}
              <div className="relative rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm group">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-xs font-semibold text-amber-700">sync_agent_instructions</p>
                  <button
                    onClick={() => navigator.clipboard.writeText('Run sync_agent_instructions (dryRun=false) to install AGENTS.md + skills into this SFCC workspace')}
                    className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-0.5 rounded transition"
                  >Copy</button>
                </div>
                <p className="text-[11px] text-amber-800 line-clamp-2 group-hover:line-clamp-none transition-all">
                  Bootstrap your project with AGENTS.md + the bundled SFCC skills so your AI assistant follows consistent patterns.
                </p>
                <p className="mt-2 text-[11px] text-amber-600 italic">Run sync_agent_instructions (dryRun=false) to install AGENTS.md + skills</p>
                <a href="#sync-agent-instructions" className="absolute inset-0" aria-label="Jump to sync_agent_instructions"></a>
              </div>
            </div>
          )}
      </section>

      {/* Filters */}
      <div className="mb-10">
        <ToolFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} search={search} setSearch={setSearch} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 items-center text-[11px] text-gray-600 mb-6">
        <span className="flex items-center gap-1"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Full</span> Requires credentials</span>
        <span className="flex items-center gap-1"><span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">Docs + Full</span> Both modes</span>
      </div>

      {/* Results */}
      <div className="space-y-14">
        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
            <p className="text-sm text-gray-600 mb-4">No tools match that search.</p>
            <p className="text-xs text-gray-500">Tip: Try a simpler keyword like <strong>log</strong>, <strong>class</strong>, or <strong>version</strong>.</p>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5">
            {filtered.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        )}
      </div>

      {/* Getting Started Hint */}
      <div className="mt-20 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Mode Recommendation</h3>
  <p className="text-xs text-blue-800 leading-relaxed">Explore freely in Documentation Mode first. Add <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">--dw-json</code> later to unlock log analysis, system & custom object exploration, job log insights, and code version management without changing any other configuration.</p>
      </div>

      {/* Next Steps */}
      <section className="mt-24 mb-12 text-center" aria-labelledby="next-steps">
        <h2 id="next-steps" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">🔗 Next Steps</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8">Move from raw tool surface into practical flows or reinforce secure patterns before enabling full-mode capabilities.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <NavLink
            to="/examples/"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline"
          >
            Examples & Use Cases
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </NavLink>
          <NavLink
            to="/security/"
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline"
          >
            Security Guidance
          </NavLink>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-4 text-left">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-sm mb-2">Why start with examples?</h3>
            <p className="text-xs text-gray-600">Shortens prompt iteration by showing multi-step sequences that combine docs lookup, log inspection, and object introspection.</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-semibold text-sm mb-2 text-blue-800">Why review security now?</h3>
            <p className="text-xs text-blue-700">Prevents leaking credentials, encourages safe log handling, and sets a baseline for principle-of-least-privilege tokens before automation.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolsPage;
