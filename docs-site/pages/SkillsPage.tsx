import React from 'react';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, PageSubtitle, H2 } from '../components/Typography';
import { SITE_DATES } from '../constants';
import { SKILLS } from '../src/generated-skills-index';

const SkillsPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Agent Skills - SFCC Development MCP Server",
    "description": "Curated SFCC agent skills (portable instruction packs) for cartridge development, hooks, SFRA patterns, security, performance, and more.",
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
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/skills/"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <SEO
        title="Agent Skills"
        description="Curated SFCC agent skills (portable instruction packs) for cartridge development, hooks, SFRA patterns, security, performance, and more."
        keywords="SFCC agent skills, AI instructions, Copilot skills, Cursor rules, Claude instructions, SFRA patterns, OCAPI hooks, SCAPI hooks"
        canonical="/skills/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Skills', url: '/skills/' }
      ]} />
      <StructuredData structuredData={structuredData} />

      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>🧩</span> Agent Skills
        </div>
        <H1 id="skills" className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-900 to-amber-900 bg-clip-text text-transparent mb-6">
          Portable SFCC Know‑How
        </H1>
        <PageSubtitle className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Skills are versioned instruction packs your AI assistant can load to follow consistent SFCC patterns.
          They replace the older “best practice guide” docs and are designed to be copied into your editor/agent’s skills system.
        </PageSubtitle>
      </header>

      <section className="mb-12">
        <H2 id="how-to-use" className="mb-4">How to use skills</H2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Option A — Use the MCP bootstrap tool</h3>
            <p className="text-sm text-slate-600">
              Run <code>sync_agent_instructions</code> to install/merge <code>AGENTS.md</code> + the bundled skills into your project
              (or into a temp directory if you want to review changes first).
            </p>
            <ul className="mt-3 text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li>Recommended for SFCC repos missing <code>AGENTS.md</code> or a skills directory</li>
              <li>Supports dry-run planning and merge strategies</li>
              <li>Can target <code>.github/skills</code>, <code>.cursor/skills</code>, or <code>.claude/skills</code></li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Option B — Read directly on GitHub</h3>
            <p className="text-sm text-slate-600">
              Each skill is a Markdown document with frontmatter (<code>name</code>/<code>description</code>) and step-by-step guidance.
              You can link to it, copy it into your agent’s instruction system, or use it as a checklist.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <H2 id="available-skills" className="mb-2">Available skills</H2>
            <p className="text-sm text-slate-600">{SKILLS.length} skill packs bundled with this repository.</p>
          </div>
          <a
            href="https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-orange-700 hover:text-orange-900"
          >
            Browse all skills →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {SKILLS.map((skill) => (
            <a
              key={skill.name}
              href={skill.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs font-semibold text-slate-900 group-hover:text-orange-700 group-hover:underline decoration-orange-400 underline-offset-4 transition">
                  {skill.name}
                </p>
                <span className="text-xs text-slate-400">GitHub</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {skill.description || 'No description provided.'}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SkillsPage;
