import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();

function runCommand(command: string, args: string[], cwd: string, extraEnv: NodeJS.ProcessEnv = {}) {
  return spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...extraEnv,
    },
  });
}

describe('release tooling scripts', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'sfcc-release-tooling-'));
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('sync-server-json-version updates server metadata from package.json', () => {
    mkdirSync(join(testDir, 'scripts'), { recursive: true });
    copyFileSync(
      join(repoRoot, 'scripts', 'sync-server-json-version.js'),
      join(testDir, 'scripts', 'sync-server-json-version.js'),
    );

    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({ name: 'sfcc-dev-mcp', version: '9.9.9', type: 'module' }, null, 2),
    );
    writeFileSync(
      join(testDir, 'server.json'),
      JSON.stringify({
        version: '1.0.0',
        packages: [
          {
            identifier: 'old-package-name',
            version: '1.0.0',
            registryType: 'npm',
          },
        ],
      }, null, 2),
    );

    const result = runCommand('node', ['scripts/sync-server-json-version.js'], testDir);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Synchronized server.json to package version 9.9.9');

    const updatedServerJson = JSON.parse(readFileSync(join(testDir, 'server.json'), 'utf8'));

    expect(updatedServerJson).toEqual({
      version: '9.9.9',
      packages: [
        {
          identifier: 'sfcc-dev-mcp',
          version: '9.9.9',
          registryType: 'npm',
        },
      ],
    });
  });

  it('release-status falls back to local changeset parsing when changeset status misses the working tree', () => {
    mkdirSync(join(testDir, 'scripts'), { recursive: true });
    mkdirSync(join(testDir, '.changeset'), { recursive: true });
    mkdirSync(join(testDir, 'bin'), { recursive: true });

    copyFileSync(
      join(repoRoot, 'scripts', 'release-status.js'),
      join(testDir, 'scripts', 'release-status.js'),
    );

    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({ name: 'sfcc-dev-mcp-release-status-test', version: '1.0.0', type: 'module' }, null, 2),
    );

    writeFileSync(join(testDir, '.changeset', 'README.md'), '# test\n');
    writeFileSync(
      join(testDir, '.changeset', 'test-change.md'),
      ['---', '"sfcc-dev-mcp": patch', '---', '', 'Release note body.'].join('\n'),
    );

    const changesetStubPath = join(testDir, 'bin', 'changeset');
    writeFileSync(
      changesetStubPath,
      [
        '#!/bin/sh',
        "printf '%s\\n' '🦋 error Some packages have been changed but no changesets were found. Run `changeset add` to resolve this error.' >&2",
        'exit 1',
      ].join('\n'),
    );
    chmodSync(changesetStubPath, 0o755);

    expect(runCommand('git', ['init'], testDir).status).toBe(0);
    expect(runCommand('git', ['checkout', '-b', 'main'], testDir).status).toBe(0);
    expect(runCommand('git', ['config', 'user.name', 'Test User'], testDir).status).toBe(0);
    expect(runCommand('git', ['config', 'user.email', 'test@example.com'], testDir).status).toBe(0);
    expect(runCommand('git', ['add', '.'], testDir).status).toBe(0);
    expect(runCommand('git', ['commit', '-m', 'Initial commit'], testDir).status).toBe(0);

    const result = runCommand('node', ['scripts/release-status.js'], testDir, {
      PATH: `${join(testDir, 'bin')}:${process.env.PATH ?? ''}`,
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toContain('no changesets were found');
    expect(result.stdout).toContain('Detected 1 local changeset(s) awaiting release on main:');
    expect(result.stdout).toContain('- sfcc-dev-mcp: patch');
    expect(result.stdout).toContain('Changeset IDs: test-change');
  });
});
