/**
 * Class Name Resolver
 *
 * Responsible for normalizing and resolving SFCC class names between
 * different formats (dot notation vs underscore notation) and extracting
 * simple class names from fully qualified names.
 *
 * Single Responsibility: Class name format conversion and resolution
 */

export class ClassNameResolver {
  /**
   * Normalize class name to handle both dot and underscore formats
   * Examples:
   * - dw.content.ContentMgr -> dw_content.ContentMgr
   * - dw_content.ContentMgr -> dw_content.ContentMgr (unchanged)
   * - ContentMgr -> ContentMgr (unchanged)
   */
  static normalizeClassName(className: string): string {
    // If it contains dots but not underscores in the package part, convert dots to underscores
    if (className.includes('.') && !className.includes('_')) {
      // Split by dots and convert package parts (all but last) to use underscores
      const parts = className.split('.');
      if (parts.length > 1) {
        const packageParts = parts.slice(0, -1);
        const simpleClassName = parts[parts.length - 1];
        return `${packageParts.join('_')}.${simpleClassName}`;
      }
    }
    return className;
  }

  /**
   * Extract simple class name from full class name
   * Examples:
   * - dw_content.ContentMgr -> ContentMgr
   * - ContentMgr -> ContentMgr
   */
  static extractSimpleClassName(className: string): string {
    const parts = className.split('.');
    return parts[parts.length - 1];
  }

  /**
   * Convert class names from internal format to official format
   * Examples:
   * - dw_content.ContentMgr -> dw.content.ContentMgr
   * - TopLevel.String -> String
   */
  static toOfficialFormat(className: string): string {
    return className.replace(/_/g, '.');
  }

  /**
   * Find class matches by simple class name
   * Useful when multiple packages contain classes with the same name
   */
  static findClassMatches(
    targetClassName: string,
    classCache: Map<string, any>,
  ): Array<{ key: string; info: any }> {
    const normalizedTarget = this.normalizeClassName(targetClassName);
    const simpleTarget = this.extractSimpleClassName(normalizedTarget);

    return Array.from(classCache.entries())
      .filter(([, info]) => info.className === simpleTarget)
      .map(([key, info]) => ({ key, info }));
  }

  /**
   * Resolve class name with fallback logic
   * First tries exact match, then falls back to simple name matching
   */
  static resolveClassName(
    className: string,
    classCache: Map<string, any>,
  ): { key: string; info: any } | null {
    // Normalize class name to support both formats
    const normalizedClassName = this.normalizeClassName(className);

    // Try exact match first with normalized name
    const exactMatch = classCache.get(normalizedClassName);
    if (exactMatch) {
      return { key: normalizedClassName, info: exactMatch };
    }

    // If not found, try to find by class name only (without package)
    const matches = this.findClassMatches(normalizedClassName, classCache);

    if (matches.length === 1) {
      return matches[0];
    } else if (matches.length > 1) {
      const matchKeys = matches.map(({ key }) => key).join(', ');
      throw new Error(`Multiple classes found with name "${this.extractSimpleClassName(normalizedClassName)}": ${matchKeys}`);
    }

    return null;
  }
}
