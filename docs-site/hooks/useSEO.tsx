import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonical?: string;
  robots?: string;
}

const DEFAULT_SEO = {
  title: 'SFCC Development MCP Server - AI-Powered Commerce Cloud Development Tools',
  description: 'Model Context Protocol server for Salesforce B2C Commerce Cloud development. Access documentation, analyze logs, explore system objects, and get best practices with AI assistance.',
  keywords: 'SFCC, Salesforce Commerce Cloud, Model Context Protocol, MCP server, AI development tools, SFCC documentation, Commerce Cloud development, SFCC debugging, AI-assisted development',
  ogTitle: 'SFCC Development MCP Server - AI-Powered Commerce Cloud Development',
  ogDescription: 'Comprehensive MCP server for SFCC development with AI-powered documentation access, log analysis, and development best practices.',
  ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/',
  twitterTitle: 'SFCC Development MCP Server - AI-Powered Commerce Cloud Development',
  twitterDescription: 'Streamline SFCC development with AI-powered documentation, log analysis, and best practices through Model Context Protocol.',
  canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/',
  robots: 'index, follow'
};

export const useSEO = (props: SEOProps = {}) => {
  const seoConfig = { ...DEFAULT_SEO, ...props };
  
  useEffect(() => {
    // Only run on client side
    if (typeof document === 'undefined') return;
    
    // Update document title
    document.title = seoConfig.title;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) element.setAttribute('property', property);
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', seoConfig.description);
    updateMetaTag('meta[name="keywords"]', seoConfig.keywords);
    updateMetaTag('meta[name="robots"]', seoConfig.robots);
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', seoConfig.ogTitle);
    updateMetaTag('meta[property="og:description"]', seoConfig.ogDescription);
    updateMetaTag('meta[property="og:url"]', seoConfig.ogUrl);
    
    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', seoConfig.twitterTitle);
    updateMetaTag('meta[name="twitter:description"]', seoConfig.twitterDescription);
    
    // Update canonical URL
    updateLinkTag('canonical', seoConfig.canonical);
  }, [seoConfig.title, seoConfig.description, seoConfig.keywords, seoConfig.robots, seoConfig.ogTitle, seoConfig.ogDescription, seoConfig.ogUrl, seoConfig.twitterTitle, seoConfig.twitterDescription, seoConfig.canonical]);
};

// Component version for ease of use
export const SEOHead: React.FC<SEOProps> = (props) => {
  useSEO(props);
  return null; // This component doesn't render anything visible
};

export default useSEO;
