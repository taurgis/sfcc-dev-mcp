/**
 * Cartridge Directory Structure
 *
 * Defines the directory structure for SFCC cartridges.
 * Separated from the main client for better maintainability.
 */

/**
 * Standard cartridge subdirectories to create
 */
export const CARTRIDGE_DIRECTORIES = [
  'controllers',
  'models',
  'templates',
  'templates/default',
  'templates/resources',
  'client',
  'client/default',
  'client/default/js',
  'client/default/scss',
] as const;

/**
 * Root project files to create
 */
export const ROOT_PROJECT_FILES = [
  'package.json',
  'dw.json',
  'webpack.config.js',
  '.eslintrc.json',
  '.stylelintrc.json',
  '.eslintignore',
  '.gitignore',
] as const;

export type CartridgeDirectory = typeof CARTRIDGE_DIRECTORIES[number];
export type RootProjectFile = typeof ROOT_PROJECT_FILES[number];
