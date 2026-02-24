#!/usr/bin/env node

/**
 * Validate that docs-site-v2 tool catalog stays in sync with runtime tool schemas.
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SOURCE_SCHEMA_FILES = [
  'src/core/tool-schemas/documentation-tools.ts',
  'src/core/tool-schemas/sfra-tools.ts',
  'src/core/tool-schemas/isml-tools.ts',
  'src/core/tool-schemas/log-tools.ts',
  'src/core/tool-schemas/system-object-tools.ts',
  'src/core/tool-schemas/cartridge-tools.ts',
  'src/core/tool-schemas/code-version-tools.ts',
  'src/core/tool-schemas/agent-instruction-tools.ts',
  'src/core/tool-schemas/script-debugger-tools.ts',
];

const DOCS_TOOL_FILE = 'docs-site-v2/data/tools.ts';
const TOOL_NAME_PATTERN = /name:\s*'([^']+)'/g;
const LATEST_LOG_TOOL_PATTERN = /createLatestLogToolSchema\(\s*'([^']+)'/g;

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function unique(values) {
  return [...new Set(values)];
}

function duplicates(values) {
  const seen = new Set();
  const dupes = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      dupes.add(value);
      continue;
    }

    seen.add(value);
  }

  return [...dupes].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item)).sort();
}

function extractNamesFromSchemaFile(relativePath) {
  const content = readText(relativePath);
  const names = [...content.matchAll(TOOL_NAME_PATTERN)].map((match) => match[1]);

  // log-tools.ts uses a factory for get_latest_* schemas; capture those generated names.
  if (relativePath.endsWith('log-tools.ts')) {
    const generatedLatest = [...content.matchAll(LATEST_LOG_TOOL_PATTERN)].map((match) => `get_latest_${match[1]}`);
    names.push(...generatedLatest);
  }

  return names;
}

function main() {
  const sourceNames = SOURCE_SCHEMA_FILES.flatMap((file) => extractNamesFromSchemaFile(file));
  const docsNames = [...readText(DOCS_TOOL_FILE).matchAll(TOOL_NAME_PATTERN)].map((match) => match[1]);

  const uniqueSourceNames = unique(sourceNames);
  const uniqueDocsNames = unique(docsNames);

  const sourceOnly = difference(uniqueSourceNames, uniqueDocsNames);
  const docsOnly = difference(uniqueDocsNames, uniqueSourceNames);
  const sourceDuplicates = duplicates(sourceNames);
  const docsDuplicates = duplicates(docsNames);

  const hasMismatch =
    sourceOnly.length > 0 ||
    docsOnly.length > 0 ||
    sourceDuplicates.length > 0 ||
    docsDuplicates.length > 0;

  if (hasMismatch) {
    console.error('Tool catalog sync validation failed.');

    if (sourceOnly.length > 0) {
      console.error(`Missing in ${DOCS_TOOL_FILE}: ${sourceOnly.join(', ')}`);
    }

    if (docsOnly.length > 0) {
      console.error(`Only in ${DOCS_TOOL_FILE}: ${docsOnly.join(', ')}`);
    }

    if (sourceDuplicates.length > 0) {
      console.error(`Duplicate runtime tool names: ${sourceDuplicates.join(', ')}`);
    }

    if (docsDuplicates.length > 0) {
      console.error(`Duplicate docs tool names: ${docsDuplicates.join(', ')}`);
    }

    process.exit(1);
    return;
  }

  console.log(`Tool catalog is in sync (${uniqueSourceNames.length} tools).`);
}

main();
