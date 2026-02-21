/**
 * Path Resolver Helper
 *
 * Provides utilities for resolving file and directory paths based on the current working directory.
 * This abstraction allows for easier path management and testing.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export class PathResolver {
  /**
   * Resolve the first existing path from a list of candidates.
   * Falls back to the first candidate when none exist.
   */
  private static resolveExistingPath(candidates: string[]): string {
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    return candidates[0];
  }

  /**
   * Get the current working directory (project root)
   */
  static getCurrentWorkingDir(): string {
    // Get the directory of the current module file
    // ts-jest may compile with a CommonJS module target in tests.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TS1343: runtime uses ESM (NodeNext) where import.meta is valid.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Return the project root (handles both src/ and dist/ locations)
    return path.resolve(__dirname, '..', '..');
  }

  /**
   * Root path for bundled AI instructions (AGENTS.md + skills)
   */
  static getAiInstructionsPath(): string {
    const root = this.getCurrentWorkingDir();
    return this.resolveExistingPath([
      path.join(root, 'ai-instructions'),
      path.join(root, 'dist', 'ai-instructions'),
    ]);
  }

  /**
   * Path to the bundled AGENTS.md
   */
  static getAgentsInstructionsFile(): string {
    return path.join(this.getAiInstructionsPath(), 'AGENTS.md');
  }

  /**
   * Path to the bundled skills directory
   */
  static getSkillsSourcePath(): string {
    return path.join(this.getAiInstructionsPath(), 'skills');
  }

  /**
   * Get a path relative to the current working directory
   */
  static getRelativePath(...pathSegments: string[]): string {
    const currentDir = this.getCurrentWorkingDir();

    return path.join(currentDir, ...pathSegments);
  }

  /**
   * Get the docs directory path relative to the current working directory
   */
  static getDocsPath(): string {
    const root = this.getCurrentWorkingDir();
    return this.resolveExistingPath([
      path.join(root, 'docs'),
      path.join(root, 'dist', 'docs'),
    ]);
  }

  /**
   * Get the SFRA docs directory path relative to the current working directory
   */
  static getSFRADocsPath(): string {
    return path.join(this.getDocsPath(), 'sfra');
  }
}
