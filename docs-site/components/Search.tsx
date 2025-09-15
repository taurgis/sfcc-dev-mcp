import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchDocs, SearchResult } from '../utils/search';
import { SearchIcon } from './icons';

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-orange-200 text-orange-800 font-semibold rounded px-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};


const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLUListElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const openSearch = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setActiveIndex(-1);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                openSearch();
            }
            if (event.key === 'Escape' && isOpen) {
                closeSearch();
            }
            if (isOpen && results.length > 0) {
                 if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setActiveIndex(prev => (prev + 1) % results.length);
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setActiveIndex(prev => (prev - 1 + results.length) % results.length);
                } else if (event.key === 'Enter' && activeIndex >= 0) {
                    event.preventDefault();
                    const result = results[activeIndex];
                    handleNavigation(result.path, result.heading, result.headingId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results.length, activeIndex, openSearch, closeSearch]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
      closeSearch();
    }, [location.pathname, closeSearch]);

    useEffect(() => {
        if (activeIndex >= 0 && resultsRef.current) {
            const activeElement = resultsRef.current.children[activeIndex] as HTMLLIElement;
            if (activeElement) {
                activeElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (newQuery.length > 1) {
            setResults(searchDocs(newQuery));
        } else {
            setResults([]);
        }
        setActiveIndex(0);
    };
    
    const handleNavigation = (path: string, heading?: string, headingId?: string) => {
        // Use the actual headingId if available, otherwise generate one from the heading
        let targetPath = path;
        let hashFragment = '';
        
        if (headingId) {
            hashFragment = headingId;
        } else if (heading && heading !== 'Introduction' && heading !== path.split('/').pop()) {
            // Convert heading to a URL-safe ID as fallback
            const generatedId = heading
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
            
            if (generatedId) {
                hashFragment = generatedId;
            }
        }
        
        // Navigate to the path first, then handle hash navigation
        if (hashFragment) {
            // If we have a hash fragment, navigate to path first then add hash
            navigate(targetPath, { replace: false });
            // Use setTimeout to ensure navigation completes before adding hash
            setTimeout(() => {
                window.location.hash = `#${targetPath}#${hashFragment}`;
            }, 100);
        } else {
            navigate(targetPath);
        }
        
        closeSearch();
    };

    return (
        <>
            <div className="relative">
                <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <button
                    type="button"
                    onClick={openSearch}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 pl-9 pr-12 sm:pr-3 text-sm text-left text-slate-500 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    Search...
                </button>
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400 border border-slate-300 rounded-md px-1.5 py-0.5 pointer-events-none hidden sm:block">
                    ⌘K
                </div>
            </div>

            {isOpen && (
                 <div className="fixed inset-0 z-50 flex justify-center items-start pt-4 sm:pt-20 p-4" aria-modal="true">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeSearch}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg max-h-[90vh] flex flex-col">
                        <div className="relative flex-shrink-0">
                            <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={handleSearch}
                                placeholder="Search documentation..."
                                className="w-full text-base sm:text-lg py-3 sm:py-4 pl-12 pr-4 border-b border-slate-200 focus:outline-none"
                            />
                        </div>
                        {query.length > 1 && (
                             <div className="flex-1 overflow-y-auto min-h-0">
                                {results.length > 0 ? (
                                    <ul ref={resultsRef} className="p-3 sm:p-4 space-y-2">
                                        {results.map((result, index) => (
                                            <li key={`${result.path}-${result.heading}`}>
                                                <button
                                                    onClick={() => handleNavigation(result.path, result.heading, result.headingId)}
                                                    className={`w-full text-left p-3 rounded-md transition-colors ${activeIndex === index ? 'bg-orange-100' : 'hover:bg-slate-100'}`}
                                                >
                                                    <div className="font-semibold text-slate-800 text-sm sm:text-base">
                                                        <Highlight text={result.pageTitle} query={query} />
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-slate-600 mb-1">
                                                        <Highlight text={result.heading} query={query} />
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                                                        <Highlight text={result.snippet} query={query} />
                                                    </p>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="p-6 sm:p-8 text-center text-slate-500 text-sm sm:text-base">No results found for "{query}"</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Search;