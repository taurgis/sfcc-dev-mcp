import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { AgentInstructionsClient } from '../src/clients/agent-instructions-client.js';
import { InstructionAdvisor } from '../src/core/instruction-advisor.js';
import { Logger } from '../src/utils/logger.js';

type MockStatus = {
  workspaceRoot?: string;
  hasAgents: boolean;
  hasSkills: boolean;
  detectedSkillsDir?: string;
  missingSkills: string[];
  sourceSkills: string[];
};

function createStatus(overrides: Partial<MockStatus> = {}): MockStatus {
  return {
    workspaceRoot: '/tmp/workspace',
    hasAgents: false,
    hasSkills: false,
    detectedSkillsDir: undefined,
    missingSkills: ['demo-skill'],
    sourceSkills: ['demo-skill'],
    ...overrides,
  };
}

describe('InstructionAdvisor', () => {
  let logDir: string;

  beforeEach(() => {
    logDir = join(tmpdir(), `instruction-advisor-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(logDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(logDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  function createAdvisorWithClient(statuses: MockStatus[]): {
    advisor: InstructionAdvisor;
    getStatusMock: jest.Mock;
  } {
    const getStatusMock = jest.fn();
    for (const status of statuses) {
      getStatusMock.mockResolvedValueOnce(status);
    }

    const mockClient = {
      getStatus: getStatusMock,
    } as unknown as AgentInstructionsClient;

    const logger = new Logger('InstructionAdvisorTest', false, true, logDir);
    const advisor = new InstructionAdvisor(mockClient, logger);

    return { advisor, getStatusMock };
  }

  it('returns notice only once and caches evaluation', async () => {
    const { advisor, getStatusMock } = createAdvisorWithClient([createStatus()]);
    jest.spyOn(advisor, 'isAgentSyncDisabled').mockResolvedValue(false);

    const first = await advisor.getNotice();
    const second = await advisor.getNotice();

    expect(first).toContain('Missing: AGENTS.md + skills');
    expect(second).toBeUndefined();
    expect(getStatusMock).toHaveBeenCalledTimes(1);
  });

  it('keeps evaluating until a workspace root exists', async () => {
    const { advisor, getStatusMock } = createAdvisorWithClient([
      createStatus({ workspaceRoot: undefined }),
      createStatus(),
    ]);
    jest.spyOn(advisor, 'isAgentSyncDisabled').mockResolvedValue(false);

    const first = await advisor.getNotice();
    const second = await advisor.getNotice();

    expect(first).toBeUndefined();
    expect(second).toContain('Missing: AGENTS.md + skills');
    expect(getStatusMock).toHaveBeenCalledTimes(2);
  });

  it('caches disabled state and avoids repeated filesystem/status checks', async () => {
    const { advisor, getStatusMock } = createAdvisorWithClient([createStatus()]);
    jest.spyOn(advisor, 'isAgentSyncDisabled').mockResolvedValue(true);

    const first = await advisor.getNotice();
    const second = await advisor.getNotice();

    expect(first).toBeUndefined();
    expect(second).toBeUndefined();
    expect(getStatusMock).toHaveBeenCalledTimes(1);
  });

  it('reset allows reevaluation and reissuing the notice', async () => {
    const { advisor, getStatusMock } = createAdvisorWithClient([
      createStatus(),
      createStatus(),
    ]);
    jest.spyOn(advisor, 'isAgentSyncDisabled').mockResolvedValue(false);

    const first = await advisor.getNotice();
    const second = await advisor.getNotice();
    advisor.reset();
    const third = await advisor.getNotice();

    expect(first).toContain('Missing: AGENTS.md + skills');
    expect(second).toBeUndefined();
    expect(third).toContain('Missing: AGENTS.md + skills');
    expect(getStatusMock).toHaveBeenCalledTimes(2);
  });
});
