#!/usr/bin/env node

/**
 * Sitemap Generator for SFCC Development MCP Server Documentation
 *
 * This script generates an XML sitemap for the SFCC Development MCP Server documentation site.
 * Run this whenever you add new pages or want to update the sitemap.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://sfcc-dev-mcp.rhino-inquisitor.com';
const currentDate = new Date().toISOString().split('T')[0];

// Define all pages with their priorities and change frequencies
const pages = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
    description: 'SFCC Development MCP Server Homepage',
  },
  {
    path: '/installation',
    priority: '0.9',
    changefreq: 'monthly',
    description: 'Installation & Setup Guide',
  },
  {
    path: '/configuration',
    priority: '0.9',
    changefreq: 'monthly',
    description: 'Configuration Guide',
  },
  {
    path: '/ai-interfaces',
    priority: '0.8',
    changefreq: 'monthly',
    description: 'AI Interface Setup Guide',
  },
  {
    path: '/features',
    priority: '0.8',
    changefreq: 'monthly',
    description: 'Features Overview',
  },
  {
    path: '/tools',
    priority: '0.8',
    changefreq: 'monthly',
    description: 'Available Tools',
  },
  {
    path: '/examples',
    priority: '0.8',
    changefreq: 'monthly',
    description: 'Examples and Use Cases',
  },
  {
    path: '/security',
    priority: '0.7',
    changefreq: 'monthly',
    description: 'Security Guidelines',
  },
  {
    path: '/development',
    priority: '0.6',
    changefreq: 'monthly',
    description: 'Development Guide',
  },
  {
    path: '/troubleshooting',
    priority: '0.7',
    changefreq: 'monthly',
    description: 'Troubleshooting Guide',
  },
];

function generateSitemap() {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const footer = `
</urlset>`;

  const urls = pages.map(page => {
    // For hash routing, all URLs should point to the base URL with hash fragment
    const url = page.path === '/' ? baseUrl : `${baseUrl}/#${page.path}`;
    return `    
    <!-- ${page.description} -->
    <url>
        <loc>${url}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
  }).join('');

  return header + urls + footer;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all common search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block certain paths if needed
# Disallow: /temp/
# Disallow: /private/`;
}

// Generate files
const sitemap = generateSitemap();
const robots = generateRobotsTxt();

// Write files
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

console.log('✅ Sitemap and robots.txt generated successfully!');
console.log(`📄 Generated ${pages.length} URLs in sitemap.xml`);
console.log('🤖 Updated robots.txt with sitemap reference');
console.log(`📅 Last modified: ${currentDate}`);

// Also log the pages for verification
console.log('\n📋 Pages included in sitemap:');
pages.forEach(page => {
  console.log(`   ${page.path} (Priority: ${page.priority}, ${page.changefreq})`);
});
