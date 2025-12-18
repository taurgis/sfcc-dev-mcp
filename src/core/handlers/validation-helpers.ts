/**
 * Validation helpers for handler arguments
 */

import { HandlerError, ToolArguments } from './base-handler.js';

export interface ValidationRule<T = any> {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  validator?: (value: T) => boolean;
  errorMessage?: string;
}

export class ValidationHelpers {
  /**
   * Validate arguments against a set of rules
   */
  static validateArguments(
    args: ToolArguments,
    rules: ValidationRule[],
    toolName: string,
  ): void {
    for (const rule of rules) {
      const value = args?.[rule.field];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        throw new HandlerError(
          rule.errorMessage ?? `${rule.field} is required`,
          toolName,
          'MISSING_ARGUMENT',
          { field: rule.field, rules },
        );
      }

      // Skip type and custom validation if value is not present and not required
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Check type (including for required fields that have values)
      if (rule.type && value !== undefined && value !== null && !this.validateType(value, rule.type)) {
        throw new HandlerError(
          rule.errorMessage ?? `${rule.field} must be of type ${rule.type}`,
          toolName,
          'INVALID_TYPE',
          { field: rule.field, expectedType: rule.type, actualType: typeof value },
        );
      }

      // Custom validation
      if (rule.validator && !rule.validator(value)) {
        throw new HandlerError(
          rule.errorMessage ?? `${rule.field} validation failed`,
          toolName,
          'VALIDATION_FAILED',
          { field: rule.field, value },
        );
      }
    }
  }

  /**
   * Validate a single field with custom validator
   */
  static validateField<T>(
    args: ToolArguments,
    field: string,
    validator: (value: T) => boolean,
    errorMessage: string,
    toolName: string,
  ): void {
    const rules: ValidationRule[] = [{
      field,
      validator,
      errorMessage,
    }];
    this.validateArguments(args, rules, toolName);
  }

  private static validateType(value: any, type: ValidationRule['type']): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }
}

/**
 * Common validation rules factory
 */
export const CommonValidations = {
  /**
   * Create a required string field validation
   */
  requiredString: (field: string, customMessage?: string): ValidationRule[] => [{
    field,
    required: true,
    type: 'string',
    validator: (value: string) => value.trim().length > 0,
    errorMessage: customMessage ?? `${field} must be a non-empty string`,
  }],

  /**
   * Create a required field validation with custom validator
   */
  requiredField: (
    field: string,
    type: ValidationRule['type'],
    validator: (value: any) => boolean,
    errorMessage: string,
  ): ValidationRule[] => [{
    field,
    required: true,
    type,
    validator,
    errorMessage,
  }],

  /**
   * Create an optional field validation
   */
  optionalField: (
    field: string,
    type: ValidationRule['type'],
    validator: (value: any) => boolean,
    errorMessage: string,
  ): ValidationRule[] => [{
    field,
    required: false,
    type,
    validator,
    errorMessage,
  }],
};
