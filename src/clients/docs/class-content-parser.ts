/**
 * Class Content Parser
 *
 * Responsible for parsing markdown documentation content and extracting
 * structured class information including constants, properties, methods, and inheritance.
 *
 * Single Responsibility: Converting markdown content to structured data
 */

import { Logger } from '../../utils/logger.js';

export interface SFCCMethod {
  name: string;
  signature: string;
  description: string;
  parameters?: string[];
  returnType?: string;
  deprecated?: boolean;
  deprecationMessage?: string;
}

export interface SFCCProperty {
  name: string;
  type: string;
  description: string;
  modifiers?: string[];
  deprecated?: boolean;
  deprecationMessage?: string;
}

export interface SFCCConstant {
  name: string;
  type: string;
  value?: string;
  description: string;
  deprecated?: boolean;
  deprecationMessage?: string;
}

export interface SFCCClassDetails {
  className: string;
  packageName: string;
  description: string;
  constants: SFCCConstant[];
  properties: SFCCProperty[];
  methods: SFCCMethod[];
  inheritance?: string[];
  constructorInfo?: string;
}

export class ClassContentParser {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getChildLogger('ClassContentParser');
  }

  /**
   * Parse markdown content and extract structured class information
   */
  parseClassContent(content: string): SFCCClassDetails {
    const lines = content.split('\n');

    let currentSection = '';
    let className = '';
    let packageName = '';
    let description = '';
    const constants: SFCCConstant[] = [];
    const properties: SFCCProperty[] = [];
    const methods: SFCCMethod[] = [];
    const inheritance: string[] = [];
    let constructorInfo = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Extract package name
      if (line.startsWith('## Package:')) {
        packageName = line.replace('## Package:', '').trim();
      }

      // Extract class name
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        className = line.replace('# ', '').replace('Class ', '').trim();
      }

      // Track current section
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
      }

      // Extract description
      if (currentSection === 'Description' && line && !line.startsWith('#')) {
        description += `${line} `;
      }

      // Extract inheritance hierarchy
      if (currentSection === 'Inheritance Hierarchy' && line.includes('-')) {
        const hierarchyItem = line.replace(/^[\s-]*/, '').trim();
        if (hierarchyItem) {
          inheritance.push(hierarchyItem);
        }
      }

      // Extract constants
      if (currentSection === 'Constants' && line.startsWith('### ')) {
        const constant = this.parseConstant(line, lines, i);
        if (constant) {
          constants.push(constant);
        }
      }

      // Extract properties
      if (currentSection === 'Properties' && line.startsWith('### ')) {
        const property = this.parseProperty(line, lines, i);
        if (property) {
          properties.push(property);
        }
      }

      // Extract methods
      if ((currentSection === 'Method Summary' || currentSection === 'Method Details') && line.startsWith('### ')) {
        const method = this.parseMethod(line, lines, i);
        if (method) {
          methods.push(method);
        }
      }

      // Extract constructor info
      if (currentSection === 'Constructor Summary' && line && !line.startsWith('#')) {
        constructorInfo += `${line} `;
      }
    }

    return {
      className: className.trim(),
      packageName: packageName.trim(),
      description: description.trim(),
      constants,
      properties,
      methods,
      inheritance: inheritance.length > 0 ? inheritance : undefined,
      constructorInfo: constructorInfo.trim() || undefined,
    };
  }

  /**
   * Parse a constant definition from markdown content
   */
  private parseConstant(headerLine: string, lines: string[], startIndex: number): SFCCConstant | null {
    const constName = headerLine.replace('### ', '').trim();
    let constType = '';
    let constValue = '';
    let constDesc = '';
    let deprecated = false;
    let deprecationMessage = '';

    // Look for type, value and description in following lines
    for (let j = startIndex + 1; j < lines.length && !lines[j].startsWith('#'); j++) {
      const nextLine = lines[j].trim();

      if (nextLine.startsWith('**Type:**')) {
        const typeMatch = nextLine.match(/\*\*Type:\*\*\s*(.+)/);
        if (typeMatch) {
          const typeInfo = typeMatch[1];
          // Extract type and value if present (e.g., "String = 'COMPLETED'" or "Number = 8")
          const valueMatch = typeInfo.match(/^(\w+)\s*=\s*(.+)$/);
          if (valueMatch) {
            constType = valueMatch[1];
            constValue = valueMatch[2];
          } else {
            constType = typeInfo.trim();
          }
        }
      } else if (nextLine.startsWith('**Deprecated:**')) {
        const deprecationInfo = this.parseDeprecationInfo(nextLine, lines, j);
        deprecated = true;
        deprecationMessage = deprecationInfo.message;
      } else if (nextLine && !nextLine.startsWith('**') && !nextLine.startsWith('#')) {
        constDesc += `${nextLine} `;
      }
    }

    return {
      name: constName,
      type: constType,
      value: constValue || undefined,
      description: constDesc.trim(),
      deprecated: deprecated || undefined,
      deprecationMessage: deprecationMessage || undefined,
    };
  }

  /**
   * Parse a property definition from markdown content
   */
  private parseProperty(headerLine: string, lines: string[], startIndex: number): SFCCProperty | null {
    const propName = headerLine.replace('### ', '').trim();
    let propType = '';
    let propDesc = '';
    const modifiers: string[] = [];
    let deprecated = false;
    let deprecationMessage = '';

    // Look for type and description in following lines
    for (let j = startIndex + 1; j < lines.length && !lines[j].startsWith('#'); j++) {
      const nextLine = lines[j].trim();

      if (nextLine.startsWith('**Type:**')) {
        const typeMatch = nextLine.match(/\*\*Type:\*\*\s*(.+)/);
        if (typeMatch) {
          const typeInfo = typeMatch[1];
          propType = typeInfo.split(' ')[0];
          if (typeInfo.includes('(Read Only)')) {
            modifiers.push('Read Only');
          }
          if (typeInfo.includes('(Static)')) {
            modifiers.push('Static');
          }
        }
      } else if (nextLine.startsWith('**Deprecated:**')) {
        const deprecationInfo = this.parseDeprecationInfo(nextLine, lines, j);
        deprecated = true;
        deprecationMessage = deprecationInfo.message;
      } else if (nextLine && !nextLine.startsWith('**') && !nextLine.startsWith('#')) {
        propDesc += `${nextLine} `;
      }
    }

    return {
      name: propName,
      type: propType,
      description: propDesc.trim(),
      modifiers: modifiers.length > 0 ? modifiers : undefined,
      deprecated: deprecated || undefined,
      deprecationMessage: deprecationMessage || undefined,
    };
  }

  /**
   * Parse a method definition from markdown content
   */
  private parseMethod(headerLine: string, lines: string[], startIndex: number): SFCCMethod | null {
    const methodName = headerLine.replace('### ', '').trim();
    let signature = '';
    let methodDesc = '';
    let deprecated = false;
    let deprecationMessage = '';

    // Look for signature and description in following lines
    for (let j = startIndex + 1; j < lines.length && !lines[j].startsWith('#'); j++) {
      const nextLine = lines[j].trim();

      if (nextLine.startsWith('**Signature:**')) {
        const sigMatch = nextLine.match(/\*\*Signature:\*\*\s*`(.+)`/);
        if (sigMatch) {
          signature = sigMatch[1];
        }
      } else if (nextLine.startsWith('**Description:**')) {
        methodDesc = nextLine.replace('**Description:**', '').trim();
      } else if (nextLine.startsWith('**Deprecated:**')) {
        const deprecationInfo = this.parseDeprecationInfo(nextLine, lines, j);
        deprecated = true;
        deprecationMessage = deprecationInfo.message;
      } else if (nextLine && !nextLine.startsWith('**') && !nextLine.startsWith('#') && !nextLine.startsWith('---')) {
        if (!methodDesc && !nextLine.includes('Signature:')) {
          methodDesc += `${nextLine} `;
        }
      }
    }

    return {
      name: methodName,
      signature: signature || methodName,
      description: methodDesc.trim(),
      deprecated: deprecated || undefined,
      deprecationMessage: deprecationMessage || undefined,
    };
  }

  /**
   * Parse deprecation information from markdown content
   */
  private parseDeprecationInfo(deprecationLine: string, lines: string[], startIndex: number): { message: string } {
    let deprecationMessage = '';

    // Check if there's a message on the same line
    const sameLineMessage = deprecationLine.replace('**Deprecated:**', '').trim();
    if (sameLineMessage) {
      deprecationMessage = sameLineMessage;
    } else {
      // Look for the deprecation message on subsequent lines until next ** marker
      const depLines: string[] = [];
      for (let k = startIndex + 1; k < lines.length && !lines[k].startsWith('#'); k++) {
        const depLine = lines[k].trim();
        if (depLine.startsWith('**') && !depLine.startsWith('**Deprecated:**')) {
          break; // Stop at next ** marker
        }
        if (depLine && !depLine.startsWith('---')) {
          depLines.push(depLine);
        }
      }
      deprecationMessage = depLines.join(' ').trim();
    }

    return { message: deprecationMessage };
  }
}
