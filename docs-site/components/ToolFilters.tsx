import React from 'react';
import { TOOL_CATEGORIES, tools } from '../utils/toolsData';

interface ToolFiltersProps {
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

const ToolFilters: React.FC<ToolFiltersProps> = ({ activeCategory, setActiveCategory, search, setSearch }) => {
  const categories = ['All', ...TOOL_CATEGORIES];
  const counts: Record<string, number> = React.useMemo(() => {
    const base: Record<string, number> = { All: tools.length };
    TOOL_CATEGORIES.forEach(cat => { base[cat] = tools.filter(t => t.category === cat).length; });
    return base;
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-xs px-3 py-1.5 rounded-full border transition font-medium flex items-center gap-2 ${active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}>
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 border border-white/30' : 'bg-gray-100 text-gray-600'}`}>{counts[cat]}</span>
              </button>
            );
        })}
      </div>
      <div className="relative max-w-sm">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tools or prompts..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        {search && <button onClick={()=>setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">Clear</button>}
      </div>
    </div>
  );
};

export default ToolFilters;
