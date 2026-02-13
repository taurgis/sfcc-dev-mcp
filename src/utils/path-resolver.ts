/**
 * Path Resolver Helper
 *
 * Provides utilities for resolving file and directory paths based on the current working directory.
 * This abstraction allows for easier path management and testing.
 */

import path from 'path';
import { fileURLToPath } from 'url';

export class PathResolver {
  /**
   * Get the current working directory (project root)
   */
  static getCurrentWorkingDir(): string {
    // Get the directory of the current module file
    // ts-jest may compile with a CommonJS module target in tests; suppress the
    // diagnostic because runtime uses ESM (NodeNext) where import.meta is valid.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Return the project root (handles both src/ and dist/ locations)
    return path.resolve(__dirname, '..', '..');
  }

  /**
   * Root path for bundled AI instructions (AGENTS.md + skills)
   */
  static getAiInstructionsPath(): string {
    return this.getRelativePath('ai-instructions');
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
    return this.getRelativePath('docs');
  }

  /**
   * Get the SFRA docs directory path relative to the current working directory
   */
  static getSFRADocsPath(): string {
    return this.getRelativePath('docs', 'sfra');
  }
}
