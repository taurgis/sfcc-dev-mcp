import { ValidationError } from '../utils/validator.js';

interface SchemaObject {
  type?: string;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  items?: SchemaObject;
  enum?: unknown[];
  additionalProperties?: boolean;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

interface ValidationIssue {
  path: string;
  message: string;
}

interface ToolSchemaDefinition {
  name: string;
  inputSchema: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toSchemaObject(schema: unknown): SchemaObject {
  if (!isRecord(schema)) {
    return { type: 'object', properties: {} };
  }

  return schema as SchemaObject;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return isRecord(value);
}

export class ToolArgumentValidationError extends ValidationError {
  constructor(toolName: string, issues: ValidationIssue[]) {
    const issueSummary = issues
      .slice(0, 3)
      .map(issue => {
        const readablePath = issue.path.replace(/^\$\./, '').replace(/^\$$/, 'arguments');
        return `${readablePath} ${issue.message}`;
      })
      .join('; ');
    const suffix = issues.length > 3 ? ` (+${issues.length - 3} more)` : '';
    super(
      `Invalid arguments for tool "${toolName}"${issueSummary ? ` - ${issueSummary}${suffix}` : ''}`,
      'INVALID_TOOL_ARGUMENTS',
      { toolName, issues },
    );
    this.name = 'ToolArgumentValidationError';
  }
}

export class ToolArgumentValidator {
  private readonly toolSchemas: Map<string, SchemaObject>;

  constructor(definitions: ToolSchemaDefinition[]) {
    this.toolSchemas = new Map(
      definitions.map(definition => [definition.name, toSchemaObject(definition.inputSchema)]),
    );
  }

  validate(toolName: string, args: unknown): void {
    const schema = this.toolSchemas.get(toolName);
    if (!schema) {
      return;
    }

    const normalizedArgs = args ?? {};
    const issues = this.validateNode(normalizedArgs, schema, '$');
    if (issues.length > 0) {
      throw new ToolArgumentValidationError(toolName, issues);
    }
  }

  private validateNode(
    value: unknown,
    schema: SchemaObject,
    path: string,
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const declaredType = schema.type;

    if (declaredType === 'string') {
      if (typeof value !== 'string' || value.trim().length === 0) {
        issues.push({ path, message: 'must be a non-empty string' });
      } else {
        this.validateEnum(value, schema, path, issues);
        this.validateStringConstraints(value, schema, path, issues);
      }
      return issues;
    }

    if (declaredType === 'number' || declaredType === 'integer') {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        issues.push({ path, message: 'must be a number' });
      } else {
        if (declaredType === 'integer' && !Number.isInteger(value)) {
          issues.push({ path, message: 'must be an integer' });
          return issues;
        }

        this.validateEnum(value, schema, path, issues);
        this.validateNumberConstraints(value, schema, path, issues);
      }
      return issues;
    }

    if (declaredType === 'boolean') {
      if (typeof value !== 'boolean') {
        issues.push({ path, message: 'must be a boolean' });
      } else {
        this.validateEnum(value, schema, path, issues);
      }
      return issues;
    }

    if (declaredType === 'array') {
      if (!Array.isArray(value)) {
        issues.push({ path, message: 'must be an array' });
        return issues;
      }

      this.validateEnum(value, schema, path, issues);

      if (schema.items) {
        value.forEach((item, index) => {
          issues.push(...this.validateNode(item, schema.items as SchemaObject, `${path}[${index}]`));
        });
      }

      return issues;
    }

    const isObjectSchema = declaredType === 'object' || (declaredType === undefined && schema.properties !== undefined);
    if (!isObjectSchema) {
      return issues;
    }

    if (!isPlainObject(value)) {
      issues.push({ path, message: 'must be an object' });
      return issues;
    }

    this.validateEnum(value, schema, path, issues);

    const properties = schema.properties ?? {};
    const required = schema.required ?? [];
    const strictObjectKeys = schema.additionalProperties === false ||
      (path === '$' && schema.additionalProperties !== true);

    for (const requiredKey of required) {
      if (!(requiredKey in value)) {
        const requiredSchema = properties[requiredKey];
        const message = requiredSchema?.type === 'string'
          ? 'must be a non-empty string'
          : 'is required';
        issues.push({ path: `${path}.${requiredKey}`, message });
      }
    }

    if (strictObjectKeys) {
      const unknownKeys = Object.keys(value).filter(key => !(key in properties));
      for (const key of unknownKeys) {
        issues.push({ path: `${path}.${key}`, message: 'is not allowed' });
      }
    }

    for (const [key, childSchema] of Object.entries(properties)) {
      if (!(key in value)) {
        continue;
      }

      const childValue = value[key];
      issues.push(...this.validateNode(childValue, childSchema, `${path}.${key}`));

    }

    return issues;
  }

  private validateEnum(
    value: unknown,
    schema: SchemaObject,
    path: string,
    issues: ValidationIssue[],
  ): void {
    if (!schema.enum || schema.enum.length === 0) {
      return;
    }

    const isAllowed = schema.enum.some(enumValue => Object.is(enumValue, value));
    if (!isAllowed) {
      const allowedValues = schema.enum.map(enumValue => JSON.stringify(enumValue)).join(', ');
      issues.push({ path, message: `must be one of: ${allowedValues}` });
    }
  }

  private validateNumberConstraints(
    value: number,
    schema: SchemaObject,
    path: string,
    issues: ValidationIssue[],
  ): void {
    if (typeof schema.minimum === 'number' && value < schema.minimum) {
      issues.push({ path, message: `must be >= ${schema.minimum}` });
    }

    if (typeof schema.maximum === 'number' && value > schema.maximum) {
      issues.push({ path, message: `must be <= ${schema.maximum}` });
    }
  }

  private validateStringConstraints(
    value: string,
    schema: SchemaObject,
    path: string,
    issues: ValidationIssue[],
  ): void {
    if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
      issues.push({ path, message: `must be at least ${schema.minLength} characters` });
    }

    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
      issues.push({ path, message: `must be at most ${schema.maxLength} characters` });
    }

    if (schema.pattern) {
      try {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
          issues.push({ path, message: `must match pattern: ${schema.pattern}` });
        }
      } catch {
        // Ignore invalid schema regex at runtime to avoid blocking tool execution.
      }
    }
  }
}
