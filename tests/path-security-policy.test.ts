import { isAllowedResolvedPath, isBlockedResolvedPath } from '../src/config/path-security-policy.js';

describe('path-security-policy', () => {
  describe('isAllowedResolvedPath', () => {
    it('allows Windows workspace roots outside the user profile', () => {
      expect(isAllowedResolvedPath('C:\\code\\sfcc-dev-mcp')).toBe(true);
      expect(isAllowedResolvedPath('D:\\src\\project')).toBe(true);
    });

    it('does not allow a bare Windows drive root', () => {
      expect(isAllowedResolvedPath('C:\\')).toBe(false);
    });
  });

  describe('isBlockedResolvedPath', () => {
    it('still blocks Windows system directories under the broader allowlist', () => {
      expect(isBlockedResolvedPath('C:\\Windows\\System32')).toBe(true);
      expect(isBlockedResolvedPath('C:\\Program Files\\nodejs')).toBe(true);
    });
  });
});
