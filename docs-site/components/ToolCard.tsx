import React from 'react';
import { ToolMeta } from '../utils/toolsData';
import { InlineCode } from './CodeBlock';

interface ToolCardProps {
  tool: ToolMeta;
}

const ModeBadge: React.FC<{ mode: ToolMeta['mode'] }> = ({ mode }) => {
  if (mode === 'both') return <span className="text-[10px] font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded-full tracking-wide">Docs + Full</span>;
  if (mode === 'docs') return <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full tracking-wide">Docs</span>;
  return <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full tracking-wide">Full</span>;
};

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div id={tool.id} className="group rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm p-4 shadow-sm hover:shadow transition relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <ModeBadge mode={tool.mode} />
            {tool.popular && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Popular</span>}
            {tool.tags?.slice(0,3).map(tag => (
              <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{tag}</span>
            ))}
          </div>
          <h4 className="font-mono text-sm font-semibold text-gray-900 break-all mb-1">{tool.name}</h4>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{tool.description}</p>
        </div>
        <button aria-label="Toggle details" onClick={() => setOpen(o=>!o)} className="shrink-0 rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition" aria-expanded={open}>
          <svg className={`w-4 h-4 transform transition ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
      {open && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {tool.params && tool.params.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-700 mb-1">Parameters</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/60">
                <div className="divide-y divide-gray-200">
                  {tool.params.map(p => (
                    <div key={p.name} className="p-2 hover:bg-gray-50 transition flex gap-4 items-start">
                      {/* Name column */}
                      <div className="flex-shrink-0 min-w-[100px]">
                        <InlineCode>
                          <span className="text-[10px] font-medium">{p.name}</span>
                        </InlineCode>
                      </div>
                      {/* Optional badge column (fixed width) */}
                      <div className="w-[50px] flex justify-start">
                        {p.required === false ? (
                          <span className="text-[10px] leading-none px-1 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 whitespace-nowrap">optional</span>
                        ) : (
                          <span className="text-[10px] text-transparent select-none">req</span>
                        )}
                      </div>
                      {/* Description column */}
                      <div className="text-[11px] text-gray-600 leading-relaxed flex-1 min-w-0">{p.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tool.examples && tool.examples.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-700 mb-1">Example Prompts</p>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-gray-600">
                {tool.examples.map(ex => (
                  <li key={ex} className="flex items-start gap-2"><span className="flex-1">{ex}</span>
                    <button onClick={() => navigator.clipboard.writeText(ex)} className="ml-2 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded transition">Copy</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolCard;
