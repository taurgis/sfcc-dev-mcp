/**
 * Tests for QueryBuilder utility
 * Tests URL parameter construction and array handling
 */

import { QueryBuilder } from '../src/utils/query-builder.js';

describe('QueryBuilder', () => {
  let builder: QueryBuilder;

  beforeEach(() => {
    builder = new QueryBuilder();
  });

  describe('constructor', () => {
    it('should initialize with empty parameters', () => {
      expect(builder).toBeInstanceOf(QueryBuilder);
    });
  });

  describe('add method', () => {
    it('should add string parameter', () => {
      const result = builder.add('key', 'value').build();
      expect(result).toBe('key=value');
    });

    it('should add number parameter', () => {
      const result = builder.add('count', 10).build();
      expect(result).toBe('count=10');
    });

    it('should add boolean parameter', () => {
      const result = builder.add('active', true).build();
      expect(result).toBe('active=true');
    });

    it('should skip undefined values', () => {
      const result = builder.add('key', undefined as any).build();
      expect(result).toBe('');
    });

    it('should skip null values', () => {
      const result = builder.add('key', null as any).build();
      expect(result).toBe('');
    });

    it('should chain multiple adds', () => {
      const result = builder
        .add('first', 'value1')
        .add('second', 'value2')
        .build();
      expect(result).toBe('first=value1&second=value2');
    });
  });

  describe('addArray method', () => {
    it('should handle regular arrays with comma separation', () => {
      const result = builder.addArray('ids', ['1', '2', '3']).build();
      expect(result).toBe('ids=1%2C2%2C3');
    });

    it('should handle refine parameters with multiple entries', () => {
      const result = builder.addArray('refine', ['category=shirts', 'color=blue']).build();
      expect(result).toBe('refine=category%3Dshirts&refine=color%3Dblue');
    });

    it('should handle mixed string and number arrays', () => {
      const result = builder.addArray('values', ['string', 123]).build();
      expect(result).toBe('values=string%2C123');
    });

    it('should skip empty arrays', () => {
      const result = builder.addArray('empty', []).build();
      expect(result).toBe('');
    });

    it('should skip non-arrays', () => {
      const result = builder.addArray('invalid', null as any).build();
      expect(result).toBe('');
    });

    it('should chain with other methods', () => {
      const result = builder
        .add('single', 'value')
        .addArray('multiple', ['a', 'b'])
        .build();
      expect(result).toBe('single=value&multiple=a%2Cb');
    });
  });

  describe('addFromObject method', () => {
    it('should add simple object properties', () => {
      const params = {
        name: 'test',
        count: 5,
        active: true,
      };
      const result = builder.addFromObject(params).build();
      expect(result).toBe('name=test&count=5&active=true');
    });

    it('should handle arrays in object', () => {
      const params = {
        ids: ['1', '2'],
        expand: ['details', 'variations'],
      };
      const result = builder.addFromObject(params).build();
      expect(result).toBe('ids=1%2C2&expand=details%2Cvariations');
    });

    it('should handle refine arrays specially', () => {
      const params = {
        q: 'shirt',
        refine: ['category=clothing', 'size=large'],
      };
      const result = builder.addFromObject(params).build();
      expect(result).toBe('q=shirt&refine=category%3Dclothing&refine=size%3Dlarge');
    });

    it('should skip undefined and null values', () => {
      const params = {
        defined: 'value',
        undefined,
        null: null,
        empty: '',
        zero: 0,
      };
      const result = builder.addFromObject(params).build();
      expect(result).toBe('defined=value&empty=&zero=0');
    });

    it('should handle complex object with mixed types', () => {
      const params = {
        q: 'search term',
        count: 20,
        start: 0,
        expand: ['images', 'prices'],
        refine: ['brand=nike', 'color=red'],
        active: true,
        skip: undefined,
      };
      const result = builder.addFromObject(params).build();
      expect(result).toBe(
        'q=search+term&count=20&start=0&expand=images%2Cprices&refine=brand%3Dnike&refine=color%3Dred&active=true',
      );
    });

    it('should chain with other methods', () => {
      const result = builder
        .add('manual', 'value')
        .addFromObject({ auto: 'generated' })
        .add('final', 'last')
        .build();
      expect(result).toBe('manual=value&auto=generated&final=last');
    });
  });

  describe('build method', () => {
    it('should return empty string for no parameters', () => {
      const result = builder.build();
      expect(result).toBe('');
    });

    it('should properly encode special characters', () => {
      const result = builder.add('special', 'value with spaces & symbols!').build();
      expect(result).toBe('special=value+with+spaces+%26+symbols%21');
    });

    it('should handle multiple calls to build', () => {
      builder.add('key', 'value');
      const first = builder.build();
      const second = builder.build();
      expect(first).toBe(second);
      expect(first).toBe('key=value');
    });
  });

  describe('reset method', () => {
    it('should clear all parameters', () => {
      const result = builder
        .add('first', 'value')
        .add('second', 'value')
        .reset()
        .build();
      expect(result).toBe('');
    });

    it('should return QueryBuilder instance for chaining', () => {
      const result = builder.reset();
      expect(result).toBeInstanceOf(QueryBuilder);
      expect(result).toBe(builder);
    });

    it('should allow rebuilding after reset', () => {
      const result = builder
        .add('old', 'value')
        .reset()
        .add('new', 'value')
        .build();
      expect(result).toBe('new=value');
    });
  });

  describe('static fromObject method', () => {
    it('should create query string from object', () => {
      const params = {
        search: 'test',
        count: 10,
        active: true,
      };
      const result = QueryBuilder.fromObject(params);
      expect(result).toBe('search=test&count=10&active=true');
    });

    it('should handle arrays correctly', () => {
      const params = {
        ids: ['1', '2', '3'],
        refine: ['category=shirts', 'size=large'],
      };
      const result = QueryBuilder.fromObject(params);
      expect(result).toBe('ids=1%2C2%2C3&refine=category%3Dshirts&refine=size%3Dlarge');
    });

    it('should handle empty object', () => {
      const result = QueryBuilder.fromObject({});
      expect(result).toBe('');
    });

    it('should handle complex OCAPI-style parameters', () => {
      const params = {
        q: 'mens shoes',
        count: 25,
        start: 50,
        expand: ['images', 'variations', 'prices'],
        refine: ['category=footwear', 'brand=nike', 'size=10'],
        sort: 'price-asc',
        currency: 'USD',
        locale: 'en_US',
      };
      const result = QueryBuilder.fromObject(params);

      expect(result).toContain('q=mens+shoes');
      expect(result).toContain('count=25');
      expect(result).toContain('start=50');
      expect(result).toContain('expand=images%2Cvariations%2Cprices');
      expect(result).toContain('refine=category%3Dfootwear');
      expect(result).toContain('refine=brand%3Dnike');
      expect(result).toContain('refine=size%3D10');
      expect(result).toContain('sort=price-asc');
      expect(result).toContain('currency=USD');
      expect(result).toContain('locale=en_US');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const result = builder.add('empty', '').build();
      expect(result).toBe('empty=');
    });

    it('should handle zero values', () => {
      const result = builder.add('zero', 0).build();
      expect(result).toBe('zero=0');
    });

    it('should handle false values', () => {
      const result = builder.add('false', false).build();
      expect(result).toBe('false=false');
    });

    it('should handle arrays with empty strings', () => {
      const result = builder.addArray('mixed', ['value', '', 'another']).build();
      expect(result).toBe('mixed=value%2C%2Canother');
    });

    it('should handle Unicode characters', () => {
      const result = builder.add('unicode', 'café ñoño 中文').build();
      expect(result).toBe('unicode=caf%C3%A9+%C3%B1o%C3%B1o+%E4%B8%AD%E6%96%87');
    });
  });
});
