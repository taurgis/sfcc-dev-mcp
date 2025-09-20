
import { GENERATED_SEARCH_INDEX, SearchableItem } from '../src/generated-search-index';

export interface SearchResult {
  path: string;
  pageTitle: string;
  heading: string;
  headingId?: string;
  snippet: string;
  // FIX: Add optional score property to be used for ranking search results.
  score?: number;
}

// Fallback search index (manually maintained for development/emergency use)
const FALLBACK_SEARCH_INDEX: SearchableItem[] = [
  // HomePage
  { path: '/', pageTitle: 'Introduction', heading: 'SFCC Development MCP Server', content: 'AI-powered Model Context Protocol server for Salesforce B2C Commerce Cloud development with comprehensive documentation, log analysis, best practices, and cartridge generation tools.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Quick Start', content: 'Get up and running with SFCC Development MCP Server in minutes. Install and configure to start using AI-assisted SFCC development tools.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Key Features', content: 'SFCC Documentation Access, Log Analysis, Best Practices Guides, Cartridge Generation, System Object Management, Code Version Control.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Why Choose SFCC Development MCP Server?', content: 'The comprehensive solution for AI-assisted SFCC development. Complete SFCC API Coverage, Real-time Log Analysis, Production Ready, Developer Friendly.' },

  // AIInterfacesPage
  { path: '/ai-interfaces/', pageTitle: 'AI Assistant Setup', heading: 'AI Assistant Setup Guide', content: 'Set up the SFCC Development MCP Server with your AI assistant. Connect Claude Desktop, Cursor AI, or other MCP-compatible tools.' },
  { path: '/ai-interfaces/', pageTitle: 'AI Assistant Setup', heading: 'Claude Desktop', content: 'Configure Claude Desktop to use the SFCC Development MCP Server for enhanced SFCC development assistance.' },
  { path: '/ai-interfaces/', pageTitle: 'AI Assistant Setup', heading: 'Cursor AI', content: 'Set up Cursor AI editor with the MCP server for intelligent code completion and SFCC guidance.' },

  // ConfigurationPage
  { path: '/configuration/', pageTitle: 'Configuration', heading: 'Configuration Guide', content: 'Configure SFCC Development MCP Server for your Commerce Cloud environment.' },
  { path: '/configuration/', pageTitle: 'Configuration', heading: 'Operating Modes', content: 'Documentation-only mode or full mode with SFCC credentials for complete functionality.' },

  // AI InterfacesPage
  { path: '/ai-interfaces/', pageTitle: 'AI Interfaces', heading: 'AI Interface Setup', content: 'Configure your AI assistant to work with SFCC Development MCP Server.' },

  // FeaturesPage
  { path: '/features/', pageTitle: 'Features', heading: 'Features Overview', content: 'Comprehensive SFCC development tools powered by AI assistance.' },

  // ToolsPage
  { path: '/tools/', pageTitle: 'Tools', heading: 'Available Tools', content: 'Complete list of available tools for SFCC development assistance.' },

  // ExamplesPage
  { path: '/examples/', pageTitle: 'Examples', heading: 'Examples & Use Cases', content: 'Real-world examples of using SFCC Development MCP Server for various development tasks.' },

  // SecurityPage
  { path: '/security/', pageTitle: 'Security', heading: 'Security Guidelines', content: 'Security best practices for using SFCC Development MCP Server.' },

  // DevelopmentPage
  { path: '/development/', pageTitle: 'Development', heading: 'Development Guide', content: 'Contributing to SFCC Development MCP Server development.' },

  // TroubleshootingPage
  { path: '/troubleshooting/', pageTitle: 'Troubleshooting', heading: 'Troubleshooting & Debugging', content: 'Common issues and solutions for SFCC Development MCP Server.' },
];

// Use generated index if available, otherwise fall back to manual index
const getSearchIndex = (): SearchableItem[] => {
  try {
    // Check if the generated index has meaningful content
    if (GENERATED_SEARCH_INDEX.length > 1 || 
        (GENERATED_SEARCH_INDEX.length === 1 && 
         GENERATED_SEARCH_INDEX[0].content !== 'AI-powered Model Context Protocol server for Salesforce B2C Commerce Cloud development.')) {
      return GENERATED_SEARCH_INDEX;
    }
  } catch (error) {
    console.warn('Failed to load generated search index, using fallback:', error);
  }
  
  return FALLBACK_SEARCH_INDEX;
};

// Manually populated search index from all documentation pages
const createSnippet = (text: string, query: string): string => {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) {
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);

    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
};

export function searchDocs(query: string): SearchResult[] {
  if (!query) return [];
  
  const queryLower = query.toLowerCase();
  const searchIndex = getSearchIndex();
  const results: SearchResult[] = [];

  searchIndex.forEach(item => {
    const contentLower = item.content.toLowerCase();
    const headingLower = item.heading.toLowerCase();
    const titleLower = item.pageTitle.toLowerCase();

    let score = 0;
    if (titleLower.includes(queryLower)) score += 5;
    if (headingLower.includes(queryLower)) score += 3;
    if (contentLower.includes(queryLower)) score += 1;

    if (score > 0) {
      results.push({
        path: item.path,
        pageTitle: item.pageTitle,
        heading: item.heading,
        headingId: item.headingId,
        snippet: createSnippet(item.content, query),
        score: score,
      });
    }
  });

  // Remove duplicates by path and heading, keeping the one with the highest score
  const uniqueResults = Array.from(
      results.reduce((map, item) => {
          const key = `${item.path}-${item.heading}`;
          if (!map.has(key) || (map.get(key)?.score ?? 0) < (item.score ?? 0)) {
              map.set(key, item);
          }
          return map;
      }, new Map<string, SearchResult>()).values()
  );

  return uniqueResults
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 20);
}
