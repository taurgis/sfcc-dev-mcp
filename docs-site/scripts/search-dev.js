#!/usr/bin/env node

/**
 * Development utility script for the search index
 * Provides commands for generation, validation, and testing
 */

import { generateSearchIndex, writeSearchIndex } from './generate-search-index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = process.argv[2];

switch (command) {
  case 'generate':
    console.log('🔄 Generating search index...');
    try {
      const index = generateSearchIndex();
      writeSearchIndex(index);
    } catch (error) {
      console.error('❌ Failed to generate search index:', error.message);
      process.exit(1);
    }
    break;

  case 'validate':
    console.log('✅ Validating search index...');
    try {
      const indexPath = path.join(__dirname, '../src/generated-search-index.ts');
      if (!fs.existsSync(indexPath)) {
        console.error('❌ Search index file not found. Run "generate" first.');
        process.exit(1);
      }

      const stats = fs.statSync(indexPath);
      const content = fs.readFileSync(indexPath, 'utf-8');
      const lines = content.split('\n').length;
      const size = (stats.size / 1024).toFixed(1);

      // Extract the number of entries
      const match = content.match(/GENERATED_SEARCH_INDEX: SearchableItem\[\] = \[([\s\S]*)\];/);
      if (match) {
        const entriesCount = (match[1].match(/\{/g) || []).length;
        console.log('📊 Search index statistics:');
        console.log(`   • File size: ${size} KB`);
        console.log(`   • Lines: ${lines}`);
        console.log(`   • Search entries: ${entriesCount}`);
        console.log(`   • Last modified: ${stats.mtime.toLocaleString()}`);
        console.log('✅ Search index is valid');
      } else {
        throw new Error('Invalid search index format');
      }
    } catch (error) {
      console.error('❌ Search index validation failed:', error.message);
      process.exit(1);
    }
    break;

  case 'search': {
    const query = process.argv[3];
    if (!query) {
      console.error('❌ Please provide a search query: npm run search-dev search "your query"');
      process.exit(1);
    }

    console.log(`🔍 Testing search for: "${query}"`);
    try {
      // Dynamically import and test the search function
      const { searchDocs } = await import('../utils/search.ts');
      const results = searchDocs(query);

      if (results.length === 0) {
        console.log('📭 No results found');
      } else {
        console.log(`📋 Found ${results.length} results:`);
        results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.heading} (${result.pageTitle})`);
          console.log(`   Path: ${result.path}`);
          console.log(`   Score: ${result.score}`);
          console.log(`   Snippet: ${result.snippet.substring(0, 100)}...`);
        });
      }
    } catch (error) {
      console.error('❌ Search test failed:', error.message);
      process.exit(1);
    }
    break;
  }

  default:
    console.log(`
🔧 Search Index Development Utility

Usage:
  node scripts/search-dev.js <command>

Commands:
  generate    Generate the search index from React components
  validate    Check if the search index is valid and show statistics
  search      Test search functionality with a query

Examples:
  node scripts/search-dev.js generate
  node scripts/search-dev.js validate
  node scripts/search-dev.js search "pattern matching"
`);
    break;
}
