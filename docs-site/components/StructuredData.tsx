import React from 'react';
import { SITE_DATES } from '../constants';

interface StructuredDataProps {
  structuredData?: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ structuredData }) => {
  const combinedData = [
    // Global Software Application Schema
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SFCC Development MCP Server",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Development Tools",
      "operatingSystem": "Node.js",
      "description": "A Model Context Protocol server for Salesforce B2C Commerce Cloud development with AI-powered documentation access, log analysis, and curated agent skills.",
      "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/",
      "downloadUrl": "https://www.npmjs.com/package/sfcc-dev-mcp",
      "installUrl": "https://sfcc-mcp-dev.rhino-inquisitor.com/configuration/",
      "softwareVersion": "1.0.0",
      "datePublished": SITE_DATES.PUBLISHED,
      "dateModified": SITE_DATES.MODIFIED,
      "author": {
        "@type": "Person",
        "name": "Thomas Theunen",
        "url": "https://github.com/taurgis"
      },
      "publisher": {
        "@type": "Person",
        "name": "Thomas Theunen"
      },
      "programmingLanguage": ["JavaScript", "TypeScript"],
      "runtimePlatform": "Node.js",
      "keywords": "SFCC, Salesforce Commerce Cloud, Model Context Protocol, MCP server, AI development tools, SFCC documentation, Commerce Cloud development",
      "requirements": "Node.js 18+, npm",
      "featureList": [
        "SFCC API Documentation Access",
        "Real-time Log Analysis", 
        "System Object Exploration",
        "Cartridge Generation",
        "Agent Skills",
        "AI Assistant Integration"
      ],
      "screenshot": "https://sfcc-mcp-dev.rhino-inquisitor.com/explain-product-pricing-methods.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "license": "https://opensource.org/licenses/MIT",
      "codeRepository": "https://github.com/taurgis/sfcc-dev-mcp",
      "maintainer": {
        "@type": "Person", 
        "name": "Thomas Theunen"
      }
    },
    // Page-specific structured data (if provided)
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedData) }} 
    />
  );
};

export default StructuredData;