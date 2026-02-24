/**
 * Query Builder Utility
 *
 * This module provides utilities for building query strings and handling URL parameters
 * for SFCC API requests with proper encoding and array handling.
 */

/**
 * Query parameter builder for SFCC APIs
 */
type QueryParamPrimitive = string | number | boolean;
type QueryParamValue = QueryParamPrimitive | readonly (string | number)[] | undefined | null;

export class QueryBuilder {
  private params: URLSearchParams;

  constructor() {
    this.params = new URLSearchParams();
  }

  /**
   * Add a parameter to the query string
   */
  add(key: string, value: string | number | boolean): QueryBuilder {
    if (value !== undefined && value !== null) {
      this.params.append(key, value.toString());
    }
    return this;
  }

  /**
   * Add an array parameter with proper handling for different parameter types
   */
  addArray(key: string, values: (string | number)[]): QueryBuilder {
    if (!Array.isArray(values) || values.length === 0) {
      return this;
    }

    if (key === 'refine') {
      // Special handling for OCAPI refine parameters (multiple entries)
      values.forEach(value => this.params.append(key, value.toString()));
    } else {
      // Join arrays with comma for most parameters
      this.params.append(key, values.join(','));
    }

    return this;
  }

  /**
   * Add multiple parameters from an object
   */
  addFromObject<T extends object>(params: T): QueryBuilder {
    Object.entries(params as Record<string, QueryParamValue>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          this.addArray(key, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          this.add(key, value);
        }
      }
    });
    return this;
  }

  /**
   * Build the final query string
   */
  build(): string {
    return this.params.toString();
  }

  /**
   * Reset the builder
   */
  reset(): QueryBuilder {
    this.params = new URLSearchParams();
    return this;
  }

  /**
   * Static method to build query string from object
   */
  static fromObject<T extends object>(params: T): string {
    return new QueryBuilder().addFromObject(params).build();
  }
}
