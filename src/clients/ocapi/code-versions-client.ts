/**
 * OCAPI Code Versions Client
 *
 * This module handles all SFCC code version related operations including
 * retrieving code versions and activating specific versions for deployment management.
 */

import { OCAPIConfig } from '../../types/types.js';
import { OCAPIAuthClient } from '../base/ocapi-auth-client.js';
import { Validator } from '../../utils/validator.js';
import { buildOCAPIBaseUrl } from '../../utils/ocapi-url-builder.js';

export interface CodeVersion {
  id: string;
  active: boolean;
  cartridges?: string;
  compatibility_mode?: string;
  activation_time?: string;
  total_size?: string;
  _type?: string;
  _resource_state?: string;
  [key: string]: unknown;
}

export interface CodeVersionsResponse {
  data: CodeVersion[];
  _v?: string;
  _type?: string;
  count?: number;
  total?: number;
  [key: string]: unknown;
}

/**
 * OCAPI Code Versions Client
 * Handles code version management operations for SFCC instances
 */
export class OCAPICodeVersionsClient extends OCAPIAuthClient {
  constructor(config: OCAPIConfig) {
    super(config);
    // Override the baseUrl for this specialized client
    this.baseUrl = buildOCAPIBaseUrl(config);
  }

  /**
   * Get all code versions from the SFCC instance
   *
   * @returns Code version result with data array containing version information
   */
  async getCodeVersions(): Promise<CodeVersionsResponse> {
    return this.get<CodeVersionsResponse>('/code_versions');
  }

  /**
   * Activate a specific code version by setting its active flag to true
   *
   * @param {string} codeVersionId - The ID of the code version to activate
   * @returns Updated code version object
   */
  async activateCodeVersion(codeVersionId: string): Promise<CodeVersion> {
    Validator.validateRequired({ codeVersionId }, ['codeVersionId']);

    // Validate code version ID format to prevent URL injection
    // Code version IDs should be alphanumeric with underscores, dashes, and dots
    if (!/^[a-zA-Z0-9_.-]+$/.test(codeVersionId)) {
      throw new Error('Invalid code version ID format. Must contain only alphanumeric characters, underscores, dashes, and dots.');
    }

    const requestBody = {
      active: true,
    };

    return this.patch<CodeVersion>(`/code_versions/${encodeURIComponent(codeVersionId)}`, requestBody);
  }
}
