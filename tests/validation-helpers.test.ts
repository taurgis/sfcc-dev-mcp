import { join, resolve } from 'path';
import { homedir } from 'os';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync } from 'fs';
import {
  validateFilename,
  formatLogMessage,
  validateTargetPathWithinWorkspace,
} from '../src/core/handlers/validation-helpers.js';
import { HandlerError, ToolExecutionContext } from '../src/core/handlers/base-handler.js';

describe('validation-helpers', () => {
  describe('validateFilename', () => {
    it('accepts a standard log filename', () => {
      expect(() => validateFilename('error-blade-20240101-000000.log', 'get_log_file_contents')).not.toThrow();
    });

    it('rejects path traversal patterns', () => {
      expect(() => validateFilename('../etc/passwd', 'get_log_file_contents')).toThrow(HandlerError);
      expect(() => validateFilename('../etc/passwd', 'get_log_file_contents')).toThrow('Path traversal not allowed');
    });

    it('rejects absolute paths outside allowed prefixes', () => {
      expect(() => validateFilename('/tmp/error.log', 'get_log_file_contents')).toThrow(HandlerError);
      expect(() => validateFilename('/tmp/error.log', 'get_log_file_contents')).toThrow('Absolute paths outside /Logs/ are not allowed');
    });
  });

  describe('formatLogMessage', () => {
    it('formats only provided parameters', () => {
      const message = formatLogMessage('Searching logs', {
        level: 'error',
        limit: 20,
        pattern: 'timeout',
      });

      expect(message).toBe('Searching logs level=error limit=20 pattern="timeout"');
    });
  });

  describe('validateTargetPathWithinWorkspace', () => {
    const createContext = (roots: string[]): ToolExecutionContext => ({
      handlerContext: {
        logger: {} as any,
        config: {} as any,
        capabilities: { canAccessLogs: false, canAccessOCAPI: false },
        workspaceRootsService: {
          getRoots: () => roots.map(path => ({ uri: `file://${path}`, path })),
        } as any,
      },
      logger: {} as any,
    });

    it('allows targetPath inside workspace roots', () => {
      const root = resolve(process.cwd());
      const context = createContext([root]);
      const insidePath = join(root, 'tmp', 'cartridge-out');

      const result = validateTargetPathWithinWorkspace(insidePath, context, 'generate_cartridge_structure');
      expect(result).toBe(resolve(insidePath));
    });

    it('rejects targetPath outside workspace roots', () => {
      const root = resolve(process.cwd());
      const context = createContext([root]);
      const outsidePath = resolve(join(root, '..', 'outside-workspace'));

      expect(() => validateTargetPathWithinWorkspace(outsidePath, context, 'generate_cartridge_structure')).toThrow(HandlerError);
      expect(() => validateTargetPathWithinWorkspace(outsidePath, context, 'generate_cartridge_structure')).toThrow('Path must be within workspace roots or current working directory');
    });

    it('rejects fallback mode when cwd resolves to home and roots are unavailable', () => {
      const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(homedir());
      const context = createContext([]);

      try {
        expect(() => validateTargetPathWithinWorkspace(join(homedir(), 'tmp', 'out'), context, 'generate_cartridge_structure')).toThrow(HandlerError);
        expect(() => validateTargetPathWithinWorkspace(join(homedir(), 'tmp', 'out'), context, 'generate_cartridge_structure')).toThrow('Workspace roots are unavailable and current working directory resolves to the home directory');
      } finally {
        cwdSpy.mockRestore();
      }
    });

    it('rejects symlink escape outside workspace roots', () => {
      const sandboxRoot = mkdtempSync(join(process.cwd(), 'tmp-validation-root-'));
      const outsideRoot = mkdtempSync(join(process.cwd(), 'tmp-validation-outside-'));

      try {
        const symlinkPath = join(sandboxRoot, 'escape-link');
        mkdirSync(outsideRoot, { recursive: true });
        symlinkSync(outsideRoot, symlinkPath);

        const context = createContext([sandboxRoot]);
        const escapedTarget = join(symlinkPath, 'generated-cartridge');

        expect(() => validateTargetPathWithinWorkspace(escapedTarget, context, 'generate_cartridge_structure')).toThrow(HandlerError);
        expect(() => validateTargetPathWithinWorkspace(escapedTarget, context, 'generate_cartridge_structure')).toThrow('Path must be within workspace roots or current working directory');
      } finally {
        rmSync(sandboxRoot, { recursive: true, force: true });
        rmSync(outsideRoot, { recursive: true, force: true });
      }
    });
  });
});
