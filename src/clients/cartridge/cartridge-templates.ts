/**
 * Cartridge File Templates
 *
 * Contains all template generators for SFCC cartridge file generation.
 * Separated from the main client for better maintainability and testability.
 */

export interface CartridgeTemplates {
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

/**
 * Creates the complete set of cartridge templates
 */
export function createCartridgeTemplates(): CartridgeTemplates {
  return {
    packageJson: createPackageJsonTemplate,
    dwJson: createDwJsonTemplate,
    webpackConfig: createWebpackConfigTemplate,
    dotProject: createDotProjectTemplate,
    projectProperties: createProjectPropertiesTemplate,
    eslintrc: createEslintrcTemplate,
    stylelintrc: createStylelintrcTemplate,
    eslintignore: createEslintignoreTemplate,
    gitignore: createGitignoreTemplate,
  };
}

function createPackageJsonTemplate(cartridgeName: string): object {
  return {
    name: cartridgeName,
    version: '0.0.1',
    description: 'New overlay cartridge',
    main: 'index.js',
    scripts: {
      'lint': 'npm run lint:css && npm run lint:js',
      'lint:css': 'sgmf-scripts --lint css',
      'lint:js': 'sgmf-scripts --lint js',
      'lint:fix': 'eslint cartridges --fix',
      upload: 'sgmf-scripts --upload -- ',
      uploadCartridge: `sgmf-scripts --uploadCartridge ${cartridgeName}`,
      'compile:js': 'sgmf-scripts --compile js',
      'compile:scss': 'sgmf-scripts --compile css',
    },
    devDependencies: {
      autoprefixer: '^10.4.14',
      bestzip: '^2.2.1',
      'css-loader': '^6.0.0',
      'css-minimizer-webpack-plugin': '^5.0.1',
      eslint: '^8.56.0',
      'eslint-config-airbnb-base': '^15.0.0',
      'eslint-config-prettier': '^9.1.0',
      'eslint-plugin-import': '^2.29.0',
      'mini-css-extract-plugin': '^2.7.6',
      'postcss-loader': '^7.0.0',
      sass: '^1.69.7',
      'sass-loader': '^13.3.2',
      'sgmf-scripts': '^3.0.0',
      shx: '^0.3.4',
      stylelint: '^15.4.0',
      'stylelint-config-standard-scss': '^11.0.0',
      'webpack-remove-empty-scripts': '^1.0.4',
    },
    browserslist: [
      'last 2 versions',
      'ie >= 10',
    ],
  };
}

function createDwJsonTemplate(): object {
  return {
    hostname: '',
    username: '',
    password: '',
    'code-version': '',
  };
}

function createWebpackConfigTemplate(cartridgeName: string): string {
  return `'use strict';

var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
var sgmfScripts = require('sgmf-scripts');
var RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = [{
    mode: 'development',
    name: 'js',
    entry: sgmfScripts.createJsPath(),
    output: {
        path: path.resolve('./cartridges/${cartridgeName}/cartridge/static'),
        filename: '[name].js'
    }
}, {
    mode: 'none',
    name: 'scss',
    entry: sgmfScripts.createScssPath(),
    output: {
        path: path.resolve('./cartridges/${cartridgeName}/cartridge/static')
    },
    module: {
        rules: [{
            test: /\\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false
                }
            },
            {
                loader: 'css-loader',
                options: {
                    url: false
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [require('autoprefixer')]
                    }
                }
            }, {
                loader: 'sass-loader',
                options: {
                    implementation: require('sass'),
                    sassOptions: {
                        includePaths: [
                            path.resolve(path.resolve(process.cwd(), '../storefront-reference-architecture/node_modules/')),
                            path.resolve(process.cwd(), '../storefront-reference-architecture/node_modules/flag-icons/sass')
                        ]
                    }
                }
            }]
        }]
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css'
        })
    ],
    optimization: {
        minimizer: ['...', new CssMinimizerPlugin()]
    }
}];`;
}

function createDotProjectTemplate(cartridgeName: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
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
</projectDescription>`;
}

function createProjectPropertiesTemplate(cartridgeName: string): string {
  return `## cartridge.properties for cartridge ${cartridgeName}
#demandware.cartridges.${cartridgeName}.multipleLanguageStorefront=true`;
}

function createEslintrcTemplate(): object {
  return {
    root: true,
    extends: 'airbnb-base/legacy',
    globals: {
      session: 'readonly',
      request: 'readonly',
    },
    rules: {
      'import/no-unresolved': 'off',
      indent: ['error', 4, { SwitchCase: 1, VariableDeclarator: 1 }],
      'func-names': 'off',
      'require-jsdoc': 'error',
      'valid-jsdoc': ['error', {
        preferType: {
          Boolean: 'boolean',
          Number: 'number',
          object: 'Object',
          String: 'string',
        },
        requireReturn: false,
      }],
      'vars-on-top': 'off',
      'global-require': 'off',
      'no-shadow': ['error', { allow: ['err', 'callback'] }],
      'max-len': 'off',
      'no-plusplus': 'off',
    },
  };
}

function createStylelintrcTemplate(): object {
  return {
    extends: 'stylelint-config-standard-scss',
    plugins: [
      'stylelint-scss',
    ],
  };
}

function createEslintignoreTemplate(): string {
  return `node_modules/
cartridges/**/cartridge/static/
coverage/
doc/
bin/
codecept.conf.js`;
}

function createGitignoreTemplate(): string {
  return `node_modules/
cartridges/*/cartridge/static/
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage/
.nyc_output/
.env
dw.json`;
}
