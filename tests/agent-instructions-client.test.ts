import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { AgentInstructionsClient } from '../src/clients/agent-instructions-client.js';
import { WorkspaceRootsService } from '../src/config/workspace-roots.js';

const fixturesRoot = path.join(os.tmpdir(), 'agent-instructions-fixtures');
const fixturesSkillsDir = path.join(fixturesRoot, 'skills');
const fixturesAgentsFile = path.join(fixturesRoot, 'AGENTS.md');

jest.mock('../src/utils/path-resolver.js', () => ({
  PathResolver: {
    getAgentsInstructionsFile: () => fixturesAgentsFile,
    getSkillsSourcePath: () => fixturesSkillsDir,
  },
}));

const createWorkspaceRootsService = (rootPath: string): WorkspaceRootsService => {
  return {
    getRoots: () => [
      {
        uri: `file://${rootPath}`,
        path: rootPath,
        name: 'test-root',
      },
    ],
  } as unknown as WorkspaceRootsService;
};

describe('AgentInstructionsClient', () => {
  let tempRoot: string;

  beforeAll(() => {
    mkdirSync(fixturesRoot, { recursive: true });
    mkdirSync(fixturesSkillsDir, { recursive: true });
    mkdirSync(path.join(fixturesSkillsDir, 'demo-skill'), { recursive: true });
    writeFileSync(fixturesAgentsFile, '# Test AGENTS\n', 'utf-8');
  });

  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), 'agent-instructions-client-'));
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  afterAll(() => {
    rmSync(fixturesRoot, { recursive: true, force: true });
  });

  it('detects .agents/skills in workspace root status checks', async () => {
    const workspaceSkillsDir = path.join(tempRoot, '.agents', 'skills');
    mkdirSync(workspaceSkillsDir, { recursive: true });

    const client = new AgentInstructionsClient(createWorkspaceRootsService(tempRoot));
    const status = await client.getStatus();

    expect(status.detectedSkillsDir).toBe(workspaceSkillsDir);
  });

  it('detects .agent/skills in workspace root status checks', async () => {
    const workspaceSkillsDir = path.join(tempRoot, '.agent', 'skills');
    mkdirSync(workspaceSkillsDir, { recursive: true });

    const client = new AgentInstructionsClient(createWorkspaceRootsService(tempRoot));
    const status = await client.getStatus();

    expect(status.detectedSkillsDir).toBe(workspaceSkillsDir);
  });

  it('prefers .copilot/skills when syncing to destinationType user', async () => {
    const tempHome = mkdtempSync(path.join(os.tmpdir(), 'agent-instructions-home-'));
    const copilotSkillsDir = path.join(tempHome, '.copilot', 'skills');
    mkdirSync(copilotSkillsDir, { recursive: true });

    jest.spyOn(os, 'homedir').mockReturnValue(tempHome);

    try {
      const client = new AgentInstructionsClient(createWorkspaceRootsService(tempRoot));
      const result = await client.syncInstructions({
        destinationType: 'user',
        includeAgents: false,
        includeSkills: true,
        dryRun: true,
      });

      expect(result.plan.skillsTarget).toBe(copilotSkillsDir);
    } finally {
      rmSync(tempHome, { recursive: true, force: true });
    }
  });

  it('checks user home skill folders during workspace status checks', async () => {
    const tempHome = mkdtempSync(path.join(os.tmpdir(), 'agent-instructions-home-'));
    const claudeSkillsDir = path.join(tempHome, '.claude', 'skills');
    mkdirSync(claudeSkillsDir, { recursive: true });

    jest.spyOn(os, 'homedir').mockReturnValue(tempHome);

    try {
      const client = new AgentInstructionsClient(createWorkspaceRootsService(tempRoot));
      const status = await client.getStatus();

      expect(status.detectedSkillsDir).toBe(claudeSkillsDir);
    } finally {
      rmSync(tempHome, { recursive: true, force: true });
    }
  });
});
