import React from 'react';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle } from '../components/Typography';

const ModeBadge: React.FC<{ children: React.ReactNode; variant?: 'docs' | 'full' | 'mixed' }> = ({ children, variant = 'docs' }) => {
    const styles: Record<string, string> = {
        docs: 'bg-green-100 text-green-700 border-green-300',
        full: 'bg-blue-100 text-blue-700 border-blue-300',
        mixed: 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border ${styles[variant]}`}>{children}</span>;
};

const SectionCard: React.FC<{ children: React.ReactNode; gradient?: string; id?: string; title?: string; icon?: string; subtitle?: string }>
    = ({ children, gradient = 'from-slate-50 via-white to-slate-50', id, title, icon, subtitle }) => (
    <section id={id} className="relative mb-14 scroll-mt-20">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl`} />
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-sm p-6 md:p-8 shadow-sm">
            {title && (
                <div className="mb-5">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-start gap-3">
                        <span className="text-xl md:text-2xl" aria-hidden="true">{icon}</span>
                        <span>{title}</span>
                    </h3>
                    {subtitle && <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    </section>
);

const PromptBlock: React.FC<{ prompt: string; intent?: string; }> = ({ prompt, intent }) => (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-5">
        <p className="text-slate-700 text-sm leading-relaxed">
            <span className="font-semibold text-slate-900">Prompt:</span> "{prompt}"{intent && <span className="block mt-1 text-xs text-slate-500">Intent: {intent}</span>}
        </p>
    </div>
);

const StepsList: React.FC<{ steps: Array<{ label: string; tool?: string; mode?: 'docs' | 'full'; note?: string; }> }>
    = ({ steps }) => (
    <ol className="list-decimal pl-6 space-y-2 text-sm md:text-base">
        {steps.map((s, i) => (
            <li key={i} className="leading-relaxed">
                <span className="font-medium text-slate-800">{s.label}</span>
                {s.tool && (
                    <span className="block mt-1 font-mono text-xs md:text-[13px] bg-slate-900 text-slate-100 rounded px-2 py-1 w-fit">{s.tool}</span>
                )}
                {s.note && <div className="mt-1 text-xs text-slate-500">{s.note}</div>}
                {s.mode && <div className="mt-1"><ModeBadge variant={s.mode === 'docs' ? 'docs' : 'full'}>{s.mode === 'docs' ? 'Docs Mode' : 'Full Mode'}</ModeBadge></div>}
            </li>
        ))}
    </ol>
);

const ExamplesPage: React.FC = () => {
    const examplesStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Examples & Workflows - SFCC Development MCP Server",
        "description": "Prompt-first, end-to-end examples showing how to leverage the SFCC Development MCP Server with AI assistants for real development tasks.",
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
        "url": "https://sfcc-dev-mcp.rhino-inquisitor.com/examples",
        "educationalLevel": "intermediate",
        "learningResourceType": "tutorial"
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <SEO 
                title="Examples & Workflows"
                description="Prompt-first, end-to-end examples showing how to leverage the SFCC Development MCP Server with AI assistants for real development tasks. Focus on actionable, production-grade outputs."
                keywords="SFCC examples, Commerce Cloud prompts, MCP workflows, SFCC AI prompts, cartridge generation, log analysis examples"
                canonical="/examples"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Examples", url: "/examples" }
            ]} />
            <StructuredData data={examplesStructuredData} />
            
            <div className="text-center mb-14">
                <H1 id="examples">💡 Prompt-First Examples</H1>
                <PageSubtitle>
                    Copy a prompt. Paste it into your AI assistant. Get a production-quality answer. Each section shows the exact
                    request, the tool usage behind the scenes, and the kind of response you should expect.
                </PageSubtitle>
                <p className="text-sm text-slate-500 max-w-2xl mx-auto">No repetition of feature marketing here—only concrete, minimal, high-signal examples.</p>
            </div>

            <SectionCard
                id="explore-class"
                title="Explore an SFCC Class Quickly"
                icon="📚"
                gradient="from-green-50 via-white to-emerald-50"
                subtitle="Use documentation tools to pull authoritative class context, then build with confidence."
            >
                <PromptBlock prompt="Show me everything important about dw.catalog.Product, including methods I actually use in pricing or variation contexts." intent="Documentation deep dive → actionable subset" />
                <div className="mb-4 flex flex-wrap gap-2">
                    <ModeBadge>Docs Mode</ModeBadge>
                </div>
                <StepsList steps={[
                    { label: 'Search for candidate classes (confirmation)', tool: 'search_sfcc_classes {"query": "product"}', mode: 'docs' },
                    { label: 'Fetch class details', tool: 'get_sfcc_class_info {"className": "dw.catalog.Product"}', mode: 'docs' },
                    { label: 'Cross reference pricing model', tool: 'get_sfcc_class_info {"className": "dw.catalog.PriceModel"}', mode: 'docs', note: 'Inspect pricing methods' }
                ]} />
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Assistant Consolidation (grounded in tool output):</p>
                    <CodeBlock language="markdown" code={`### Focused Summary: dw.catalog.Product
Pulled full class definition (get_sfcc_class_info → dw.catalog.Product) and reduced to what typically drives storefront pricing / availability / variation logic.

Identity & Routing:
• ID, name, pageURL for canonical + SEO.
• onlineFlag vs online (flag is raw, online applies scheduling window).

Pricing:
• priceModel.getPrice().value / currencyCode for base price display.
• Use getPriceModel(optionModel) when option selections adjust pricing.
• Guard: priceModel can be null on offline or misconfigured variants.

Availability:
• availabilityModel.isInStock() and availabilityModel.getATS()?.value for inventory messaging.
• Avoid deprecated isAvailable()/getAvailableFlag(); rely on availabilityModel.

Variation Handling:
• isMaster() / isVariant() to branch logic.
• variationModel.getVariants() (iterate then filter by onlineFlag).
• Image fallback: getImage('small', 0) (uses variant images, then master fallback); avoid deprecated no-arg getImage().

Navigation / Category Context:
• onlineCategories preferred for building live nav trees; allCategories includes offline / non-site assignments.

Common Pitfalls & Mitigations:
1. Null priceModel → defensive optional chaining.
2. Using deprecated availability helpers → switch to availabilityModel.
3. Assuming images exist → null check getImage before URL access.
4. Iterating variants without online gating → filter by v.onlineFlag.

Minimal Access Snippet:
\`var pm = p.getPriceModel();\nvar price = pm ? pm.getPrice().value : null;\nvar inStock = p.getAvailabilityModel().isInStock();\nif (p.isMaster()) {\n  var variants = p.getVariationModel().getVariants().toArray().filter(v => v.onlineFlag);\n}\`
`} />
                </div>
            </SectionCard>

            <SectionCard
                id="focused-class-exploration"
                title="Focused Class Exploration with Filtering"
                icon="🔍"
                gradient="from-emerald-50 via-white to-teal-50"
                subtitle="Use enhanced filtering and search to find exactly what you need from SFCC classes."
            >
                <PromptBlock prompt="I need to understand only the getter methods in dw.catalog.Product that relate to pricing or availability. Don't show me everything." intent="Targeted exploration with precise filtering" />
                <div className="mb-4 flex flex-wrap gap-2">
                    <ModeBadge>Docs Mode</ModeBadge>
                </div>
                <StepsList steps={[
                    { label: 'Show only methods with price-related terms', tool: 'get_sfcc_class_info {"className": "dw.catalog.Product", "includeProperties": false, "includeConstants": false, "includeDescription": false, "includeInheritance": false, "search": "price"}', mode: 'docs' },
                    { label: 'Show only methods with availability terms', tool: 'get_sfcc_class_info {"className": "dw.catalog.Product", "includeProperties": false, "includeConstants": false, "includeDescription": false, "includeInheritance": false, "search": "availab"}', mode: 'docs' },
                    { label: 'Compare with full getter methods', tool: 'get_sfcc_class_info {"className": "dw.catalog.Product", "includeProperties": false, "includeConstants": false, "includeDescription": false, "includeInheritance": false, "search": "get"}', mode: 'docs', note: 'See complete getter landscape' }
                ]} />
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Focused Results (price-related methods only):</p>
                    <CodeBlock language="markdown" code={`### dw.catalog.Product - Price Methods Only

**Methods:**
• getPriceModel() : PriceModel - Returns pricing model for current product
• getPriceModel(ProductOptionModel) : PriceModel - Returns pricing with option adjustments

**Key Benefits:**
- Clean, targeted view without noise from 50+ other methods
- Focus on exactly what's needed for pricing logic
- Search functionality quickly surfaces relevant APIs`} />
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800"><strong>Pro Tip:</strong> Use <code>search</code> parameter with partial terms like "get", "set", "price", "availab" to quickly find relevant methods. Combine with <code>includeProperties: false</code> to focus only on methods.</p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                id="controller-from-docs"
                title="Generate a Controller from Documentation Context"
                icon="🛠️"
                gradient="from-blue-50 via-white to-indigo-50"
                subtitle="Documentation → intent → runnable controller with guard rails."
            >
                <PromptBlock prompt="Using SFRA patterns, create a Product-Show like controller action that handles missing products, logs errors, and renders a view model with price + availability." intent="Transform docs into production-safe code" />
                <ModeBadge>Docs Mode</ModeBadge>
                <div className="mt-4 text-sm text-slate-600">Assistant internally referenced previously fetched class info; no additional tool calls required now.</div>
                <div className="mt-6">
                    <CodeBlock language="javascript" code={`// app_storefront_base/cartridge/controllers/CustomProduct.js
'use strict';
var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    var pid = req.querystring.pid;
    if (!pid) {
        res.setStatusCode(400); res.render('error/badrequest'); return next();
    }
    try {
        var product = ProductMgr.getProduct(pid);
        if (!product || !product.onlineFlag) {
            res.setStatusCode(404); res.render('error/notfound'); return next();
        }
        var availability = product.getAvailabilityModel();
        var priceModel = product.getPriceModel();
        var viewModel = {
            id: product.ID,
            name: product.name,
            price: priceModel ? priceModel.getPrice().value : null,
            currency: priceModel ? priceModel.getPrice().currencyCode : null,
            inStock: availability.isInStock(),
            ats: availability.getATS && availability.getATS().value,
            images: product.getImages('small', 0).toArray().map(function(i){return i.URL;})
        };
        res.render('product/customProduct', viewModel);
    } catch (e) {
        Logger.error('CustomProduct.Show error: {0}', e.message);
        res.setStatusCode(500); res.render('error/general');
    }
    return next();
});
module.exports = server.exports();`} />
                </div>
            </SectionCard>

            <SectionCard
                id="cartridge-generation"
                title="Scaffold a Feature Cartridge"
                icon="📦"
                gradient="from-purple-50 via-white to-fuchsia-50"
                subtitle="Go from blank folder to structured integration base."
            >
                <PromptBlock prompt="Generate a cartridge structure for a shipment tracking integration using hooks + a service layer and note follow-up tasks." intent="Structural generation + next actions" />
                <div className="mb-4 flex flex-wrap gap-2"><ModeBadge>Docs Mode</ModeBadge></div>
                <StepsList steps={[
                    { label: 'Generate skeleton', tool: 'generate_cartridge_structure {"cartridgeName": "int_tracking"}', mode: 'docs' },
                    { label: 'Request best practice follow-up', tool: 'get_best_practice_guide {"guideName": "cartridge_creation"}', mode: 'docs', note: 'Assistant merges guidance' }
                ]} />
                <div className="mt-6 space-y-8">
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Generated Tree (excerpt):</p>
                        <CodeBlock language="text" code={`int_tracking/
└── cartridge/
        ├── controllers/
        │   └── Tracking.js
        ├── scripts/
        │   ├── hooks/
        │   │   └── shipment.js
        │   └── services/
        │       └── TrackingService.js
        ├── templates/default/tracking/
        │   └── trackingstatus.isml
        └── static/default/js/tracking/`} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Assistant Adds Next Steps:</p>
                        <CodeBlock language="markdown" code={`1. Configure LocalServiceRegistry service: tracking.api
2. Implement hooks: updateShippingInfo, exportStatus
3. Add ISML partial to PDP for shipment ETA
4. Add logging category: TrackingIntegration
5. Write integration test harness for mocked API responses
`} />
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                id="full-mode-diff"
                title="Enhance with Live Logs (Full Mode)"
                icon="🧪"
                gradient="from-blue-50 via-white to-sky-50"
                subtitle="Same style of prompt—but now the assistant executes log tooling to ground its answer." >
                <PromptBlock prompt="Checkout is intermittently failing with payment declines—identify root causes from recent logs and propose concrete mitigations." intent="Diagnostic + remediation planning" />
                <div className="flex flex-wrap gap-2 mb-4"><ModeBadge variant="full">Full Mode</ModeBadge></div>
                <StepsList steps={[
                    { label: 'Daily context snapshot', tool: 'summarize_logs {"date": "20250916"}', mode: 'full', note: 'High-level counts first' },
                    { label: 'Attempt error retrieval', tool: 'get_latest_error {"limit": 15}', mode: 'full', note: 'May return none → fall back to warnings' },
                    { label: 'Focus on recurring warning pattern', tool: 'search_logs {"pattern": "cookie_hint", "logLevel": "warn", "limit": 5}', mode: 'full', note: 'Isolate noisy asset issue' },
                    { label: 'Cross-check security guidelines (token lifecycle / logging hygiene)', tool: 'get_best_practice_guide {"guideName": "security"}', mode: 'docs' }
                ]} />
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Assistant Narrative (validated with real tool set):</p>
                    <CodeBlock language="markdown" code={`### Live Log Triage (No Errors Detected Today)
1. summarize_logs → Errors: 0, Warnings: 27, no debug/info noise. Healthy baseline but warning cluster present.
2. get_latest_error → Returned none (expected—error file absent). Pivoting to warnings.
3. search_logs (pattern=cookie_hint, level=warn) → Multiple repeats: "Content asset with ID cookie_hint is offline" across distinct request contexts.

Assessment:
• Repeated offline content asset warnings inflate noise floor; risk of masking future meaningful warnings.
• No payment/auth related issues surfaced; current checkout remediation unnecessary.

Recommended Actions:
• Restore or intentionally remove the cookie_hint asset; if intentionally removed, suppress via conditional include.
• Add lightweight monitoring rule: if warning count for a single asset > X per hour, raise housekeeping task instead of polluting logs.
• Keep error path watch in place; re-run summarize_logs after remediation to confirm warning reduction.

If Errors Had Been Present (Pattern Skeleton):
• Step 1 would still be summarize_logs for counts → then targeted search_logs for signatures (e.g., AUTH_TIMEOUT, TOKEN_EXPIRED) followed by best practice cross-reference.
`} />
                </div>
            </SectionCard>

            <SectionCard
                id="job-log-analysis"
                title="Investigate a Failing Job"
                icon="🧵"
                gradient="from-amber-50 via-white to-yellow-50"
                subtitle="Targeted job log inspection with focused summarization." >
                <PromptBlock prompt="Analyze the latest CatalogFeed job execution – summarize step durations, failures, and recommend optimizations." intent="Temporal + failure analysis" />
                <div className="flex flex-wrap gap-2 mb-4"><ModeBadge variant="full">Full Mode</ModeBadge></div>
                <StepsList steps={[
                    { label: 'Discover job logs (filtered)', tool: 'search_job_logs_by_name {"jobName": "CatalogFeed", "limit": 5 }', mode: 'full', note: 'Find specific job log filenames' },
                    { label: 'List latest job logs (context)', tool: 'get_latest_job_log_files {"limit": 5 }', mode: 'full', note: 'Recency overview (no name filter)' },
                    { label: 'Fetch recent entries', tool: 'get_job_log_entries {"jobName": "CatalogFeed", "limit": 50, "level": "all" }', mode: 'full', note: 'Multi-level snapshot' },
                    { label: 'Search for errors', tool: 'search_job_logs {"pattern": "ERROR", "jobName": "CatalogFeed", "limit": 20 }', mode: 'full', note: 'If none → treat as healthy case' },
                    { label: 'Execution summary', tool: 'get_job_execution_summary {"jobName": "CatalogFeed"}', mode: 'full' }
                ]} />
                <div className="mt-6">
                    <CodeBlock language="markdown" code={`### CatalogFeed Execution Analysis (Validated Flow)
Flow Used:
1. search_job_logs_by_name → confirm job exists.
2. get_latest_job_log_files → establish relative recency.
3. get_job_log_entries (limit 50, all levels) → capture operational window.
4. search_job_logs (pattern=ERROR) → branch: errors vs healthy.
5. get_job_execution_summary → aggregate timing + status.

Illustrative Degraded Scenario (for instructional value):
Duration: 7m42s (↑18% vs rolling average)
Step Highlights:
• LOAD_PRODUCTS: 2m10s (warning — 312 fallback fetches suggests cache miss storm)
• EXPORT: 15 socket timeout retries before success (dominant latency source)

Primary Bottleneck: External export endpoint + un-jittered linear retry compounding latency.

Recommendations (priority order):
1. Reduce batch size 200→120 to shrink payload variance.
2. Exponential backoff + jitter (≤800ms, cap 6) for EXPORT retries.
3. Parallelize transform stage (2 workers) given idle CPU.
4. Emit structured metrics: step_duration_ms, retry_count to confirm remediation.

Healthy Case Note: If error search returns 0 (common for maintenance/cleanup jobs) emit concise summary only and skip remediation suggestions.
`} />
                </div>
            </SectionCard>

            <SectionCard
                id="system-object-attributes"
                title="Surface High-Value Custom Attributes"
                icon="🧬"
                gradient="from-rose-50 via-white to-pink-50"
                subtitle="Focus on signal: only the attributes you will likely act on in code." >
                <PromptBlock prompt="List only non-system custom Product attributes that impact pricing, display, or integrations—include access examples." intent="Selective attribute curation" />
                <div className="flex flex-wrap gap-2 mb-4"><ModeBadge variant="full">Full Mode</ModeBadge></div>
                <StepsList steps={[
                    { label: 'Search attribute definitions', tool: 'search_system_object_attribute_definitions {"objectType": "Product", "searchRequest": {"query": {"match_all_query": {}}}}', mode: 'full' },
                    { label: 'Filter & rank', note: 'Assistant filters system vs custom, groups by usage relevance' },
                ]} />
                <div className="mt-6">
                    <CodeBlock language="markdown" code={`### Curated Product Attribute Focus (Grounded in Live Metadata)
Source: search_system_object_attribute_definitions → 113 total attributes (first 30 sampled). We extracted *custom* (system=false) fields + a few pivotal system ones (clearly flagged) that materially influence merchandising, variation, UX, integration, or feed logic. Purely operational / audit (UUID, creationDate) or low-impact marketing fluff excluded.

Legend:
• Cat: Category of impact (Disp = Display/UX, Var = Variation, Facet = Faceting/Search, Int = Integration/Channel, Enr = Enrichment, Dim = Dimensions/Shipping)
• MV = multi-value (enum_of_string or multi_value_type true)
• SYS = system attribute retained for high value (otherwise we focus on custom)

| Attribute | Cat | Type | Flags | Rationale | Access Snippet |
|-----------|-----|------|-------|-----------|----------------|
| brand (SYS) | Facet/Disp | string | visible | Drives brand badges & facet grouping; high-frequency filter. | \`p.brand\` (system field, not in p.custom) |
| color | Var | string | custom | Variation presentation / swatch resolution; stored custom but effectively a core merchandising dimension. | \`p.custom.color\` |
| availableForInStorePickup | Int | boolean | custom, site-agnostic | Gating for store pickup workflows & conditional UI messaging. | \`if (p.custom.availableForInStorePickup) showPickup();\` |
| batteryLife | Enr/Disp | string | custom, visible | PDP spec table + comparison view; enriches SEO content. | \`p.custom.batteryLife\` |
| batteryType | Enr/Disp | string | custom, visible | Hardware spec grouping; feed enrichment for certain channels. | \`p.custom.batteryType\` |
| bootType | Facet | enum_of_string | custom, MV | Multi-select refinement facet; influences search narrowing logic. | \`p.custom.bootType && p.custom.bootType.toArray()\` |
| bottomType | Facet | enum_of_string | custom, MV | Apparel categorization & layered navigation. | \`(p.custom.bottomType||[]).toArray()\` |
| consoleWarranty | Int/Disp | string | custom | Extended service offering display + export to warranty provider feed. | \`p.custom.consoleWarranty\` |
| digitalCameraFeatures | Facet/Enr | enum_of_string | custom, MV, visible | Feature badges + facet refinement; high cardinality set. | \`p.custom.digitalCameraFeatures?.toArray()\` |
| digitalCameraPixels | Disp/Enr | string | custom, visible | Marketing resolution highlight; conditional comparison logic. | \`p.custom.digitalCameraPixels\` |
| digitalCameraType | Facet | string | custom, visible | Primary camera classification facet. | \`p.custom.digitalCameraType\` |
| digitalCameraWarranty | Int | string | custom | Feed & PDP legal/service disclosure. | \`p.custom.digitalCameraWarranty\` |
| dimDepth | Dim | string | custom, visible | Shipping dimensional weight calc if external DIM service absent. | \`Number(p.custom.dimDepth)\` |
| dimHeight | Dim | string | custom, visible | Parcel sizing / volumetric charge triggers. | \`Number(p.custom.dimHeight)\` |
| dimWeight | Dim | string | custom, visible | Fallback for missing system weight or override scenario. | \`Number(p.custom.dimWeight)\` |
| dimWidth | Dim | string | custom, visible | Combined with others for cubic volume. | \`Number(p.custom.dimWidth)\` |
| displaySize | Disp | string | custom, visible | Prominence in electronics PDP hero section + compare grid. | \`p.custom.displaySize\` |
| facebookEnabled (SYS) | Int | boolean | system, site_specific | Channel feed toggle – dictates inclusion in FB catalog export. | \`p.facebookEnabled\` |
| gameGenre | Facet | enum_of_string | custom, MV, visible | Multi-select discovery facet for gaming taxonomy. | \`p.custom.gameGenre?.toArray()\` |
| gameRating | Facet/Compliance | string | custom, visible | Age rating badge + compliance gating (e.g., age verification). | \`p.custom.gameRating\` |
| gameSystemType | Facet | string | custom, visible | Platform segmentation (PS/Xbox/Nintendo) – major navigation axis. | \`p.custom.gameSystemType\` |
| gpsFeatures | Facet/Enr | enum_of_string | custom, MV, visible | Feature-level refinement & badge cluster. | \`p.custom.gpsFeatures?.toArray()\` |
| Wool | Enr/Disp | string | custom, localizable, visible | Care instruction overlay & localized PDP sustainability note. | \`p.custom.Wool\` |

Why exclude others like EAN / UPC (system, typically handled upstream) or UUID (audit only)? They rarely drive conditional storefront logic once imported and are better treated as pass-through feed fields.

Implementation Notes:
1. Multi-value handling: Always null-check before toArray(); some may be undefined on non-merchandised variants.
2. Numeric coercion: DIM fields are strings – coerce with Number() and guard NaN before calculations.
3. Site specificity: facebookEnabled is site_specific – avoid caching decisions across sites without keying by site ID.
4. Variation interplay: color selection should reference variationAttribute values; treat p.custom.color as display fallback not authoritative source.
5. Performance: When projecting many attributes into a model, prefer a single transform object rather than repeated p.custom dereferencing inside loops.

Minimal Extraction Snippet:
\`var c = p.custom;\nvar model = {\n  brand: p.brand,\n  color: c.color,\n  pickupEligible: !!c.availableForInStorePickup,\n  dims: ['dimHeight','dimWidth','dimDepth','dimWeight'].reduce(function(acc,k){var v=c[k]; if(v && !isNaN(v)) acc[k.replace('dim','').toLowerCase()]=Number(v); return acc;}, {}),\n  features: (c.digitalCameraFeatures && c.digitalCameraFeatures.toArray()) || [],\n  care: c.Wool,\n  fbActive: p.facebookEnabled\n};\nif (c.bootType) model.bootType = c.bootType.toArray();\nif (c.gameGenre) model.gameGenre = c.gameGenre.toArray();\`
`} />
                </div>
            </SectionCard>

            {/* End-to-End section removed per request */}

            <SectionCard
                id="prompt-patterns"
                title="Prompt Patterns & Anti-Patterns"
                icon="🧭"
                gradient="from-slate-50 via-white to-slate-100"
                subtitle="Tight prompts yield grounded, production-usable outputs." >
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Effective Patterns</h4>
                        <ul className="space-y-2 text-sm list-disc pl-5">
                            <li><strong>Role + Scope:</strong> "Act as SFRA dev – generate..."</li>
                            <li><strong>Constraint:</strong> "Only include attributes affecting pricing."</li>
                            <li><strong>Mode Awareness:</strong> "Use live logs to confirm before proposing fixes."</li>
                            <li><strong>Transformation:</strong> "Summarize for junior dev handoff."</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Anti-Patterns</h4>
                        <ul className="space-y-2 text-sm list-disc pl-5">
                            <li>"Explain everything about SFCC" (Too broad)</li>
                            <li>"Fix checkout" (No signal / context)</li>
                            <li>Omitting objective (no success definition)</li>
                            <li>Forgetting mode capabilities (asks for logs in docs-only)</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Prompt Refinement Example:</p>
                    <CodeBlock language="markdown" code={`Weak: 
"Help with product page" 
Improved: 
"Generate an SFRA controller extension to enrich Product-Show with cached ATS and badge if sustainabilityRating >=3. Provide only changed code + template snippet."`} />
                </div>
            </SectionCard>

            <div className="text-center mt-20">
                <p className="text-lg text-slate-700 mb-6 font-medium">Ready to try these yourself?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/ai-interfaces" className="group no-underline hover:no-underline bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        Configure Your AI Client <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </a>
                    <a href="/tools" className="no-underline hover:no-underline border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                        Browse All Tools
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ExamplesPage;