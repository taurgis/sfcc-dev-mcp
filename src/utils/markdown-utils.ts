/**
 * Markdown Document Utilities
 *
 * Shared utilities for parsing and extracting content from markdown documentation files.
 * Used by SFRA, ISML, and Best Practices clients to avoid code duplication.
 */

/**
 * Extract description from markdown content
 * Looks for Overview section first, then falls back to first paragraph after title
 */
export function extractDescriptionFromContent(content: string): string {
  // Look for Overview section
  const overviewMatch = content.match(/##\s+Overview\s+(.+?)(?=\n##|\n\*\*|$)/s);
  if (overviewMatch) {
    const firstPara = overviewMatch[1].trim().split('\n\n')[0];
    return firstPara.replace(/\n/g, ' ').trim();
  }

  // Fallback to first paragraph after title
  const firstParaMatch = content.match(/^#.+?\n\n(.+?)(?=\n\n|$)/s);
  if (firstParaMatch) {
    return firstParaMatch[1].replace(/\n/g, ' ').trim();
  }

  return '';
}

/**
 * Extract description from lines array with optional title context
 */
export function extractDescriptionFromLines(lines: string[], title?: string): string {
  const titleIndex = title
    ? lines.findIndex(line => line.trim() === `# ${title}` || line.startsWith('#'))
    : lines.findIndex(line => line.startsWith('#'));

  if (titleIndex === -1) {
    return 'No description available';
  }

  // Look for overview section first
  const overviewIndex = lines.findIndex((line, index) =>
    index > titleIndex && line.toLowerCase().includes('## overview'),
  );

  if (overviewIndex !== -1) {
    let descriptionEnd = lines.findIndex((line, index) =>
      index > overviewIndex + 1 && line.startsWith('##'),
    );

    if (descriptionEnd === -1) {
      descriptionEnd = Math.min(lines.length, overviewIndex + 10);
    }

    const overviewContent = lines.slice(overviewIndex + 1, descriptionEnd)
      .filter(line => line.trim() && !line.startsWith('#'))
      .join(' ')
      .trim();

    if (overviewContent) {
      return truncateWithEllipsis(overviewContent, 300);
    }
  }

  // Fallback to first paragraph after title
  let descriptionStart = titleIndex + 1;
  while (descriptionStart < lines.length && !lines[descriptionStart].trim()) {
    descriptionStart++;
  }

  const descriptionEnd = lines.findIndex((line, index) =>
    index > descriptionStart && (line.startsWith('#') || line.trim() === ''));

  const description = lines
    .slice(descriptionStart, descriptionEnd > -1 ? descriptionEnd : descriptionStart + 3)
    .filter(line => line.trim() && !line.startsWith('#'))
    .join(' ')
    .trim();

  return description || 'No description available';
}

/**
 * Extract section headings from markdown content
 */
export function extractSections(content: string, headingLevel: number = 2): string[] {
  const prefix = '#'.repeat(headingLevel);
  // Use negative lookahead to ensure we don't match more # than specified
  const regex = new RegExp(`^${prefix}(?!#)\\s+(.+)$`, 'gm');
  const sections: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    sections.push(match[1].trim());
  }

  return sections;
}

/**
 * Extract properties from document content (### headings in a Properties section)
 */
export function extractProperties(lines: string[]): string[] {
  return extractSectionItems(lines, ['## properties', '## property']);
}

/**
 * Extract methods from document content (### headings in a Methods section)
 */
export function extractMethods(lines: string[]): string[] {
  return extractSectionItems(lines, ['## method', '## function', '## methods', '## functions']);
}

/**
 * Generic extraction of ### items from specific ## sections
 */
function extractSectionItems(lines: string[], sectionPatterns: string[]): string[] {
  const items: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const lineLower = line.toLowerCase();

    // Check if we're entering the target section
    if (sectionPatterns.some(pattern => lineLower.includes(pattern))) {
      inSection = true;
      continue;
    }

    // Check if we're leaving the section (hit another ## heading)
    if (inSection && line.startsWith('## ') &&
        !sectionPatterns.some(pattern => lineLower.includes(pattern.replace('## ', '')))) {
      break;
    }

    // Extract ### items
    if (inSection && line.startsWith('### ')) {
      const item = line.replace('### ', '').trim();
      if (!items.includes(item)) {
        items.push(item);
      }
    }
  }

  return items;
}

/**
 * Truncate text with ellipsis
 */
export function truncateWithEllipsis(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Calculate search relevance score for a document
 */
export function calculateSearchRelevance(
  searchQuery: string,
  fields: {
    name?: string;
    title?: string;
    description?: string;
    sections?: string[];
    content?: string;
    attributes?: string[];
  },
  weights: {
    nameExact?: number;
    namePartial?: number;
    title?: number;
    description?: number;
    section?: number;
    content?: number;
    contentMax?: number;
    attribute?: number;
  } = {},
): number {
  const {
    nameExact = 150,
    namePartial = 100,
    title = 50,
    description = 30,
    section = 10,
    content = 2,
    contentMax = 20,
    attribute = 15,
  } = weights;

  const lowerQuery = searchQuery.toLowerCase();
  let score = 0;

  // Name match (highest priority)
  if (fields.name) {
    const lowerName = fields.name.toLowerCase();
    if (lowerName === lowerQuery) {
      score += nameExact;
    } else if (lowerName.includes(lowerQuery)) {
      score += namePartial;
    }
  }

  // Title match
  if (fields.title?.toLowerCase().includes(lowerQuery)) {
    score += title;
  }

  // Description match
  if (fields.description?.toLowerCase().includes(lowerQuery)) {
    score += description;
  }

  // Section name match
  if (fields.sections) {
    for (const s of fields.sections) {
      if (s.toLowerCase().includes(lowerQuery)) {
        score += section;
      }
    }
  }

  // Content match (lower priority, capped)
  if (fields.content) {
    const matches = (fields.content.toLowerCase().match(new RegExp(lowerQuery, 'g')) ?? []).length;
    score += Math.min(matches * content, contentMax);
  }

  // Attribute match
  if (fields.attributes) {
    for (const attr of fields.attributes) {
      if (attr.toLowerCase().includes(lowerQuery)) {
        score += attribute;
      }
    }
  }

  return score;
}

/**
 * Generate a preview snippet around a search match
 */
export function generateSearchPreview(content: string, query: string, contextChars: number = 100): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const index = lowerContent.indexOf(lowerQuery);
  if (index === -1) {
    return content.slice(0, contextChars * 2);
  }

  const start = Math.max(0, index - contextChars);
  const end = Math.min(content.length, index + query.length + contextChars);
  let preview = content.slice(start, end);

  // Clean up and add ellipsis
  preview = preview.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

  if (start > 0) {
    preview = `...${preview}`;
  }
  if (end < content.length) {
    preview = `${preview}...`;
  }

  return preview;
}

/**
 * Format a document name for display (kebab-case to Title Case)
 */
export function formatDocumentName(documentName: string): string {
  return documentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
