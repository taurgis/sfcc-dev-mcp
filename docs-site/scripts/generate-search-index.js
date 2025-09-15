#!/usr/bin/env node

/**
 * Search Index Generator for SFCC Development MCP Server Documentation
 *
 * This script automatically generates a search index by parsing React components
 * and extracting searchable content. It replaces the manually maintained search
 * index with an automatically generated one during the build process.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PAGES_DIR = path.join(__dirname, '../pages');
const OUTPUT_FILE = path.join(__dirname, '../src/generated-search-index.ts');

/**
 * Route mappings for pages to their URL paths
 */
const ROUTE_MAPPINGS = {
  'HomePage.tsx': '/',
  'InstallationPage.tsx': '/installation',
  'ConfigurationPage.tsx': '/configuration',
  'AIInterfacesPage.tsx': '/ai-interfaces',
  'FeaturesPage.tsx': '/features',
  'ToolsPage.tsx': '/tools',
  'ExamplesPage.tsx': '/examples',
  'SecurityPage.tsx': '/security',
  'DevelopmentPage.tsx': '/development',
  'TroubleshootingPage.tsx': '/troubleshooting',
};

/**
 * Extract content from JSX strings and React elements
 */
function extractTextFromJSX(content) {
  const textContent = [];

  // Remove JSX tags but keep the text content
  const cleanContent = content
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove className and other JSX attributes
    .replace(/className=["'`][^"'`]*["'`]/g, '')
    .replace(/\w+={[^}]*}/g, '');

  // Extract text between JSX tags
  const textRegex = />([^<]+)</g;
  let match;
  while ((match = textRegex.exec(cleanContent)) !== null) {
    const text = match[1].trim();
    // Filter out empty strings, JSX expressions, and very short text
    if (text &&
        !text.startsWith('{') &&
        !text.includes('className') &&
        !text.includes('src=') &&
        text.length > 3 &&
        !/^[{\s}]*$/.test(text)) {
      textContent.push(text);
    }
  }

  // Also extract string literals that might contain content
  const stringRegex = /["'`]([^"'`{]+)["'`]/g;
  while ((match = stringRegex.exec(cleanContent)) !== null) {
    const text = match[1].trim();
    if (text &&
        text.length > 10 &&
        !text.includes('className') &&
        !text.includes('src=') &&
        !text.includes('href=') &&
        !text.startsWith('http') &&
        (!text.includes('.') || text.includes(' '))) { // Allow sentences with periods
      textContent.push(text);
    }
  }

  // Clean up the extracted text
  return textContent
    .map(text => text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[{}]/g, '') // Remove remaining braces
      .trim())
    .filter(text => text.length > 5)
    .join(' ');
}

/**
 * Extract headings and sections from a React component
 */
function parseReactComponent(filePath, content) {
  const results = [];

  // Get the page title from the route mapping
  const relativePath = path.relative(PAGES_DIR, filePath);
  const routePath = ROUTE_MAPPINGS[relativePath];

  if (!routePath) {
    console.warn(`Warning: No route mapping found for ${relativePath}`);
    return results;
  }

  // Extract page title from component name or H1 tags
  let pageTitle = 'Unknown Page';
  const titleMatch = content.match(/pageTitle\s*[:=]\s*["'`]([^"'`]+)["'`]/);
  if (titleMatch) {
    pageTitle = titleMatch[1];
  } else {
    // Fallback: extract from H1 tags
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match) {
      pageTitle = h1Match[1].replace(/\{[^}]*\}/g, '').trim();
    }
  }

  // Extract sections based on headings (H1, H2, H3 components and regular h1-h3 tags)
  const jsxComponentPattern = /<H([123])[^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/H[123]>/gi;
  const regularHeadingPattern = /<(h[1-3])[^>]*(?:id=["']([^"']+)["'])?[^>]*>([^<]+)<\/(h[1-3])>/gi;
  const sections = [];
  let match;

  // First, extract JSX component headings (H1, H2, H3)
  while ((match = jsxComponentPattern.exec(content)) !== null) {
    const heading = match[3].trim();
    const headingId = match[2];
    const level = parseInt(match[1]);

    if (heading && heading.length > 1) {
      sections.push({
        heading,
        headingId,
        level,
        position: match.index,
      });
    }
  }

  // Reset regex for next pass
  regularHeadingPattern.lastIndex = 0;

  // Then, extract regular HTML headings
  while ((match = regularHeadingPattern.exec(content)) !== null) {
    const heading = match[3].replace(/\{[^}]*\}/g, '').trim();
    const headingId = match[2];
    const level = parseInt(match[1].charAt(1));

    if (heading && heading.length > 1 && !heading.includes('className')) {
      sections.push({
        heading,
        headingId,
        level,
        position: match.index,
      });
    }
  }

  // Sort sections by their position in the document
  sections.sort((a, b) => a.position - b.position);

  // Filter out duplicate headings at the same position, preferring those with a headingId
  const filteredSections = [];
  for (let i = 0; i < sections.length; i++) {
    const curr = sections[i];
    const next = sections[i + 1];
    if (
      next &&
      curr.position === next.position &&
      curr.heading === next.heading
    ) {
      // Prefer the one with headingId
      if (curr.headingId) {
        filteredSections.push(curr);
      } else if (next.headingId) {
        filteredSections.push(next);
      }
      i++; // Skip the next one
    } else {
      filteredSections.push(curr);
    }
  }

  if (filteredSections.length === 0) {
    // If no headings found, create a single entry for the whole page
    const textContent = extractTextFromJSX(content);
    results.push({
      path: routePath,
      pageTitle,
      heading: pageTitle,
      headingId: null, // No heading ID for fallback case
      content: textContent.substring(0, 500), // Limit content length
    });
    return results;
  }

  // Create search entries for each section
  filteredSections.forEach((section, index) => {
    const nextSection = filteredSections[index + 1];
    const sectionStart = section.position;
    const sectionEnd = nextSection ? nextSection.position : content.length;

    const sectionContent = content.substring(sectionStart, sectionEnd);
    const textContent = extractTextFromJSX(sectionContent);

    if (textContent.trim().length > 10) { // Only include sections with meaningful content
      results.push({
        path: routePath,
        pageTitle,
        heading: section.heading,
        headingId: section.headingId || null, // Ensure the property is always present
        content: textContent.substring(0, 300), // Limit content length per section
      });
    }
  });

  return results;
}

/**
 * Recursively find all React component files
 */
function findReactFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Generate the search index
 */
function generateSearchIndex() {
  console.log('🔍 Generating search index...');

  const reactFiles = findReactFiles(PAGES_DIR);
  const searchIndex = [];

  console.log(`Found ${reactFiles.length} React files to process`);

  for (const filePath of reactFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const entries = parseReactComponent(filePath, content);
      searchIndex.push(...entries);

      console.log(`  ✓ Processed ${path.relative(PAGES_DIR, filePath)} (${entries.length} entries)`);
    } catch (error) {
      console.error(`  ✗ Failed to process ${filePath}:`, error.message);
    }
  }

  console.log(`Generated ${searchIndex.length} search entries`);

  return searchIndex;
}

/**
 * Write the generated index to a TypeScript file
 */
function writeSearchIndex(searchIndex) {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tsContent = `// This file is auto-generated by scripts/generate-search-index.js
// Do not edit manually - changes will be overwritten during build

export interface SearchableItem {
  path: string;
  pageTitle: string;
  heading: string;
  headingId?: string;
  content: string;
}

export const GENERATED_SEARCH_INDEX: SearchableItem[] = ${JSON.stringify(searchIndex, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
  console.log(`✅ Search index written to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

/**
 * Main execution
 */
function main() {
  try {
    const searchIndex = generateSearchIndex();
    writeSearchIndex(searchIndex);
    console.log('🎉 Search index generation complete!');
  } catch (error) {
    console.error('❌ Failed to generate search index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSearchIndex, writeSearchIndex };
