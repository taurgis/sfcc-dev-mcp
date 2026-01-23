import React from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Collapsible } from '../components/Collapsible';
import CodeBlock from '../components/CodeBlock';
import { SITE_DATES } from '../constants';

const ScriptDebuggerPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Script Debugger - Execute JavaScript on SFCC Sandbox",
    "description": "Learn how to use the evaluate_script tool to execute JavaScript code directly on your SFCC sandbox instance via the script debugger API.",
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
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/script-debugger/"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <SEO 
        title="Script Debugger - Execute JavaScript on SFCC"
        description="Execute JavaScript code directly on your SFCC sandbox instance via the script debugger API. Test APIs, validate data, and debug issues in real-time."
        keywords="SFCC script debugger, evaluate script, SFCC JavaScript execution, sandbox testing, SFCC debugging, dw namespace"
        canonical="/script-debugger/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Features", url: "/features/" },
        { name: "Script Debugger", url: "/script-debugger/" }
      ]} />
      <StructuredData structuredData={structuredData} />

      <header className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          Script Debugger
        </div>
        <H1 id="script-debugger" className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
          Execute JavaScript on SFCC
        </H1>
        <PageSubtitle className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Run JavaScript code directly on your sandbox instance. Test APIs, validate data, and debug issues in real-time.
        </PageSubtitle>
      </header>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <H2 id="quick-start" className="text-2xl font-bold text-purple-900 mb-4">Quick Start</H2>
        <p className="text-gray-700 mb-4">
          Ask your AI assistant to run code on your SFCC instance:
        </p>
        <div className="bg-white rounded-lg p-4 border border-purple-200 mb-4">
          <p className="text-purple-800 font-medium italic">"What's the current site ID on my sandbox?"</p>
        </div>
        <p className="text-gray-600 text-sm">
          The AI will use <code className="bg-purple-100 px-1.5 py-0.5 rounded text-purple-800">evaluate_script</code> to execute:
        </p>
        <CodeBlock language="javascript" code="dw.system.Site.current.ID" />
        <p className="text-gray-600 text-sm mt-2">
          Result: <code className="bg-green-100 px-1.5 py-0.5 rounded text-green-800">"RefArch"</code>
        </p>
      </section>

      {/* Requirements */}
      <section className="mb-12">
        <H2 id="requirements" className="text-3xl font-bold mb-6">Requirements</H2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
              </div>
              <H3 className="text-lg font-semibold">Credentials</H3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>Valid <strong>dw.json</strong> credentials configured</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>Sandbox instance accessible</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
              </div>
              <H3 className="text-lg font-semibold">Cartridge Requirement</H3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span><strong>app_storefront_base</strong> (SFRA) deployed, or</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span><strong>app_storefront_controllers</strong> (SiteGenesis) deployed</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                <span className="text-gray-500">Or specify custom <code>breakpointFile</code> parameter</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            <div>
              <p className="text-red-800 font-medium">Username is Case-Sensitive</p>
              <p className="text-red-700 text-sm">The debug API requires the username to match <strong>exactly</strong> as it appears in Business Manager, including case. If you get unauthorized errors, verify the username casing in your dw.json matches your BM user exactly.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            <div>
              <p className="text-amber-800 font-medium">Sandbox Only</p>
              <p className="text-amber-700 text-sm">Only use the script debugger on sandbox/development instances, never on production.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Parameters */}
      <section className="mb-12">
        <H2 id="parameters" className="text-3xl font-bold mb-6">Tool Parameters</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold border border-slate-200">Parameter</th>
                <th className="text-left p-3 font-semibold border border-slate-200">Required</th>
                <th className="text-left p-3 font-semibold border border-slate-200">Default</th>
                <th className="text-left p-3 font-semibold border border-slate-200">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-purple-700">script</td>
                <td className="p-3 border border-slate-200"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">Yes</span></td>
                <td className="p-3 border border-slate-200 text-gray-400">—</td>
                <td className="p-3 border border-slate-200">The JavaScript code to execute</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-3 border border-slate-200 font-mono text-purple-700">siteId</td>
                <td className="p-3 border border-slate-200"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">No</span></td>
                <td className="p-3 border border-slate-200 font-mono text-sm">RefArch</td>
                <td className="p-3 border border-slate-200">Site ID (auto-formatted as <code>Sites-&#123;siteId&#125;-Site</code>)</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-purple-700">locale</td>
                <td className="p-3 border border-slate-200"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">No</span></td>
                <td className="p-3 border border-slate-200 font-mono text-sm">default</td>
                <td className="p-3 border border-slate-200">Storefront locale segment for the trigger request (locale-less trigger is attempted first, then locale is used as fallback)</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-purple-700">timeout</td>
                <td className="p-3 border border-slate-200"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">No</span></td>
                <td className="p-3 border border-slate-200 font-mono text-sm">30000</td>
                <td className="p-3 border border-slate-200">Maximum execution time in milliseconds</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-3 border border-slate-200 font-mono text-purple-700">breakpointFile</td>
                <td className="p-3 border border-slate-200"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">No</span></td>
                <td className="p-3 border border-slate-200 text-gray-400">Auto-detected</td>
                <td className="p-3 border border-slate-200">Custom controller path for breakpoint</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-purple-700">breakpointLine</td>
                <td className="p-3 border border-slate-200"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">No</span></td>
                <td className="p-3 border border-slate-200 font-mono text-sm">1</td>
                <td className="p-3 border border-slate-200">Line number for breakpoint (defaults to 1 when not provided)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Syntax Rules */}
      <section className="mb-12">
        <H2 id="syntax-rules" className="text-3xl font-bold mb-6">Script Syntax Rules</H2>
        
        <div className="space-y-6">
          <Collapsible id="do-expressions" title="✅ DO: Use expressions that return a value" defaultOpen>
            <p className="text-sm text-gray-600 mb-3">The last expression in your script is returned as the result.</p>
            <CodeBlock language="javascript" code={`// Simple expressions
1 + 1
// Result: 2

dw.system.Site.current.ID
// Result: "RefArchGlobal"`} />
          </Collapsible>

          <Collapsible id="dont-return" title="❌ DON'T: Use return at the top level">
            <p className="text-sm text-gray-600 mb-3">Top-level return statements cause compilation errors.</p>
            <CodeBlock language="javascript" code={`// WRONG - causes compilation error
return 1 + 1

// Error: "invalid return"`} />
          </Collapsible>

          <Collapsible id="dont-require" title="❌ DON'T: Use require() statements">
            <p className="text-sm text-gray-600 mb-3"><code>require()</code> returns null in the debugger context.</p>
            <CodeBlock language="javascript" code={`// WRONG - require() returns null in debugger context
var CustomerMgr = require('dw/customer/CustomerMgr');
CustomerMgr.getSiteCustomerList()

// Error: Cannot call method "getSiteCustomerList" of null`} />
          </Collapsible>

          <Collapsible id="do-dw-namespace" title="✅ DO: Use global dw.* namespace directly">
            <p className="text-sm text-gray-600 mb-3">Access SFCC APIs directly via the global <code>dw</code> namespace.</p>
            <CodeBlock language="javascript" code={`// CORRECT - access SFCC APIs via global dw namespace
dw.customer.CustomerMgr.getSiteCustomerList().ID
// Result: "RefArch"`} />
          </Collapsible>

          <Collapsible id="do-iife" title="✅ DO: Use IIFEs for complex logic">
            <p className="text-sm text-gray-600 mb-3">Wrap multi-step logic in Immediately Invoked Function Expressions.</p>
            <CodeBlock language="javascript" code={`// CORRECT - IIFE pattern for multi-step logic
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  return JSON.stringify({id: p.ID, name: p.name, online: p.online});
})()
// Result: {"id":"25518704M","name":"Pull On Pant","online":true}`} />
          </Collapsible>

          <Collapsible id="do-json-stringify" title="✅ DO: Use JSON.stringify() for object output">
            <p className="text-sm text-gray-600 mb-3">Objects return <code>[object Object]</code> by default. Use JSON.stringify for readable output.</p>
            <CodeBlock language="javascript" code={`// Raw objects return [object Object]
({foo: 'bar'})
// Result: [object Object]

// Use JSON.stringify for readable output
JSON.stringify({foo: 'bar'})
// Result: {"foo":"bar"}`} />
          </Collapsible>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-12">
        <H2 id="use-cases" className="text-3xl font-bold mb-6">Common Use Cases</H2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <H3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🌐</span> Site Information
            </H3>
            <CodeBlock language="javascript" code={`// Current site ID
dw.system.Site.current.ID

// All site IDs
(function() {
  var sites = dw.system.Site.getAllSites();
  var result = [];
  for (var i = 0; i < sites.size(); i++) {
    result.push(sites[i].ID);
  }
  return JSON.stringify(result);
})()`} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <H3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📦</span> Product Data
            </H3>
            <CodeBlock language="javascript" code={`// Get product details
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  if (!p) return 'Product not found';
  return JSON.stringify({
    id: p.ID,
    name: p.name,
    online: p.online,
    brand: p.brand
  });
})()`} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <H3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Site Preferences
            </H3>
            <CodeBlock language="javascript" code={`// List all custom preference keys
JSON.stringify(
  Object.keys(dw.system.Site.current.preferences.custom)
)

// Get specific preference value
dw.system.Site.current.preferences.custom.myPreferenceName`} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <H3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🛒</span> Order Search
            </H3>
            <CodeBlock language="javascript" code={`// Search orders (always close the iterator!)
(function() {
  var orders = dw.order.OrderMgr.searchOrders(
    'orderNo != {0}', 'creationDate desc', ''
  );
  var result = [];
  var i = 0;
  while (orders.hasNext() && i < 5) {
    var o = orders.next();
    result.push({orderNo: o.orderNo, status: o.status.value});
    i++;
  }
  orders.close(); // IMPORTANT!
  return JSON.stringify(result);
})()`} />
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <H2 id="troubleshooting" className="text-3xl font-bold mb-6">Troubleshooting</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold border border-slate-200">Error</th>
                <th className="text-left p-3 font-semibold border border-slate-200">Cause</th>
                <th className="text-left p-3 font-semibold border border-slate-200">Solution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-red-600 text-xs">invalid return</td>
                <td className="p-3 border border-slate-200">Using <code>return</code> at top level</td>
                <td className="p-3 border border-slate-200">Remove <code>return</code>, use expression or IIFE</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-3 border border-slate-200 font-mono text-red-600 text-xs">Cannot call method of null</td>
                <td className="p-3 border border-slate-200">Using <code>require()</code></td>
                <td className="p-3 border border-slate-200">Use <code>dw.*</code> global namespace</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-red-600 text-xs">Timeout waiting for breakpoint</td>
                <td className="p-3 border border-slate-200">Wrong siteId or debugger disabled</td>
                <td className="p-3 border border-slate-200">Verify siteId, enable script debugging in BM</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-3 border border-slate-200 font-mono text-red-600 text-xs">NotAuthorizedException</td>
                <td className="p-3 border border-slate-200">Missing permissions</td>
                <td className="p-3 border border-slate-200">Enable Script Debugger permission for BM user</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-mono text-red-600 text-xs">No compatible storefront cartridge</td>
                <td className="p-3 border border-slate-200">Missing SFRA or SiteGenesis</td>
                <td className="p-3 border border-slate-200">Deploy app_storefront_base or specify custom breakpoint</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <H2 id="best-practices" className="text-3xl font-bold mb-6">Best Practices</H2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🚫', text: 'Never use return at top level — use expression evaluation instead' },
            { icon: '🚫', text: 'Never use require() — use global dw.* namespace' },
            { icon: '📦', text: 'Wrap complex logic in IIFEs for variable declarations' },
            { icon: '📝', text: 'Use JSON.stringify() for object/array output' },
            { icon: '🔒', text: 'Close iterators after use (OrderMgr.searchOrders, etc.)' },
            { icon: '✅', text: 'Check for null before accessing properties' },
            { icon: '📚', text: 'Verify API usage with get_sfcc_class_info tool first' },
            { icon: '🔍', text: 'Use try-catch in IIFEs for error handling' },
          ].map((practice, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <span className="text-xl">{practice.icon}</span>
              <span className="text-sm text-gray-700">{practice.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12">
        <H2 id="related-tools" className="text-3xl font-bold mb-6">Related Tools</H2>
        <div className="grid md:grid-cols-3 gap-4">
          <NavLink to="/tools/" className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
            <h4 className="font-semibold text-slate-800 mb-1">get_sfcc_class_info</h4>
            <p className="text-sm text-gray-600">Look up API documentation before writing scripts</p>
          </NavLink>
          <NavLink to="/tools/" className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
            <h4 className="font-semibold text-slate-800 mb-1">search_site_preferences</h4>
            <p className="text-sm text-gray-600">Discover available site preferences</p>
          </NavLink>
          <NavLink to="/tools/" className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
            <h4 className="font-semibold text-slate-800 mb-1">get_latest_error</h4>
            <p className="text-sm text-gray-600">Check logs if your script causes errors</p>
          </NavLink>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to try it?</h3>
        <p className="text-gray-600 mb-6">Configure your credentials and start executing scripts on your sandbox.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <NavLink to="/configuration/" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Configure Credentials
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </NavLink>
          <NavLink to="/examples/" className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium border border-purple-200 hover:bg-purple-50 transition-colors">
            View Examples
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default ScriptDebuggerPage;
