import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_LINKS } from '../constants';
import { NavGroup, NavItem } from '../types';
import Search from './Search';

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
        <h1 className="text-2xl font-bold text-slate-800">SFCC Dev</h1>
        <span className="text-2xl font-light text-orange-500">MCP</span>
        <span className="text-sm text-slate-500 self-start mt-1">v1</span>
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
    </div>
  );
};

export default Sidebar;