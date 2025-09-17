/**
 * Referenced Types Extractor
 *
 * Responsible for extracting referenced types from SFCC class documentation
 * content. Analyzes property types, method signatures, return types, and
 * parameter types to identify related classes.
 *
 * Single Responsibility: Type reference extraction from documentation content
 */

export class ReferencedTypesExtractor {
  /**
   * Parse markdown content and extract referenced types from a class
   */
  static extractReferencedTypes(content: string): string[] {
    const referencedTypes = new Set<string>();
    const lines = content.split('\n');

    for (const line of lines) {
      // Extract types from property definitions
      const propTypeMatch = line.match(/\*\*Type:\*\*\s*([A-Za-z][A-Za-z0-9.]*)/);
      if (propTypeMatch) {
        const type = propTypeMatch[1];
        // Only include SFCC types (those that start with uppercase or contain dots)
        if (this.isSFCCType(type)) {
          referencedTypes.add(type);
        }
      }

      // Extract return types from method signatures
      const methodReturnMatch = line.match(/:\s*([A-Za-z][A-Za-z0-9.]*)\s*$/);
      if (methodReturnMatch) {
        const type = methodReturnMatch[1];
        if (this.isSFCCType(type)) {
          referencedTypes.add(type);
        }
      }

      // Extract parameter types from method signatures
      const paramMatches = line.match(/\(\s*([^)]+)\s*\)/);
      if (paramMatches) {
        const params = paramMatches[1];
        const typeMatches = params.match(/:\s*([A-Za-z][A-Za-z0-9.]*)/g);
        if (typeMatches) {
          typeMatches.forEach(match => {
            const type = match.replace(/:\s*/, '');
            if (this.isSFCCType(type)) {
              referencedTypes.add(type);
            }
          });
        }
      }
    }

    return Array.from(referencedTypes);
  }

  /**
   * Check if a type name represents an SFCC type
   * SFCC types typically start with uppercase or contain dots
   */
  private static isSFCCType(type: string): boolean {
    return /^[A-Z]/.test(type) || type.includes('.');
  }

  /**
   * Filter out circular references and self-references
   */
  static filterCircularReferences(
    referencedTypes: string[],
    currentClassName: string,
  ): string[] {
    return referencedTypes.filter(typeName => {
      // Skip if it's the same class to avoid circular references
      if (typeName === currentClassName || typeName.endsWith(`.${currentClassName}`)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Extract and filter referenced types with circular reference protection
   */
  static extractFilteredReferencedTypes(
    content: string,
    currentClassName: string,
  ): string[] {
    const referencedTypes = this.extractReferencedTypes(content);
    return this.filterCircularReferences(referencedTypes, currentClassName);
  }
}
