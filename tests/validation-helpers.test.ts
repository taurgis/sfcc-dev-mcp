import { ValidationHelpers, ValidationRule, CommonValidations } from '../src/core/handlers/validation-helpers.js';
import { HandlerError } from '../src/core/handlers/base-handler.js';

describe('ValidationHelpers', () => {
  describe('validateArguments', () => {
    it('should pass when all required fields are present and valid', () => {
      const args = {
        stringField: 'value1',
        numberField: 42,
        booleanField: true,
        objectField: { prop: 'value' },
      };

      const rules: ValidationRule[] = [
        { field: 'stringField', required: true, type: 'string' },
        { field: 'numberField', required: true, type: 'number' },
        { field: 'booleanField', required: true, type: 'boolean' },
        { field: 'objectField', required: true, type: 'object' },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should throw HandlerError when required field is missing', () => {
      const args = {
        field1: 'value1',
      };

      const rules: ValidationRule[] = [
        { field: 'field1', required: true, type: 'string' },
        { field: 'field2', required: true, type: 'string' },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow(HandlerError);

      try {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      } catch (error) {
        expect(error).toBeInstanceOf(HandlerError);
        expect((error as HandlerError).message).toBe('field2 is required');
        expect((error as HandlerError).toolName).toBe('test_tool');
        expect((error as HandlerError).code).toBe('MISSING_ARGUMENT');
      }
    });

    it('should throw when required field is null', () => {
      const args = {
        field1: 'value1',
        field2: null,
      };

      const rules: ValidationRule[] = [
        { field: 'field1', required: true, type: 'string' },
        { field: 'field2', required: true, type: 'string' },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow('field2 is required');
    });

    it('should throw when required field is empty string', () => {
      const args = {
        field1: 'value1',
        field2: '',
      };

      const rules: ValidationRule[] = [
        { field: 'field1', required: true, type: 'string' },
        { field: 'field2', required: true, type: 'string' },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow('field2 is required');
    });

    it('should throw when field type is incorrect', () => {
      const args = {
        stringField: 123, // Should be string
      };

      const rules: ValidationRule[] = [
        { field: 'stringField', required: true, type: 'string' },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow(HandlerError);

      try {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      } catch (error) {
        expect(error).toBeInstanceOf(HandlerError);
        expect((error as HandlerError).message).toBe('stringField must be of type string');
        expect((error as HandlerError).code).toBe('INVALID_TYPE');
      }
    });

    it('should pass when optional field is missing', () => {
      const args = {
        required: 'value',
      };

      const rules: ValidationRule[] = [
        { field: 'required', required: true, type: 'string' },
        { field: 'optional', required: false, type: 'string' },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should validate custom validator function', () => {
      const args = {
        email: 'invalid-email',
      };

      const rules: ValidationRule[] = [
        {
          field: 'email',
          required: true,
          type: 'string',
          validator: (value: string) => value.includes('@'),
          errorMessage: 'email must be a valid email address',
        },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow('email must be a valid email address');
    });

    it('should pass custom validator when valid', () => {
      const args = {
        email: 'test@example.com',
      };

      const rules: ValidationRule[] = [
        {
          field: 'email',
          required: true,
          type: 'string',
          validator: (value: string) => value.includes('@'),
          errorMessage: 'email must be a valid email address',
        },
      ];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });
  });

  describe('requireStrings', () => {
    it('should pass when all required string fields are present', () => {
      const args = {
        field1: 'value1',
        field2: 'value2',
      };

      expect(() => {
        ValidationHelpers.requireStrings(args, ['field1', 'field2'], 'test_tool');
      }).not.toThrow();
    });

    it('should throw when required string field is missing', () => {
      const args = {
        field1: 'value1',
      };

      expect(() => {
        ValidationHelpers.requireStrings(args, ['field1', 'field2'], 'test_tool');
      }).toThrow('field2 is required for test_tool');
    });

    it('should pass when no fields are required', () => {
      const args = { field1: 'value1' };

      expect(() => {
        ValidationHelpers.requireStrings(args, [], 'test_tool');
      }).not.toThrow();
    });
  });

  describe('type validation', () => {
    it('should validate string type correctly', () => {
      const args = { field: 'string value' };
      const rules: ValidationRule[] = [{ field: 'field', type: 'string' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should validate number type correctly', () => {
      const args = { field: 42 };
      const rules: ValidationRule[] = [{ field: 'field', type: 'number' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should validate boolean type correctly', () => {
      const args = { field: true };
      const rules: ValidationRule[] = [{ field: 'field', type: 'boolean' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should validate object type correctly', () => {
      const args = { field: { prop: 'value' } };
      const rules: ValidationRule[] = [{ field: 'field', type: 'object' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should validate array type correctly', () => {
      const args = { field: ['item1', 'item2'] };
      const rules: ValidationRule[] = [{ field: 'field', type: 'array' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).not.toThrow();
    });

    it('should reject array when object expected', () => {
      const args = { field: ['item1', 'item2'] };
      const rules: ValidationRule[] = [{ field: 'field', type: 'object' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow('field must be of type object');
    });

    it('should reject null when object expected', () => {
      const args = { field: null };
      const rules: ValidationRule[] = [{ field: 'field', required: true, type: 'object' }];

      expect(() => {
        ValidationHelpers.validateArguments(args, rules, 'test_tool');
      }).toThrow('field is required');
    });
  });

  describe('CommonValidations', () => {
    describe('Generic validation methods', () => {
      it('should support generic requiredString validation', () => {
        const rules = CommonValidations.requiredString('customField');
        expect(rules).toEqual([{
          field: 'customField',
          required: true,
          type: 'string',
          validator: expect.any(Function),
          errorMessage: 'customField must be a non-empty string',
        }]);
      });

      it('should support custom error messages in requiredString', () => {
        const rules = CommonValidations.requiredString('customField', 'Custom error message');
        expect(rules[0].errorMessage).toBe('Custom error message');
      });

      it('should validate with generic requiredString', () => {
        const args = { customField: 'valid-value' };
        const rules = CommonValidations.requiredString('customField');

        expect(() => {
          ValidationHelpers.validateArguments(args, rules, 'test_tool');
        }).not.toThrow();
      });

      it('should fail with empty string in requiredString', () => {
        const args = { customField: '' };
        const rules = CommonValidations.requiredString('customField');

        expect(() => {
          ValidationHelpers.validateArguments(args, rules, 'test_tool');
        }).toThrow('customField must be a non-empty string');
      });

      it('should support generic requiredField validation', () => {
        const rules = CommonValidations.requiredField(
          'myField',
          'number',
          (value: number) => value > 0,
          'myField must be positive',
        );
        expect(rules).toEqual([{
          field: 'myField',
          required: true,
          type: 'number',
          validator: expect.any(Function),
          errorMessage: 'myField must be positive',
        }]);
      });

      it('should support optionalField validation', () => {
        const rules = CommonValidations.optionalField(
          'optionalField',
          'boolean',
          (value: boolean) => typeof value === 'boolean',
          'optionalField must be boolean',
        );
        expect(rules[0].required).toBe(false);
      });

      it('should validate cartridge name with custom pattern', () => {
        const rules = CommonValidations.requiredField(
          'cartridgeName',
          'string',
          (value: string) => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value),
          'cartridgeName must be a valid identifier (letters, numbers, underscore, hyphen)',
        );

        // Test valid cartridge name
        const validArgs = { cartridgeName: 'plugin_example' };
        expect(() => {
          ValidationHelpers.validateArguments(validArgs, rules, 'test_tool');
        }).not.toThrow();

        // Test invalid cartridge name
        const invalidArgs = { cartridgeName: '123invalid' };
        expect(() => {
          ValidationHelpers.validateArguments(invalidArgs, rules, 'test_tool');
        }).toThrow('cartridgeName must be a valid identifier');
      });

      it('should validate className pattern', () => {
        const rules = CommonValidations.requiredString('className');

        // Test valid className
        const validArgs = { className: 'Product' };
        expect(() => {
          ValidationHelpers.validateArguments(validArgs, rules, 'test_tool');
        }).not.toThrow();

        // Test empty className
        const invalidArgs = { className: '' };
        expect(() => {
          ValidationHelpers.validateArguments(invalidArgs, rules, 'test_tool');
        }).toThrow('className must be a non-empty string');
      });
    });
  });
});
