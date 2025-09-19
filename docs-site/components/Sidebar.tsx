import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_LINKS } from '../constants';
import { NavGroup, NavItem } from '../types';
import Search from './Search';
import VersionBadge from './VersionBadge';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isLinkActive = (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.startsWith(path);
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6">
      {/* Desktop header - hidden on mobile since we have it in Layout */}
      <div className="hidden lg:flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">MCP</h1>
    <span className="text-2xl font-light text-orange-500">Conductor</span>
    <VersionBadge />
      </div>

      {/* Mobile header spacing */}
      <div className="lg:hidden mb-6" />

      <Search />

      <nav className="flex-1 overflow-y-auto mt-4 sm:mt-6">
        {NAVIGATION_LINKS.map((group: NavGroup) => (
          <div key={group.title} className="mb-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{group.title}</h2>
            <ul>
              {group.items.map((item: NavItem) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`block py-2 px-3 text-sm rounded-md transition-colors ${
                      isLinkActive(item.path)
                        ? 'text-orange-600 font-semibold bg-orange-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
        {/* Links Section */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-center gap-4">
          <a
            href="https://www.rhino-inquisitor.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Rhino Inquisitor - Personal Site"
          >
            <img 
              src="https://www.rhino-inquisitor.com/wp-content/uploads/2022/02/rhino-inquisitor.svg" 
              alt="Rhino Inquisitor" 
              className="w-5 h-6"
            />
            <span>Blog</span>
          </a>
          <a
            href="https://github.com/taurgis/mcp-conductor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="MCP Conductor on GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;