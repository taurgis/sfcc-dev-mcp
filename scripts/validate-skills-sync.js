#!/usr/bin/env node

/**
 * Validate that docs-site-v2 skills catalog stays in sync with bundled skill directories.
 */

import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SKILLS_DIRECTORY = 'ai-instructions/skills';
const DOCS_SKILLS_FILE = 'docs-site-v2/data/skills.ts';
const SKILLS_PATTERN = /dirName:\s*'([^']+)'/g;

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function listSkillDirectories() {
  const absoluteSkillsPath = path.join(repoRoot, SKILLS_DIRECTORY);

  return readdirSync(absoluteSkillsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function extractDocsSkillDirectories() {
  const content = readText(DOCS_SKILLS_FILE);
  return [...content.matchAll(SKILLS_PATTERN)].map((match) => match[1]);
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

function main() {
  const sourceSkills = listSkillDirectories();
  const docsSkills = extractDocsSkillDirectories();

  const uniqueSourceSkills = unique(sourceSkills);
  const uniqueDocsSkills = unique(docsSkills);

  const sourceOnly = difference(uniqueSourceSkills, uniqueDocsSkills);
  const docsOnly = difference(uniqueDocsSkills, uniqueSourceSkills);
  const sourceDuplicates = duplicates(sourceSkills);
  const docsDuplicates = duplicates(docsSkills);

  const hasMismatch =
    sourceOnly.length > 0 ||
    docsOnly.length > 0 ||
    sourceDuplicates.length > 0 ||
    docsDuplicates.length > 0;

  if (hasMismatch) {
    console.error('Skills catalog sync validation failed.');

    if (sourceOnly.length > 0) {
      console.error(`Missing in ${DOCS_SKILLS_FILE}: ${sourceOnly.join(', ')}`);
    }

    if (docsOnly.length > 0) {
      console.error(`Only in ${DOCS_SKILLS_FILE}: ${docsOnly.join(', ')}`);
    }

    if (sourceDuplicates.length > 0) {
      console.error(`Duplicate skill directories in ${SKILLS_DIRECTORY}: ${sourceDuplicates.join(', ')}`);
    }

    if (docsDuplicates.length > 0) {
      console.error(`Duplicate docs skill entries in ${DOCS_SKILLS_FILE}: ${docsDuplicates.join(', ')}`);
    }

    process.exit(1);
    return;
  }

  console.log(`Skills catalog is in sync (${uniqueSourceSkills.length} skills).`);
}

main();
