/**
 * Query Builder Utility
 *
 * This module provides utilities for building query strings and handling URL parameters
 * for SFCC API requests with proper encoding and array handling.
 */

/**
 * Query parameter builder for SFCC APIs
 */
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
  addFromObject(params: Record<string, any>): QueryBuilder {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          this.addArray(key, value);
        } else {
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
  static fromObject(params: Record<string, any>): string {
    return new QueryBuilder().addFromObject(params).build();
  }
}
