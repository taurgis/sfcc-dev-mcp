/**
 * Shared path security policy used by configuration and workspace-root validation.
 */

/**
 * Dangerous system paths that should never be accessed.
 */
const BLOCKED_SYSTEM_PATHS: readonly string[] = [
  '/etc',
  '/proc',
  '/sys',
  '/dev',
  '/root',
  '/var/log',
  '/var/run',
  '/boot',
  '/sbin',
  '/bin',
  'C:\\Windows',
  'C:\\Program Files',
  'C:\\ProgramData',
] as const;

/**
 * Sensitive directory segments that must be blocked even under allowed roots.
 */
const BLOCKED_SENSITIVE_SEGMENT_PATTERNS: readonly RegExp[] = [
  /(^|[\\/])\.ssh([\\/]|$)/i,
  /(^|[\\/])\.gnupg([\\/]|$)/i,
  /(^|[\\/])\.aws([\\/]|$)/i,
  /(^|[\\/])\.config[\\/]gcloud([\\/]|$)/i,
] as const;

/**
 * Allowed path prefixes for local development and CI environments.
 */
const ALLOWED_PATH_PATTERNS: readonly RegExp[] = [
  /^\/Users\/[^/]+\//i,
  /^\/home\/[^/]+\//i,
  /^C:\\Users\\[^\\]+\\/i,
  /^\/opt\//i,
  /^\/var\/www\//i,
  /^\/srv\//i,
  /^\/tmp\//i,
  /^\/private\/tmp\//i,
  /^\/var\/folders\//i,
  /^\/private\/var\/folders\//i,
  /^C:\\Temp\\/i,
  /^\/home\/runner\/work\//i,
] as const;

export function isBlockedResolvedPath(resolvedPath: string): boolean {
  const lowerPath = resolvedPath.toLowerCase();

  for (const blocked of BLOCKED_SYSTEM_PATHS) {
    const blockedLower = blocked.toLowerCase();
    if (
      lowerPath === blockedLower ||
      lowerPath.startsWith(`${blockedLower}/`) ||
      lowerPath.startsWith(`${blockedLower}\\`)
    ) {
      return true;
    }
  }

  return BLOCKED_SENSITIVE_SEGMENT_PATTERNS.some(pattern => pattern.test(resolvedPath));
}

export function isAllowedResolvedPath(resolvedPath: string): boolean {
  return ALLOWED_PATH_PATTERNS.some(pattern => pattern.test(resolvedPath));
}
