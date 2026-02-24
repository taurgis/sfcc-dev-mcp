/**
 * Validation Utilities
 *
 * This module provides validation functions for SFCC API parameters and inputs.
 * It includes common validation patterns used across different API clients.
 */

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'VALIDATION_ERROR',
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valid instance types for SFCC site preferences
 */
const VALID_INSTANCE_TYPES = ['staging', 'development', 'sandbox', 'production'] as const;
export type InstanceType = typeof VALID_INSTANCE_TYPES[number];

/**
 * Validation utility class
 */
export class Validator {
  /**
   * Validate that required fields are present and not empty
   */
  static validateRequired(params: Record<string, unknown>, requiredFields: string[]): void {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = params[field];
      if (value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      throw new ValidationError(`Required fields are missing or empty: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Validate instance type for site preferences
   */
  static validateInstanceType(instanceType: string): InstanceType {
    if (!VALID_INSTANCE_TYPES.includes(instanceType as InstanceType)) {
      throw new ValidationError(
        `Invalid instance type '${instanceType}'. Must be one of: ${VALID_INSTANCE_TYPES.join(', ')}`,
      );
    }
    return instanceType as InstanceType;
  }

  /**
   * Validate that a string is not empty
   */
  static validateNotEmpty(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError(`${fieldName} cannot be empty`);
    }
  }

  /**
   * Validate that a value is a positive number
   */
  static validatePositiveNumber(value: number, fieldName: string): void {
    if (value < 0) {
      throw new ValidationError(`${fieldName} must be a positive number`);
    }
  }

  /**
   * Validate object type for system objects
   */
  static validateObjectType(objectType: string): void {
    Validator.validateNotEmpty(objectType, 'objectType');

    // Basic validation - could be extended with specific object type patterns
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(objectType)) {
      throw new ValidationError(
        `Invalid object type '${objectType}'. Must start with a letter and contain only letters, numbers, and underscores.`,
      );
    }
  }

  /**
   * Validate search request structure
   */
  static validateSearchRequest(searchRequest: unknown): void {
    if (!searchRequest || typeof searchRequest !== 'object') {
      throw new ValidationError('Search request must be a valid object');
    }

    const request = searchRequest as Record<string, unknown>;

    // Validate query structure if present
    if (request.query && typeof request.query === 'object') {
      const query = request.query as Record<string, unknown>;

      // Check that at least one query type is specified
      const queryTypes = ['text_query', 'term_query', 'filtered_query', 'bool_query', 'match_all_query'];
      const hasValidQuery = queryTypes.some(type => query[type]);

      if (!hasValidQuery) {
        throw new ValidationError(
          `Search query must contain at least one of: ${queryTypes.join(', ')}`,
        );
      }

      // Validate text_query structure
      if (query.text_query && typeof query.text_query === 'object') {
        const textQuery = query.text_query as Record<string, unknown>;
        if (!textQuery.fields || !Array.isArray(textQuery.fields) || textQuery.fields.length === 0) {
          throw new ValidationError('text_query.fields must be a non-empty array');
        }
        if (!textQuery.search_phrase || typeof textQuery.search_phrase !== 'string') {
          throw new ValidationError('text_query.search_phrase must be a non-empty string');
        }
      }

      // Validate term_query structure
      if (query.term_query && typeof query.term_query === 'object') {
        const termQuery = query.term_query as Record<string, unknown>;
        if (!termQuery.fields || !Array.isArray(termQuery.fields) || termQuery.fields.length === 0) {
          throw new ValidationError('term_query.fields must be a non-empty array');
        }
        if (!termQuery.operator || typeof termQuery.operator !== 'string') {
          throw new ValidationError('term_query.operator must be a non-empty string');
        }
        if (!termQuery.values || !Array.isArray(termQuery.values) || termQuery.values.length === 0) {
          throw new ValidationError('term_query.values must be a non-empty array');
        }
      }
    }

    // Validate sorts structure if present
    if (request.sorts !== undefined) {
      if (!Array.isArray(request.sorts)) {
        throw new ValidationError('sorts must be an array');
      }

      request.sorts.forEach((sort: unknown, index: number) => {
        const sortObject = sort as Record<string, unknown>;
        if (!sortObject.field || typeof sortObject.field !== 'string') {
          throw new ValidationError(`sorts[${index}].field must be a non-empty string`);
        }
        if (sortObject.sort_order && (sortObject.sort_order !== 'asc' && sortObject.sort_order !== 'desc')) {
          throw new ValidationError(`sorts[${index}].sort_order must be either 'asc' or 'desc'`);
        }
      });
    }

    // Validate pagination parameters
    if (typeof request.start === 'number') {
      Validator.validatePositiveNumber(request.start, 'start');
    }
    if (typeof request.count === 'number') {
      Validator.validatePositiveNumber(request.count, 'count');
    }
  }
}
