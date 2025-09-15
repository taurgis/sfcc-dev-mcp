
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import OnThisPage from './OnThisPage';
import { TocItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Scroll restoration - scroll to top on route change or to specific element if hash is present
  useEffect(() => {
    const scrollToTarget = () => {
      if (location.hash) {
        // If there's a hash fragment, try to scroll to that element
        const targetId = location.hash.substring(1); // Remove the # symbol
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Use multiple attempts with increasing delays to ensure DOM is ready
          const attemptScroll = (attempt = 0) => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            } else if (attempt < 5) {
              // Retry up to 5 times with increasing delay
              setTimeout(() => attemptScroll(attempt + 1), (attempt + 1) * 100);
            }
          };
          
          // Initial attempt with small delay
          setTimeout(() => attemptScroll(), 100);
        } else {
          // Element not found immediately, try again after content loads
          setTimeout(() => {
            const retryElement = document.getElementById(targetId);
            if (retryElement) {
              retryElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            }
          }, 500);
        }
      } else {
        // No hash, scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    };

    scrollToTarget();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Use a small timeout to ensure the DOM has been updated with new content
    const timeoutId = setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        const headings = mainContent.querySelectorAll('h2');
        const newToc: TocItem[] = Array.from(headings).map(heading => ({
          id: heading.id,
          label: heading.textContent || '',
          level: 2,
        }));
        setToc(newToc);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Changed dependency to location.pathname

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">SFCC Dev</h1>
            <span className="text-xl font-light text-orange-500">MCP</span>
            <span className="text-xs text-slate-500 self-start mt-1">v1</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md flex-shrink-0"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="relative flex min-h-screen overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 hidden lg:block bg-slate-50 border-r border-slate-200">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-slate-50 border-r border-slate-200 transform transition-transform duration-200 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar />
        </div>

        <div className="lg:pl-64 flex-1 min-w-0 max-w-full">
          <div className="flex min-w-0 max-w-full">
            <main id="main-content" className="flex-1 max-w-4xl mx-auto p-2 sm:p-4 lg:p-12 min-w-0 overflow-hidden">
              <div className="prose prose-slate max-w-none min-w-0 break-words">
                {children}
              </div>
            </main>
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="fixed top-0 right-0 h-full w-64 p-8">
                <OnThisPage items={toc} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
