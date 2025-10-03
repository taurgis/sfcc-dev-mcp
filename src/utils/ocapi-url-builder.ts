/**
 * OCAPI URL Builder Utility
 *
 * Provides centralized URL construction for OCAPI endpoints with support for
 * LOCAL_OCAPI_MOCK_URL environment variable override for testing.
 */

import { OCAPIConfig } from '../types/types.js';

/**
 * Build the base URL for OCAPI Data API endpoints
 *
 * @param config - OCAPI configuration object
 * @returns Base URL for OCAPI Data API endpoints
 */
export function buildOCAPIBaseUrl(config: OCAPIConfig): string {
  const version = config.version ?? 'v23_2';
  const hostname = config.hostname;

  // Check if hostname is localhost (with or without port) for HTTP protocol
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    const protocol = hostname.includes('://') ? '' : 'http://';
    return `${protocol}${hostname}/s/-/dw/data/${version}`;
  }

  // For live SFCC instances, use HTTPS
  return `https://${hostname}/s/-/dw/data/${version}`;
}

/**
 * Build the OAuth token URL for OCAPI authentication
 *
 * @param config - OCAPI configuration object
 * @returns OAuth token endpoint URL
 */
export function buildOCAPIAuthUrl(config: OCAPIConfig): string {
  const hostname = config.hostname;

  // Check if hostname is localhost (with or without port) for fallback
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    // For localhost, use the same host and add the auth endpoint path
    const protocol = hostname.includes('://') ? '' : 'http://';
    return `${protocol}${hostname}/dwsso/oauth2/access_token`;
  }

  // For live SFCC instances, use the default Demandware auth URL
  return 'https://account.demandware.com/dwsso/oauth2/access_token';
}
