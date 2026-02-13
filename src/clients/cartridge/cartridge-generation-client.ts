/**
 * SFCC Cartridge Generation Client
 *
 * Handles generation of SFCC cartridge directory structures.
 * Templates are delegated to cartridge-templates.ts for better separation of concerns.
 */

import { Logger } from '../../utils/logger.js';
import { IFileSystemService, IPathService } from '../../services/index.js';
import { createCartridgeTemplates, CartridgeTemplates } from './cartridge-templates.js';
import { CARTRIDGE_DIRECTORIES } from './cartridge-structure.js';

export interface CartridgeGenerationOptions {
  cartridgeName: string;
  targetPath?: string;
  fullProjectSetup?: boolean;
}

export interface CartridgeGenerationResult {
  success: boolean;
  message: string;
  createdFiles: string[];
  createdDirectories: string[];
  skippedFiles: string[];
}

export class CartridgeGenerationClient {
  private readonly logger: Logger;
  private readonly templates: CartridgeTemplates;
  private readonly fileSystem: IFileSystemService;
  private readonly pathService: IPathService;

  constructor(fileSystem: IFileSystemService, pathService: IPathService) {
    this.logger = Logger.getChildLogger('CartridgeGenerationClient');
    this.fileSystem = fileSystem;
    this.pathService = pathService;
    this.templates = createCartridgeTemplates();
  }

  /**
   * Generate a complete cartridge structure
   */
  async generateCartridgeStructure(options: CartridgeGenerationOptions): Promise<CartridgeGenerationResult> {
    const { cartridgeName, targetPath, fullProjectSetup = true } = options;
    const createdFiles: string[] = [];
    const createdDirectories: string[] = [];
    const skippedFiles: string[] = [];

    // Validate cartridge name to prevent directory traversal and command injection
    if (!cartridgeName || cartridgeName.trim().length === 0) {
      return {
        success: false,
        message: 'Cartridge name is required',
        createdFiles,
        createdDirectories,
        skippedFiles,
      };
    }

    // Cartridge names must be valid directory names without path separators or special characters
    const sanitizedName = cartridgeName.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(sanitizedName)) {
      return {
        success: false,
        message: 'Invalid cartridge name. Must start with a letter and contain only alphanumeric characters, underscores, and dashes.',
        createdFiles,
        createdDirectories,
        skippedFiles,
      };
    }

    // Prevent path traversal in cartridge name
    if (sanitizedName.includes('..') || sanitizedName.includes('/') || sanitizedName.includes('\\')) {
      return {
        success: false,
        message: 'Invalid cartridge name. Path traversal attempts are not allowed.',
        createdFiles,
        createdDirectories,
        skippedFiles,
      };
    }

    // Limit cartridge name length
    if (sanitizedName.length > 64) {
      return {
        success: false,
        message: 'Cartridge name too long. Maximum 64 characters allowed.',
        createdFiles,
        createdDirectories,
        skippedFiles,
      };
    }

    try {
      this.logger.info(`Starting cartridge generation for: ${sanitizedName}`);

      // Validate and normalize target path
      const rawTargetPath = targetPath ?? process.cwd();

      // Prevent null byte injection in target path
      if (rawTargetPath.includes('\0') || rawTargetPath.includes('\x00')) {
        return {
          success: false,
          message: 'Invalid target path. Contains invalid characters.',
          createdFiles,
          createdDirectories,
          skippedFiles,
        };
      }

      const workingDir = this.normalizeTargetPath(rawTargetPath);

      if (fullProjectSetup) {
        return this.createFullProjectSetup(workingDir, sanitizedName, createdFiles, createdDirectories, skippedFiles);
      }

      return this.addCartridgeToExistingProject(
        workingDir, sanitizedName, createdFiles, createdDirectories, skippedFiles,
      );
    } catch (error) {
      this.logger.error('Error generating cartridge structure:', error);
      return {
        success: false,
        message: `Failed to generate cartridge structure: ${error instanceof Error ? error.message : 'Unknown error'}`,
        createdFiles,
        createdDirectories,
        skippedFiles,
      };
    }
  }

  /**
   * Create full project setup with root files and cartridge structure
   */
  private async createFullProjectSetup(
    workingDir: string,
    cartridgeName: string,
    createdFiles: string[],
    createdDirectories: string[],
    skippedFiles: string[],
  ): Promise<CartridgeGenerationResult> {
    this.logger.info(`Creating full project setup directly in: ${workingDir}`);

    await this.ensureDirectory(workingDir);
    if (!createdDirectories.includes(workingDir)) {
      createdDirectories.push(workingDir);
    }

    await this.createRootFiles(workingDir, cartridgeName, createdFiles, skippedFiles);
    await this.createCartridgeStructure(workingDir, cartridgeName, createdFiles, createdDirectories, skippedFiles);

    return {
      success: true,
      message: `Successfully created full project setup for cartridge '${cartridgeName}' in '${workingDir}'`,
      createdFiles,
      createdDirectories,
      skippedFiles,
    };
  }

  /**
   * Add cartridge to existing project structure
   */
  private async addCartridgeToExistingProject(
    workingDir: string,
    cartridgeName: string,
    createdFiles: string[],
    createdDirectories: string[],
    skippedFiles: string[],
  ): Promise<CartridgeGenerationResult> {
    const cartridgesDir = this.pathService.join(workingDir, 'cartridges');

    await this.ensureDirectory(cartridgesDir);
    if (!createdDirectories.includes(cartridgesDir)) {
      createdDirectories.push(cartridgesDir);
    }

    await this.createCartridgeStructure(workingDir, cartridgeName, createdFiles, createdDirectories, skippedFiles);

    return {
      success: true,
      message: `Successfully created cartridge '${cartridgeName}' in existing project at '${workingDir}'`,
      createdFiles,
      createdDirectories,
      skippedFiles,
    };
  }

  /**
   * Normalize the target path by removing /cartridges suffix
   */
  private normalizeTargetPath(targetPath: string): string {
    let normalized = targetPath.replace(/\/+$/, '');

    if (normalized.endsWith('/cartridges')) {
      normalized = normalized.slice(0, -11);
    }

    this.logger.debug(`Normalized target path from '${targetPath}' to '${normalized}'`);
    return normalized;
  }

  /**
   * Create root project files (package.json, webpack, etc.)
   */
  private async createRootFiles(
    projectDir: string,
    cartridgeName: string,
    createdFiles: string[],
    skippedFiles: string[],
  ): Promise<void> {
    const filesToCreate = [
      { name: 'package.json', content: JSON.stringify(this.templates.packageJson(cartridgeName), null, 2) },
      { name: 'dw.json', content: JSON.stringify(this.templates.dwJson(), null, 2) },
      { name: 'webpack.config.js', content: this.templates.webpackConfig(cartridgeName) },
      { name: '.eslintrc.json', content: JSON.stringify(this.templates.eslintrc(), null, 2) },
      { name: '.stylelintrc.json', content: JSON.stringify(this.templates.stylelintrc(), null, 2) },
      { name: '.eslintignore', content: this.templates.eslintignore() },
      { name: '.gitignore', content: this.templates.gitignore() },
    ];

    for (const file of filesToCreate) {
      const filePath = this.pathService.join(projectDir, file.name);
      await this.safeWriteFile(filePath, file.content, createdFiles, skippedFiles);
    }
  }

  /**
   * Create the cartridge directory structure
   */
  private async createCartridgeStructure(
    baseDir: string,
    cartridgeName: string,
    createdFiles: string[],
    createdDirectories: string[],
    skippedFiles: string[],
  ): Promise<void> {
    // Create cartridges directory
    const cartridgesDir = this.pathService.join(baseDir, 'cartridges');
    await this.ensureDirectory(cartridgesDir);
    createdDirectories.push(cartridgesDir);

    // Create specific cartridge directory
    const cartridgeDir = this.pathService.join(cartridgesDir, cartridgeName);
    await this.ensureDirectory(cartridgeDir);
    createdDirectories.push(cartridgeDir);

    // Create .project file
    const projectPath = this.pathService.join(cartridgeDir, '.project');
    await this.safeWriteFile(projectPath, this.templates.dotProject(cartridgeName), createdFiles, skippedFiles);

    // Create cartridge subdirectory
    const cartridgeSubDir = this.pathService.join(cartridgeDir, 'cartridge');
    await this.ensureDirectory(cartridgeSubDir);
    createdDirectories.push(cartridgeSubDir);

    // Create cartridge properties file
    const propertiesPath = this.pathService.join(cartridgeSubDir, `${cartridgeName}.properties`);
    await this.safeWriteFile(
      propertiesPath, this.templates.projectProperties(cartridgeName), createdFiles, skippedFiles,
    );

    // Create directory structure from constants
    for (const dir of CARTRIDGE_DIRECTORIES) {
      const fullPath = this.pathService.join(cartridgeSubDir, dir);
      await this.ensureDirectory(fullPath);
      createdDirectories.push(fullPath);
    }
  }

  /**
   * Ensure a directory exists, create if it doesn't
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await this.fileSystem.access(dirPath);
    } catch {
      await this.fileSystem.mkdir(dirPath, { recursive: true });
      this.logger.info(`Created directory: ${dirPath}`);
    }
  }

  /**
   * Safely write a file, skipping if it already exists
   */
  private async safeWriteFile(
    filePath: string,
    content: string,
    createdFiles: string[],
    skippedFiles: string[],
  ): Promise<void> {
    try {
      await this.fileSystem.access(filePath);
      skippedFiles.push(filePath);
      this.logger.info(`Skipped existing file: ${filePath}`);
    } catch {
      await this.fileSystem.writeFile(filePath, content);
      createdFiles.push(filePath);
      this.logger.info(`Created file: ${filePath}`);
    }
  }
}
