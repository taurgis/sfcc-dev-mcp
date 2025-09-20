import React from 'react';
import { Head } from 'vite-react-ssg';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'SFCC Development MCP Server',
  description = 'Model Context Protocol server for Salesforce B2C Commerce Cloud development. Access comprehensive documentation, analyze logs, explore system objects, and get best practices with AI assistance.',
  keywords = 'SFCC, Salesforce Commerce Cloud, Model Context Protocol, MCP server, AI development tools, SFCC documentation, Commerce Cloud development',
  canonical,
  ogImage = 'https://sfcc-mcp-dev.rhino-inquisitor.com/explain-product-pricing-methods.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noindex = false
}) => {
  const baseUrl = 'https://sfcc-mcp-dev.rhino-inquisitor.com';
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullTitle = title === 'SFCC Development MCP Server' ? title : `${title} | SFCC Development MCP Server`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Basic Meta Tags */}
      <meta name="author" content="Thomas Theunen" />
      <meta name="publisher" content="Thomas Theunen" />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="SFCC Development MCP Server" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@taurgis" />
      <meta name="twitter:site" content="@taurgis" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="SFCC Development MCP Server" />
      <meta name="msapplication-tooltip" content={description} />
      <meta name="apple-mobile-web-app-title" content="SFCC MCP Server" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />


    </Head>
  );
};

export default SEO;