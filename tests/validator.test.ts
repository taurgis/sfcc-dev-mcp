/**
 * Tests for Validator utility
 * Tests input validation functionality
 */

import { Validator, ValidationError } from '../src/utils/validator.js';

describe('Validator', () => {
  describe('ValidationError', () => {
    it('should create validation error with message', () => {
      const error = new ValidationError('Test error message');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Test error message');
    });
  });

  describe('validateRequired', () => {
    it('should pass when all required fields are present', () => {
      const params = {
        field1: 'value1',
        field2: 'value2',
        field3: 123,
      };

      expect(() => {
        Validator.validateRequired(params, ['field1', 'field2']);
      }).not.toThrow();
    });

    it('should throw error when required field is missing', () => {
      const params = {
        field1: 'value1',
      };

      expect(() => {
        Validator.validateRequired(params, ['field1', 'field2']);
      }).toThrow(ValidationError);
      expect(() => {
        Validator.validateRequired(params, ['field1', 'field2']);
      }).toThrow('Required fields are missing or empty: field2');
    });

    it('should throw error when required field is empty string', () => {
      const params = {
        field1: 'value1',
        field2: '',
      };

      expect(() => {
        Validator.validateRequired(params, ['field1', 'field2']);
      }).toThrow('Required fields are missing or empty: field2');
    });

    it('should throw error when required field is whitespace only', () => {
      const params = {
        field1: 'value1',
        field2: '   ',
      };

      expect(() => {
        Validator.validateRequired(params, ['field1', 'field2']);
      }).toThrow('Required fields are missing or empty: field2');
    });

    it('should throw error for multiple missing fields', () => {
      const params = {
        field1: 'value1',
      };

      expect(() => {
        Validator.validateRequired(params, ['field2', 'field3', 'field4']);
      }).toThrow('Required fields are missing or empty: field2, field3, field4');
    });

    it('should handle non-string values correctly', () => {
      const params = {
        number: 0,
        boolean: false,
        object: {},
        array: [],
      };

      expect(() => {
        Validator.validateRequired(params, ['number', 'boolean', 'object', 'array']);
      }).not.toThrow();
    });
  });

  describe('validateInstanceType', () => {
    it('should accept valid instance types', () => {
      expect(Validator.validateInstanceType('staging')).toBe('staging');
      expect(Validator.validateInstanceType('development')).toBe('development');
      expect(Validator.validateInstanceType('sandbox')).toBe('sandbox');
      expect(Validator.validateInstanceType('production')).toBe('production');
    });

    it('should throw error for invalid instance type', () => {
      expect(() => {
        Validator.validateInstanceType('invalid');
      }).toThrow(ValidationError);
      expect(() => {
        Validator.validateInstanceType('invalid');
      }).toThrow('Invalid instance type \'invalid\'. Must be one of: staging, development, sandbox, production');
    });

    it('should throw error for empty string', () => {
      expect(() => {
        Validator.validateInstanceType('');
      }).toThrow('Invalid instance type \'\'. Must be one of: staging, development, sandbox, production');
    });

    it('should throw error for case-sensitive mismatch', () => {
      expect(() => {
        Validator.validateInstanceType('STAGING');
      }).toThrow('Invalid instance type \'STAGING\'. Must be one of: staging, development, sandbox, production');
    });
  });

  describe('validateNotEmpty', () => {
    it('should pass for non-empty string', () => {
      expect(() => {
        Validator.validateNotEmpty('valid value', 'testField');
      }).not.toThrow();
    });

    it('should throw error for empty string', () => {
      expect(() => {
        Validator.validateNotEmpty('', 'testField');
      }).toThrow(ValidationError);
      expect(() => {
        Validator.validateNotEmpty('', 'testField');
      }).toThrow('testField cannot be empty');
    });

    it('should throw error for whitespace-only string', () => {
      expect(() => {
        Validator.validateNotEmpty('   ', 'testField');
      }).toThrow('testField cannot be empty');
    });
  });

  describe('validatePositiveNumber', () => {
    it('should pass for positive numbers', () => {
      expect(() => {
        Validator.validatePositiveNumber(1, 'testField');
        Validator.validatePositiveNumber(100, 'testField');
        Validator.validatePositiveNumber(0.5, 'testField');
      }).not.toThrow();
    });

    it('should pass for zero', () => {
      expect(() => {
        Validator.validatePositiveNumber(0, 'testField');
      }).not.toThrow();
    });

    it('should throw error for negative numbers', () => {
      expect(() => {
        Validator.validatePositiveNumber(-1, 'testField');
      }).toThrow(ValidationError);
      expect(() => {
        Validator.validatePositiveNumber(-1, 'testField');
      }).toThrow('testField must be a positive number');
    });
  });

  describe('validateObjectType', () => {
    it('should pass for valid object types', () => {
      expect(() => {
        Validator.validateObjectType('Product');
        Validator.validateObjectType('Customer');
        Validator.validateObjectType('SitePreferences');
        Validator.validateObjectType('Custom_Object');
        Validator.validateObjectType('MyObject123');
      }).not.toThrow();
    });

    it('should throw error for empty object type', () => {
      expect(() => {
        Validator.validateObjectType('');
      }).toThrow('objectType cannot be empty');
    });

    it('should throw error for object type starting with number', () => {
      expect(() => {
        Validator.validateObjectType('123Object');
      }).toThrow('Invalid object type \'123Object\'. Must start with a letter and contain only letters, numbers, and underscores.');
    });

    it('should throw error for object type with special characters', () => {
      expect(() => {
        Validator.validateObjectType('Product-Type');
      }).toThrow('Invalid object type \'Product-Type\'. Must start with a letter and contain only letters, numbers, and underscores.');
    });

    it('should throw error for object type with spaces', () => {
      expect(() => {
        Validator.validateObjectType('Product Type');
      }).toThrow('Invalid object type \'Product Type\'. Must start with a letter and contain only letters, numbers, and underscores.');
    });
  });

  describe('validateSearchRequest', () => {
    it('should pass for valid search request with text_query', () => {
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name'],
            search_phrase: 'test',
          },
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).not.toThrow();
    });

    it('should pass for valid search request with term_query', () => {
      const searchRequest = {
        query: {
          term_query: {
            fields: ['value_type'],
            operator: 'is',
            values: ['string'],
          },
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).not.toThrow();
    });

    it('should pass for valid search request with match_all_query', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).not.toThrow();
    });

    it('should pass for search request with sorts', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        sorts: [
          { field: 'id', sort_order: 'asc' },
          { field: 'display_name' },
        ],
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).not.toThrow();
    });

    it('should pass for search request with pagination', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        start: 0,
        count: 25,
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).not.toThrow();
    });

    it('should throw error for non-object search request', () => {
      expect(() => {
        Validator.validateSearchRequest('invalid');
      }).toThrow('Search request must be a valid object');
    });

    it('should throw error for null search request', () => {
      expect(() => {
        Validator.validateSearchRequest(null);
      }).toThrow('Search request must be a valid object');
    });

    it('should throw error for search request with no valid query types', () => {
      const searchRequest = {
        query: {
          invalid_query: {},
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('Search query must contain at least one of: text_query, term_query, filtered_query, bool_query, match_all_query');
    });

    it('should throw error for text_query with empty fields', () => {
      const searchRequest = {
        query: {
          text_query: {
            fields: [],
            search_phrase: 'test',
          },
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('text_query.fields must be a non-empty array');
    });

    it('should throw error for text_query with missing search_phrase', () => {
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id'],
          },
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('text_query.search_phrase must be a non-empty string');
    });

    it('should throw error for term_query with invalid structure', () => {
      const searchRequest = {
        query: {
          term_query: {
            fields: [],
            operator: 'is',
            values: ['test'],
          },
        },
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('term_query.fields must be a non-empty array');
    });

    it('should throw error for invalid sorts structure', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        sorts: 'invalid',
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('sorts must be an array');
    });

    it('should throw error for sort with missing field', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        sorts: [
          { sort_order: 'asc' },
        ],
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('sorts[0].field must be a non-empty string');
    });

    it('should throw error for sort with invalid sort_order', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        sorts: [
          { field: 'id', sort_order: 'invalid' },
        ],
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('sorts[0].sort_order must be either \'asc\' or \'desc\'');
    });

    it('should throw error for negative start value', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        start: -1,
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('start must be a positive number');
    });

    it('should throw error for negative count value', () => {
      const searchRequest = {
        query: {
          match_all_query: {},
        },
        count: -5,
      };

      expect(() => {
        Validator.validateSearchRequest(searchRequest);
      }).toThrow('count must be a positive number');
    });
  });
});
