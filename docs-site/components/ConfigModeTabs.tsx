import React from 'react';
import CodeBlock, { InlineCode } from './CodeBlock';

export const ConfigModeTabs: React.FC = () => {
  const [active, setActive] = React.useState<'docs' | 'full' | 'env'>('docs');
  const tabBase = 'px-5 py-2 rounded-full text-xs md:text-sm font-medium transition border';
  return (
    <div>
      <div role="tablist" aria-label="Configuration modes" className="flex flex-wrap gap-3 mb-8">
        <button aria-selected={active==='docs'} onClick={()=>setActive('docs')} className={`${tabBase} ${active==='docs' ? 'bg-green-600 text-white border-green-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600'}`}>Docs Only</button>
        <button aria-selected={active==='full'} onClick={()=>setActive('full')} className={`${tabBase} ${active==='full' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}>Full Mode</button>
        <button aria-selected={active==='env'} onClick={()=>setActive('env')} className={`${tabBase} ${active==='env' ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-600'}`}>Env Vars</button>
      </div>
      {active==='docs' && (
        <div role="tabpanel" className="space-y-4 animate-fade-in">
          <p className="text-sm text-gray-600">No credentials required. Add the server to your AI client:</p>
          <CodeBlock language="json" code={`{\n  \"mcpServers\": {\n    \"sfcc-dev\": {\n      \"command\": \"npx\",\n      \"args\": [\"sfcc-dev-mcp\"]\n    }\n  }\n}`} />
          <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
            <li>Enables documentation, best practices & cartridge generation</li>
            <li>Upgrade anytime by adding <InlineCode>--dw-json</InlineCode></li>
          </ul>
        </div>
      )}
      {active==='full' && (
        <div role="tabpanel" className="space-y-4 animate-fade-in">
          <p className="text-sm text-gray-600">Provide a <InlineCode>dw.json</InlineCode> file to unlock logs, system objects & code versions.</p>
          <CodeBlock language="json" code={`{\n  \"mcpServers\": {\n    \"sfcc-dev\": {\n      \"command\": \"npx\",\n      \"args\": [\"sfcc-dev-mcp\", \"--dw-json\", \"/path/to/dw.json\"]\n    }\n  }\n}`} />
          <p className="text-xs text-gray-500">Add <InlineCode>--debug true</InlineCode> temporarily when diagnosing configuration issues.</p>
        </div>
      )}
      {active==='env' && (
        <div role="tabpanel" className="space-y-4 animate-fade-in">
          <p className="text-sm text-gray-600">Use environment variables in CI or container setups. No file needed.</p>
          <CodeBlock language="bash" code={`export SFCC_HOSTNAME=\"your-instance.sandbox.us01.dx.commercecloud.salesforce.com\"\nexport SFCC_USERNAME=\"your-username\"\nexport SFCC_PASSWORD=\"your-password\"\nexport SFCC_CLIENT_ID=\"your-client-id\"\nexport SFCC_CLIENT_SECRET=\"your-client-secret\"\n\nnpx sfcc-dev-mcp`} />
          <p className="text-xs text-gray-500">Command-line <InlineCode>--dw-json</InlineCode> always overrides env vars.</p>
        </div>
      )}
    </div>
  );
};

export default ConfigModeTabs;
