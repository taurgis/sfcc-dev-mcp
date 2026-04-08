#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const RELEASE_TYPE_PRIORITY = {
  patch: 0,
  minor: 1,
  major: 2,
};

export function resolveBaseRef() {
  const refs = ['refs/remotes/origin/main', 'refs/heads/main'];

  for (const ref of refs) {
    const result = spawnSync('git', ['show-ref', '--verify', '--quiet', ref], { stdio: 'ignore' });

    if (result.status === 0) {
      return ref.endsWith('/origin/main') ? 'origin/main' : 'main';
    }
  }

  throw new Error('release:status requires a fetched main or origin/main ref');
}

export function parseChangesetFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return [];
  }

  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.match(/^["']?(.+?)["']?:\s*(patch|minor|major)$/))
    .filter(Boolean)
    .map((lineMatch) => ({
      name: lineMatch[1],
      type: lineMatch[2],
    }));
}

export function readLocalChangesets(changesetDirectory = '.changeset') {
  return readdirSync(changesetDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
    .map((entry) => {
      const content = readFileSync(`${changesetDirectory}/${entry.name}`, 'utf8');

      return {
        id: entry.name.replace(/\.md$/, ''),
        releases: parseChangesetFrontmatter(content),
      };
    })
    .filter((changeset) => changeset.releases.length > 0);
}

export function buildLocalChangesetSummary(changesets, baseRef) {
  const releasesByPackage = new Map();

  for (const changeset of changesets) {
    for (const release of changeset.releases) {
      const existing = releasesByPackage.get(release.name);

      if (!existing || RELEASE_TYPE_PRIORITY[release.type] > RELEASE_TYPE_PRIORITY[existing]) {
        releasesByPackage.set(release.name, release.type);
      }
    }
  }

  const lines = [`Detected ${changesets.length} local changeset(s) awaiting release on ${baseRef}:`];

  for (const [name, type] of [...releasesByPackage.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`- ${name}: ${type}`);
  }

  lines.push('');
  lines.push(`Changeset IDs: ${changesets.map((changeset) => changeset.id).sort().join(', ')}`);
  lines.push('');
  lines.push('Fell back to local changeset parsing because the upstream Changesets status command did not account for the current working tree in this single-package repository.');

  return `${lines.join('\n')}\n`;
}

export function runStatus(baseRef) {
  return spawnSync('changeset', ['status', '--since', baseRef, '--verbose'], {
    encoding: 'utf8',
  });
}

export function main() {
  const baseRef = resolveBaseRef();
  const result = runStatus(baseRef);

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status === 0) {
    return;
  }

  const combinedOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  const localChangesets = readLocalChangesets();

  if (combinedOutput.includes('no changesets were found') && localChangesets.length > 0) {
    process.stdout.write(buildLocalChangesetSummary(localChangesets, baseRef));
    process.exit(0);
  }

  process.exit(result.status ?? 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}