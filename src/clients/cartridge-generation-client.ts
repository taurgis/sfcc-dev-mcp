/**
 * SFCC Cartridge Generation Client
 *
 * This client handles the generation of SFCC cartridge directory structures
 * with all necessary files and configurations, replacing the outdated sgmf-scripts
 * with a modern, integrated approach.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '../utils/logger.js';

interface CartridgeGenerationOptions {
  cartridgeName: string;
  targetPath?: string;
  fullProjectSetup?: boolean;
}

interface CartridgeTemplates {
  packageJson: (cartridgeName: string) => object;
  dwJson: () => object;
  webpackConfig: (cartridgeName: string) => string;
  dotProject: (cartridgeName: string) => string;
  projectProperties: (cartridgeName: string) => string;
  eslintrc: () => object;
  stylelintrc: () => object;
  eslintignore: () => string;
  gitignore: () => string;
}

export class CartridgeGenerationClient {
  private logger: Logger;
  private templates: CartridgeTemplates;

  constructor(debug: boolean = false) {
    this.logger = new Logger('CartridgeGenerationClient', debug);
    this.templates = this.initializeTemplates();
  }

  /**
   * Normalize the target path by removing /cartridges or /cartridges/ from the end
   * The cartridge creation always happens from the root folder
   */
  private normalizeTargetPath(targetPath: string): string {
    // Remove trailing slashes first
    let normalized = targetPath.replace(/\/+$/, '');

    // Remove /cartridges from the end if present
    if (normalized.endsWith('/cartridges')) {
      normalized = normalized.slice(0, -11); // Remove '/cartridges' (11 characters)
    }

    this.logger.debug(`Normalized target path from '${targetPath}' to '${normalized}'`);
    return normalized;
  }

  /**
   * Generate a complete cartridge structure
   */
  async generateCartridgeStructure(options: CartridgeGenerationOptions): Promise<{
    success: boolean;
    message: string;
    createdFiles: string[];
    createdDirectories: string[];
  }> {
    const { cartridgeName, targetPath, fullProjectSetup = true } = options;
    const createdFiles: string[] = [];
    const createdDirectories: string[] = [];

    try {
      this.logger.info(`Starting cartridge generation for: ${cartridgeName}`);

      // Determine the working directory and normalize path
      let workingDir = targetPath ?? process.cwd();
      workingDir = this.normalizeTargetPath(workingDir);

      if (fullProjectSetup) {
        // Full project setup - create everything directly in the working directory
        this.logger.info(`Creating full project setup directly in: ${workingDir}`);

        // Create root files directly in working directory
        await this.createRootFiles(workingDir, cartridgeName, createdFiles);

        // Create cartridge structure directly in working directory
        await this.createCartridgeStructure(workingDir, cartridgeName, createdFiles, createdDirectories);

        return {
          success: true,
          message: `Successfully created full project setup for cartridge '${cartridgeName}' in '${workingDir}'`,
          createdFiles,
          createdDirectories,
        };
      } else {
        // Cartridge-only setup - add to existing project
        const cartridgesDir = path.join(workingDir, 'cartridges');

        // Ensure cartridges directory exists
        await this.ensureDirectory(cartridgesDir);
        if (!createdDirectories.includes(cartridgesDir)) {
          createdDirectories.push(cartridgesDir);
        }

        // Create cartridge structure
        await this.createCartridgeStructure(workingDir, cartridgeName, createdFiles, createdDirectories);

        return {
          success: true,
          message: `Successfully created cartridge '${cartridgeName}' in existing project at '${workingDir}'`,
          createdFiles,
          createdDirectories,
        };
      }
    } catch (error) {
      this.logger.error('Error generating cartridge structure:', error);
      return {
        success: false,
        message: `Failed to generate cartridge structure: ${error instanceof Error ? error.message : 'Unknown error'}`,
        createdFiles,
        createdDirectories,
      };
    }
  }

  /**
   * Create root project files (package.json, webpack, etc.)
   */
  private async createRootFiles(projectDir: string, cartridgeName: string, createdFiles: string[]): Promise<void> {
    // Create package.json
    const packageJsonPath = path.join(projectDir, 'package.json');
    await fs.writeFile(packageJsonPath, JSON.stringify(this.templates.packageJson(cartridgeName), null, 2));
    createdFiles.push(packageJsonPath);

    // Create dw.json
    const dwJsonPath = path.join(projectDir, 'dw.json');
    await fs.writeFile(dwJsonPath, JSON.stringify(this.templates.dwJson(), null, 2));
    createdFiles.push(dwJsonPath);

    // Create webpack.config.js
    const webpackPath = path.join(projectDir, 'webpack.config.js');
    await fs.writeFile(webpackPath, this.templates.webpackConfig(cartridgeName));
    createdFiles.push(webpackPath);

    // Create .eslintrc.json
    const eslintrcPath = path.join(projectDir, '.eslintrc.json');
    await fs.writeFile(eslintrcPath, JSON.stringify(this.templates.eslintrc(), null, 2));
    createdFiles.push(eslintrcPath);

    // Create .stylelintrc.json
    const stylelintrcPath = path.join(projectDir, '.stylelintrc.json');
    await fs.writeFile(stylelintrcPath, JSON.stringify(this.templates.stylelintrc(), null, 2));
    createdFiles.push(stylelintrcPath);

    // Create .eslintignore
    const eslintignorePath = path.join(projectDir, '.eslintignore');
    await fs.writeFile(eslintignorePath, this.templates.eslintignore());
    createdFiles.push(eslintignorePath);

    // Create .gitignore
    const gitignorePath = path.join(projectDir, '.gitignore');
    await fs.writeFile(gitignorePath, this.templates.gitignore());
    createdFiles.push(gitignorePath);
  }

  /**
   * Create the cartridge directory structure
   */
  private async createCartridgeStructure(
    baseDir: string,
    cartridgeName: string,
    createdFiles: string[],
    createdDirectories: string[],
  ): Promise<void> {
    // Create cartridges directory
    const cartridgesDir = path.join(baseDir, 'cartridges');
    await this.ensureDirectory(cartridgesDir);
    createdDirectories.push(cartridgesDir);

    // Create specific cartridge directory
    const cartridgeDir = path.join(cartridgesDir, cartridgeName);
    await this.ensureDirectory(cartridgeDir);
    createdDirectories.push(cartridgeDir);

    // Create .project file
    const projectPath = path.join(cartridgeDir, '.project');
    await fs.writeFile(projectPath, this.templates.dotProject(cartridgeName));
    createdFiles.push(projectPath);

    // Create cartridge subdirectory
    const cartridgeSubDir = path.join(cartridgeDir, 'cartridge');
    await this.ensureDirectory(cartridgeSubDir);
    createdDirectories.push(cartridgeSubDir);

    // Create cartridge properties file
    const propertiesPath = path.join(cartridgeSubDir, `${cartridgeName}.properties`);
    await fs.writeFile(propertiesPath, this.templates.projectProperties(cartridgeName));
    createdFiles.push(propertiesPath);

    // Create directory structure
    const directories = [
      'controllers',
      'models',
      'templates',
      'templates/default',
      'templates/resources',
      'client',
      'client/default',
      'client/default/js',
      'client/default/scss',
    ];

    for (const dir of directories) {
      const fullPath = path.join(cartridgeSubDir, dir);
      await this.ensureDirectory(fullPath);
      createdDirectories.push(fullPath);
    }
  }

  /**
   * Ensure a directory exists, create if it doesn't
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      this.logger.info(`Created directory: ${dirPath}`);
    }
  }

  /**
   * Initialize all file templates
   */
  private initializeTemplates(): CartridgeTemplates {
    return {
      packageJson: (cartridgeName: string) => ({
        name: cartridgeName,
        version: '0.0.1',
        description: 'New overlay cartridge',
        main: 'index.js',
        scripts: {
          lint: 'sgmf-scripts --lint js && sgmf-scripts --lint css',
          'lint:fix': 'sgmf-scripts --lint js --fix && sgmf-scripts --lint css --fix',
          upload: 'sgmf-scripts --upload -- ',
          uploadCartridge: `sgmf-scripts --uploadCartridge ${cartridgeName}`,
          'compile:js': 'sgmf-scripts --compile js',
          'compile:scss': 'sgmf-scripts --compile css',
        },
        devDependencies: {
          autoprefixer: '^10.4.16',
          'css-minimizer-webpack-plugin': '^5.0.1',
          'mini-css-extract-plugin': '^2.7.6',
          eslint: '^8.56.0',
          'eslint-config-airbnb-base': '^15.0.0',
          'eslint-plugin-import': '^2.29.0',
          stylelint: '^15.4.0',
          'stylelint-config-standard-scss': '^10.0.0',
          nyc: '^15.1.0',
          mocha: '^10.0.0',
          sinon: '^17.0.1',
          chai: '^3.5.0',
          proxyquire: '1.7.4',
          'sgmf-scripts': '^2.0.0',
          'css-loader': '^6.0.0',
          'postcss-loader': '^7.0.0',
          sass: '^1.69.7',
          'sass-loader': '^13.3.2',
          'webpack-remove-empty-scripts': '^1.0.4',
        },
        browserslist: [
          'last 2 versions',
          'ie >= 10',
        ],
      }),

      dwJson: () => ({
        hostname: '',
        username: '',
        password: '',
        'code-version': '',
      }),

      webpackConfig: (cartridgeName: string) => `var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
var RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
var sgmfScripts = require('sgmf-scripts');

module.exports = [{
    mode: 'production',
    name: 'js',
    entry: sgmfScripts.createJsPath(),
    output: {
        path: path.resolve('./cartridges/${cartridgeName}/cartridge/static'),
        filename: '[name].js'
    }
},
{
    mode: 'none',
    name: 'scss',
    entry: sgmfScripts.createScssPath(),
    output: {
        path: path.resolve('./cartridges/${cartridgeName}/cartridge/static')
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css'
        })
    ],
    module: {
        rules: [{
            test: /\\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            includePaths: [
                                path.resolve('node_modules'),
                                path.resolve('cartridges')
                            ]
                        }
                    }
                }
            ]
        }]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    }
}];`,

      dotProject: (cartridgeName: string) => `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
    <name>${cartridgeName}</name>
    <comment></comment>
    <projects>
    </projects>
    <buildSpec>
        <buildCommand>
            <name>com.demandware.studio.core.beehiveElementBuilder</name>
            <arguments>
            </arguments>
        </buildCommand>
    </buildSpec>
    <natures>
        <nature>com.demandware.studio.core.beehiveNature</nature>
    </natures>
</projectDescription>`,

      projectProperties: (cartridgeName: string) => `## cartridge.properties for cartridge ${cartridgeName}
#demandware.cartridges.${cartridgeName}.multipleLanguageStorefront=true`,

      eslintrc: () => ({
        root: true,
        extends: 'airbnb-base/legacy',
      }),

      stylelintrc: () => ({
        extends: 'stylelint-config-standard-scss',
        plugins: [
          'stylelint-scss',
        ],
      }),

      eslintignore: () => `node_modules/
cartridges/**/cartridge/static/
coverage/
doc/
bin/
codecept.conf.js`,

      gitignore: () => `node_modules/
cartridges/*/cartridge/static/
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage/
.nyc_output/
.env
dw.json`,
    };
  }
}
