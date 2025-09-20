import React from 'react';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { InlineCode } from '../components/CodeBlock';

// Small utility card
const Pill: React.FC<React.PropsWithChildren<{ color?: string }>> = ({ children, color = 'from-blue-600 to-purple-600' }) => (
  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${color} text-white px-4 py-2 rounded-full text-sm font-medium`}>{children}</div>
);

const Bullet: React.FC<React.PropsWithChildren<{ icon?: string; className?: string }>> = ({ children, icon = '✔', className = '' }) => (
  <li className={`flex items-start gap-2 text-sm text-gray-700 ${className}`}>
    <span className="mt-0.5 text-green-600 flex-shrink-0">{icon}</span>
    <span>{children}</span>
  </li>
);

const SectionShell: React.FC<React.PropsWithChildren<{ gradient?: string; className?: string; border?: string }>> = ({ children, gradient = 'from-blue-50 via-indigo-50 to-purple-50', className = '', border = 'border-blue-100' }) => (
  <div className={`mb-20 last:mb-0 bg-gradient-to-r ${gradient} rounded-2xl p-8 shadow-xl ${border} border ${className}`}>{children}</div>
);

// Structured feature list rows for mode comparison
const ModeFeatureList: React.FC<{ color: 'green' | 'blue'; items: Array<{ icon: string; label: string; detail: string }> }> = ({ color, items }) => {
  const colorMap = {
    green: {
      badge: 'bg-green-100 text-green-800 border-green-200',
      icon: 'text-green-600',
      label: 'text-green-900',
      detail: 'text-green-700'
    },
    blue: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: 'text-blue-600',
      label: 'text-blue-900',
      detail: 'text-blue-700'
    }
  } as const;
  const c = colorMap[color];
  return (
    <ul className="list-none p-0 m-0 space-y-3">
      {items.map(item => (
        <li key={item.label} className="group">
          <div className={`flex items-start gap-3 rounded-xl border ${c.badge} bg-white/70 backdrop-blur-sm px-3 py-2 hover:shadow-sm transition`}> 
            <span className={`text-base leading-none mt-0.5 ${c.icon}`}>{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`m-0 text-sm font-medium ${c.label}`}>{item.label}</p>
              <p className={`m-0 text-[11px] leading-snug ${c.detail}`}>{item.detail}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const SecurityPage: React.FC = () => {
  const securityStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Security & Privacy - SFCC Development MCP Server",
    "description": "Security guidelines and privacy considerations for SFCC Development MCP Server. Credential protection, threat mitigations, data handling and secure usage checklist.",
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
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/security/",
    "mainEntity": {
      "@type": "Guide",
      "name": "SFCC MCP Security Guide"
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <SEO 
        title="Security & Privacy"
        description="Security guidelines and privacy considerations for SFCC Development MCP Server. Credential protection, threat mitigations, data handling and secure usage checklist."
        keywords="SFCC MCP security, Commerce Cloud security, MCP server privacy, SFCC credential protection, development security, API security, local development security, SFCC authentication security"
        canonical="/security/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Security", url: "/security/" }
      ]} />
      <StructuredData structuredData={securityStructuredData} />
      
      {/* Hero */}
      <header className="text-center mb-16">
        <Pill>Security & Privacy</Pill>
        <H1 id="security-guidelines" className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mt-6 mb-6">Built-In Guardrails – You Add Discipline</H1>
        <PageSubtitle className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Opinionated local-only design: minimal credential footprint, scoped API access, defensive parsing. Use this page as a <strong>practical hardening checklist</strong>, not a marketing overview.
        </PageSubtitle>
      </header>

      {/* Quick Essentials */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {[
          { title: 'Local Only', desc: 'Never deploy to shared or production infra. No multi-user isolation layer exists.' },
          { title: 'Least Privilege', desc: 'Grant only OCAPI resources you actively need.' },
          { title: 'No Persistent Secrets', desc: 'Credentials live in memory during execution; you own filesystem storage strategy.' }
        ].map(card => (
          <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">{card.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Mode Comparison */}
      <SectionShell>
        <div className="text-center mb-10">
          <H2 id="modes" className="text-3xl font-bold mb-3">🔐 Modes & Security Characteristics</H2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            Both modes are designed for <strong>local single‑developer use</strong>. Docs mode has a <em>zero credential surface</em>; Full Mode’s profile is essentially the same as any normal SFCC development workflow using a <InlineCode>dw.json</InlineCode> for OCAPI + WebDAV access. Choose based on capability needs, not fear—just scope credentials sensibly.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Docs Mode Card */}
          <div className="rounded-2xl bg-green-50 border border-green-200 p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm shadow">D</span>
              Docs Mode (Default)
            </h3>
            <ModeFeatureList
              color="green"
              items={[
                { icon: '❇', label: 'No credentials required', detail: 'Pure static: zero auth surface' },
                { icon: '📄', label: 'Static content only', detail: 'Docs, guides, cartridge scaffolding' },
                { icon: '🧱', label: 'No outbound authenticated calls', detail: 'Nothing to leak or revoke' },
                { icon: '🧪', label: 'Safe capability exploration', detail: 'Great for AI tool schema discovery' },
                { icon: '�', label: 'Instant reversible baseline', detail: 'Add credentials later without refactor' }
              ]}
            />
            <div className="mt-5 text-[11px] text-green-700 font-medium bg-white/60 rounded-md px-3 py-2 border border-green-200">
              Baseline mode: zero credential management, ideal first run.
            </div>
          </div>
          {/* Full Mode Card */}
          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm shadow">F</span>
              Full Mode (<InlineCode>--dw-json</InlineCode>)
            </h3>
            <ModeFeatureList
              color="blue"
              items={[
                { icon: '🔑', label: 'Credential parity', detail: 'Same auth data you already use locally' },
                { icon: '📂', label: 'Read‑only log + model insight', detail: 'Tail/range only – no mutation endpoints' },
                { icon: '🧭', label: 'Data model discovery', detail: 'System objects & site preferences (metadata focus)' },
                { icon: '🚦', label: 'Explicit version activation', detail: 'Only on direct command; never implicit' },
                { icon: '⚙', label: 'Adjustable OCAPI scope', detail: 'Grant incrementally; remove when done' }
              ]}
            />
            <div className="mt-5 text-[11px] text-blue-700 font-medium bg-white/60 rounded-md px-3 py-2 border border-blue-200">
              Comparable risk to normal SFCC dev with <InlineCode>dw.json</InlineCode>; treat scope hygiene the same.
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-600 text-center">Switch between modes freely: omit <InlineCode>--dw-json</InlineCode> to return to a zero‑credential baseline.</div>
      </SectionShell>
      {/* Inline component definitions for mode feature rows */}
      {/* Keeping them near usage for maintainability; extract later if reused */}
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}

      {/* Hardening Checklist */}
      <SectionShell gradient="from-gray-50 via-slate-50 to-blue-50" border="border-gray-200">
        <div className="text-center mb-8">
          <H2 id="checklist" className="text-3xl font-bold mb-3">📋 Baseline Hardening Checklist</H2>
          <p className="text-gray-700 max-w-2xl mx-auto">Perform these once per environment. Keep it lightweight; delete unused credentials.</p>
        </div>
        <ol className="grid md:grid-cols-2 gap-6 counter-reset list-none pl-0">
          {[
            'Confirm sandbox hostname (never production domain).',
            'Add dw.json + *.dw.json to .gitignore and verify not tracked.',
            'chmod 600 dw.json (owner read/write only).',
            'Remove unused OAuth fields if only using logs.',
            'Grant only required OCAPI resources (add incrementally).',
            'Mask secrets with environment overrides in CI contexts.',
            'Run docs mode first; validate tool set boundaries.',
            'Rotate client secret + password on schedule (quarterly baseline).'
          ].map(item => (
            <li key={item} className="relative pl-10 text-sm text-gray-700 leading-relaxed">
              <span className="absolute left-0 top-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-xs font-semibold shadow">{String(([
                'Confirm sandbox hostname (never production domain).',
                'Add dw.json + *.dw.json to .gitignore and verify not tracked.',
                'chmod 600 dw.json (owner read/write only).',
                'Remove unused OAuth fields if only using logs.',
                'Grant only required OCAPI resources (add incrementally).',
                'Mask secrets with environment overrides in CI contexts.',
                'Run docs mode first; validate tool set boundaries.',
                'Rotate client secret + password on schedule (quarterly baseline).'
              ].indexOf(item) + 1))}</span>
              {item}
            </li>
          ))}
        </ol>
      </SectionShell>

      {/* Credential Handling */}
      <SectionShell gradient="from-emerald-50 via-teal-50 to-cyan-50" border="border-emerald-200">
        <div className="grid md:grid-cols-3 gap-8 mb-6 items-start">
          <div className="md:col-span-3 max-w-2xl">
            <H2 id="credentials" className="text-2xl font-bold mb-2">🛡️ Credential Handling</H2>
            <p className="text-sm text-gray-700 leading-relaxed">You retain full control of persistence. The server reads your <InlineCode>dw.json</InlineCode> once, hydrates in-memory configuration, and performs authenticated calls. No outbound exfiltration logic exists.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-2">Minimize Scope</h3>
            <ul className="text-xs space-y-1 text-gray-600 list-disc pl-4">
              <li>Start w/ no Data API resources</li>
              <li>Add system objects only when needed</li>
              <li>Remove stale resources quarterly</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-2">Protect Files</h3>
            <ul className="text-xs space-y-1 text-gray-600 list-disc pl-4">
              <li><InlineCode>chmod 600 dw.json</InlineCode></li>
              <li>Avoid shared directories (Sync/Drive)</li>
              <li>Do not email secrets</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-2">Rotate & Audit</h3>
            <ul className="text-xs space-y-1 text-gray-600 list-disc pl-4">
              <li>Quarterly secret rotation baseline</li>
              <li>Remove orphaned API clients</li>
              <li>Track creation dates (label names)</li>
            </ul>
          </div>
        </div>
      </SectionShell>

      {/* Threat Model & Mitigations */}
      <SectionShell gradient="from-red-50 via-rose-50 to-orange-50" border="border-red-200">
        <div className="text-center mb-10">
          <H2 id="threat-model" className="text-3xl font-bold mb-3">🧪 Practical Threat Model (Local Context)</H2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">In a single‑developer local setup the incremental risk introduced by Full Mode is roughly equivalent to any normal use of <InlineCode>dw.json</InlineCode>. Core concerns remain <strong>credential scope creep</strong>, <strong>accidental sharing of log snippets containing business data</strong>, and <strong>copying sensitive preference values externally</strong>. Below: built‑in mitigations vs. your ongoing hygiene tasks.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl bg-white p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-900">Mitigated In Design</h3>
            <ul className="space-y-2 text-sm">
              <Bullet>Path traversal (validated absolute paths)</Bullet>
              <Bullet>Parameter schema/type validation</Bullet>
              <Bullet>Read-only log operations (no writes)</Bullet>
              <Bullet>Scoped tool registration (no dynamic eval)</Bullet>
              <Bullet>Token refresh w/ expiration handling</Bullet>
              <Bullet>Memory-only caching (no disk persistence)</Bullet>
            </ul>
          </div>
          <div className="rounded-xl bg-white p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-900">Your Responsibilities</h3>
            <ul className="space-y-2 text-sm">
              <Bullet icon="⚠">Do not run on shared multi-user servers</Bullet>
              <Bullet icon="⚠">Keep secrets out of version control</Bullet>
              <Bullet icon="⚠">Avoid copying raw logs with PII into tickets</Bullet>
              <Bullet icon="⚠">Limit OCAPI resources to active feature work</Bullet>
              <Bullet icon="⚠">Rotate credentials + revoke unused clients</Bullet>
              <Bullet icon="⚠">Disable debug once diagnosing finished</Bullet>
            </ul>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6 text-xs">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-800 mb-1">Docs Mode</p>
            <p className="text-green-700 leading-snug">Static reference + generation only. Zero credential or data surface.</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-800 mb-1">Full Mode (Scoped)</p>
            <p className="text-blue-700 leading-snug">Typical local dev parity: targeted OCAPI, selective log tailing, metadata queries.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-800 mb-1">Broad Scope (Review)</p>
            <p className="text-amber-700 leading-snug">Wide OCAPI grants + continuous debug + indiscriminate log sharing. Still local—but audit and prune.</p>
          </div>
        </div>
      </SectionShell>

      {/* Data Protection */}
      <SectionShell gradient="from-yellow-50 via-amber-50 to-orange-50" border="border-amber-200">
        <div className="grid md:grid-cols-3 gap-8 mb-6 items-start">
          <div className="md:col-span-2 max-w-2xl">
            <H2 id="data-protection" className="text-2xl font-bold mb-2">💾 Data Handling & Privacy</H2>
            <p className="text-sm text-gray-700 leading-relaxed">Runtime data (logs, attribute listings, preference search results) is streamed, parsed, optionally cached in memory, and discarded on process exit.</p>
          </div>
            <div className="md:col-span-1 rounded-lg border border-yellow-300 bg-white p-5 text-[13px] text-yellow-800 shadow-sm min-w-[260px]">
            <p className="font-semibold mb-2 tracking-tight">Design Principles</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>No silent disk writes</li>
              <li>Bounded tail reads (~200KB)</li>
              <li>Optional debug noise suppression</li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Log Processing', items: ['Tail/range reads only', 'Pattern search server-side constrained', 'Aggregation sanitizes obvious secrets'] },
            { title: 'Preference Values', items: ['Password types masked by default', 'No attempt to unmask', 'Search limited to specified groups'] },
            { title: 'System Objects', items: ['Attribute metadata only', 'No PII enrichment routines', 'Developer chooses query breadth'] }
          ].map(card => (
            <div key={card.title} className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="font-semibold text-sm mb-2">{card.title}</h3>
              <ul className="text-xs space-y-1 text-gray-600 list-disc pl-4">
                {card.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Reporting */}
      <SectionShell gradient="from-slate-50 via-gray-50 to-blue-50" border="border-gray-200">
        <div className="text-center mb-8">
          <H2 id="reporting" className="text-3xl font-bold mb-3">🔍 Responsible Disclosure</H2>
          <p className="text-gray-700 max-w-2xl mx-auto">Found a vulnerability? Help strengthen the ecosystem—avoid public zero-days.</p>
        </div>
        <ol className="list-decimal pl-6 space-y-3 text-sm text-gray-700 max-w-3xl mx-auto">
          <li><strong>Do NOT</strong> open a public GitHub issue containing exploit details.</li>
          <li>Email maintainers with: version, environment, reproduction steps, impact summary.</li>
          <li>Suggest a remediation direction if obvious (helps triage).</li>
          <li>Allow a reasonable patch window before disclosure.</li>
          <li>Re-test once patch is published; confirm mitigation completeness.</li>
        </ol>
      </SectionShell>

      {/* Final CTA */}
      <section className="mt-24 text-center" aria-labelledby="next-steps-security">
        <H2 id="next-steps-security" className="text-3xl font-bold mb-4">🔗 Next Steps</H2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8">Keep momentum: refine configuration or explore advanced tooling now that baseline security posture is set.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="/configuration/"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline"
          >
            Configuration Guide
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </a>
          <a
            href="/features/"
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline"
          >
            Explore Features
          </a>
          <a
            href="/examples/"
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline"
          >
            See Examples
          </a>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
