/**
 * OCAPI Code Versions Client
 *
 * This module handles all SFCC code version related operations including
 * retrieving code versions and activating specific versions for deployment management.
 */

import { OCAPIConfig } from '../../types/types.js';
import { OCAPIAuthClient } from '../base/ocapi-auth-client.js';
import { Validator } from '../../utils/validator.js';

/**
 * OCAPI Code Versions Client
 * Handles code version management operations for SFCC instances
 */
export class OCAPICodeVersionsClient extends OCAPIAuthClient {
  constructor(config: OCAPIConfig) {
    super(config);
  }

  /**
   * Get all code versions from the SFCC instance
   *
   * @returns {Promise<any>} Code version result with data array containing version information
   */
  async getCodeVersions(): Promise<any> {
    return this.get('/code_versions');
  }

  /**
   * Activate a specific code version by setting its active flag to true
   *
   * @param {string} codeVersionId - The ID of the code version to activate
   * @returns {Promise<any>} Updated code version object
   */
  async activateCodeVersion(codeVersionId: string): Promise<any> {
    Validator.validateRequired({ codeVersionId }, ['codeVersionId']);

    const requestBody = {
      active: true,
    };

    return this.patch(`/code_versions/${codeVersionId}`, requestBody);
  }
}
