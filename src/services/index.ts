/**
 * Services Index
 *
 * Re-exports all service interfaces and implementations for easy importing
 */

export type { IFileSystemService } from './file-system-service.js';
export { FileSystemService, MockFileSystemService } from './file-system-service.js';

export type { IPathService } from './path-service.js';
export { PathService, MockPathService } from './path-service.js';
