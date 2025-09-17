import { ReferencedTypesExtractor } from '../src/clients/docs/referenced-types-extractor.js';

describe('ReferencedTypesExtractor', () => {
  describe('extractReferencedTypes', () => {
    it('should extract types from property definitions', () => {
      const content = `
# Class Product

## Properties

### price
**Type:** Money

The price of the product.

### category
**Type:** Category

The product category.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('Money');
      expect(result).toContain('Category');
      expect(result).toHaveLength(2);
    });

    it('should extract return types from method signatures', () => {
      const content = `
# Class Product

## Methods

### getPrice(): Money
Returns the product price.

### getCategory(): Category
Returns the product category.

### getName(): String
Returns the product name.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('Money');
      expect(result).toContain('Category');
      expect(result).toContain('String');
      expect(result).toHaveLength(3);
    });

    it('should extract parameter types from method signatures', () => {
      const content = `
# Class Product

## Methods

### setPrice(price: Money): void
Sets the product price.

### addToCategory(category: Category, primary: Boolean): void
Adds product to category.

### updateInventory(record: InventoryRecord, quantity: Number): Boolean
Updates inventory record.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('Money');
      expect(result).toContain('Category');
      expect(result).toContain('Boolean');
      expect(result).toContain('InventoryRecord');
      expect(result).toContain('Number');
      expect(result).toHaveLength(5);
    });

    it('should extract types with dots (fully qualified names)', () => {
      const content = `
# Class Product

## Properties

### site
**Type:** dw.system.Site

The site this product belongs to.

## Methods

### getCustomer(): dw.customer.Customer
Returns the customer.

### processOrder(order: dw.order.Order): dw.system.Status
Processes an order.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('dw.system.Site');
      expect(result).toContain('dw.customer.Customer');
      expect(result).toContain('dw.order.Order');
      expect(result).toContain('dw.system.Status');
      expect(result).toHaveLength(4);
    });

    it('should handle complex method signatures with multiple parameters', () => {
      const content = `
# Class OrderProcessor

## Methods

### processPayment(order: Order, payment: PaymentInstrument, amount: Money): PaymentStatus
Processes payment for an order.

### createShipment(order: Order, items: Collection, address: OrderAddress): Shipment
Creates a shipment.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('Order');
      expect(result).toContain('PaymentInstrument');
      expect(result).toContain('Money');
      expect(result).toContain('PaymentStatus');
      expect(result).toContain('Collection');
      expect(result).toContain('OrderAddress');
      expect(result).toContain('Shipment');
      expect(result).toHaveLength(7);
    });

    it('should ignore primitive types and lowercase types', () => {
      const content = `
# Class Product

## Properties

### name
**Type:** string

Product name.

### active
**Type:** boolean

Whether product is active.

### count
**Type:** number

Product count.

### data
**Type:** object

Product data.

## Methods

### isValid(): boolean
Returns validity.

### process(data: object, flag: boolean): string
Processes data.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      // Should not include primitive types (string, boolean, number, object)
      expect(result).not.toContain('string');
      expect(result).not.toContain('boolean');
      expect(result).not.toContain('number');
      expect(result).not.toContain('object');
      expect(result).toHaveLength(0);
    });

    it('should handle mixed case and special formatting', () => {
      const content = `
# Class ProductManager

## Properties

### defaultCategory
**Type:**   Category

Default category with extra spaces.

### primarySite
**Type:**dw.system.Site

Site without space after colon.

## Methods

### getCollection():  Collection
Returns collection with extra spaces.

### updateStatus( status: ProductStatus ): Boolean
Method with spaced parameters.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('Category');
      expect(result).toContain('dw.system.Site');
      expect(result).toContain('Collection');
      expect(result).toContain('ProductStatus');
      expect(result).toContain('Boolean');
      expect(result).toHaveLength(5);
    });

    it('should handle empty content', () => {
      const result = ReferencedTypesExtractor.extractReferencedTypes('');
      expect(result).toEqual([]);
    });

    it('should handle content with no type references', () => {
      const content = `
# Class Product

This is a product class without any type references.

It has some text but no property types or method signatures.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);
      expect(result).toEqual([]);
    });

    it('should handle malformed content gracefully', () => {
      const content = `
# Class Product

**Type:** 

### method():
Returns something.

### invalid(: Missing): 
Malformed signature.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);
      // The regex will match "Missing" from the parameter, which starts with uppercase
      expect(result).toContain('Missing');
      expect(result).toHaveLength(1);
    });

    it('should deduplicate repeated type references', () => {
      const content = `
# Class Product

## Properties

### price
**Type:** Money

### discountPrice  
**Type:** Money

## Methods

### getPrice(): Money
Returns price.

### setPrice(amount: Money): void
Sets price.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      expect(result).toContain('Money');
      expect(result.filter(type => type === 'Money')).toHaveLength(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('isSFCCType', () => {
    it('should identify uppercase types as SFCC types', () => {
      // Access private method through any for testing
      const isSFCCType = (ReferencedTypesExtractor as any).isSFCCType;

      expect(isSFCCType('Product')).toBe(true);
      expect(isSFCCType('Money')).toBe(true);
      expect(isSFCCType('Category')).toBe(true);
      expect(isSFCCType('Boolean')).toBe(true);
      expect(isSFCCType('String')).toBe(true);
      expect(isSFCCType('Number')).toBe(true);
    });

    it('should identify dotted types as SFCC types', () => {
      const isSFCCType = (ReferencedTypesExtractor as any).isSFCCType;

      expect(isSFCCType('dw.catalog.Product')).toBe(true);
      expect(isSFCCType('dw.system.Site')).toBe(true);
      expect(isSFCCType('dw.customer.Customer')).toBe(true);
      expect(isSFCCType('dw.order.Order')).toBe(true);
    });

    it('should reject lowercase primitive types', () => {
      const isSFCCType = (ReferencedTypesExtractor as any).isSFCCType;

      expect(isSFCCType('string')).toBe(false);
      expect(isSFCCType('boolean')).toBe(false);
      expect(isSFCCType('number')).toBe(false);
      expect(isSFCCType('object')).toBe(false);
      expect(isSFCCType('function')).toBe(false);
      expect(isSFCCType('undefined')).toBe(false);
      expect(isSFCCType('null')).toBe(false);
    });

    it('should reject types starting with lowercase', () => {
      const isSFCCType = (ReferencedTypesExtractor as any).isSFCCType;

      expect(isSFCCType('productType')).toBe(false);
      expect(isSFCCType('categoryId')).toBe(false);
      expect(isSFCCType('data')).toBe(false);
      expect(isSFCCType('value')).toBe(false);
    });

    it('should handle edge cases', () => {
      const isSFCCType = (ReferencedTypesExtractor as any).isSFCCType;

      expect(isSFCCType('')).toBe(false);
      expect(isSFCCType('A')).toBe(true);
      expect(isSFCCType('a')).toBe(false);
      expect(isSFCCType('1Product')).toBe(false); // starts with number
      expect(isSFCCType('_Product')).toBe(false); // starts with underscore
    });
  });

  describe('filterCircularReferences', () => {
    it('should filter out exact class name matches', () => {
      const referencedTypes = ['Product', 'Category', 'Money', 'Product'];
      const currentClassName = 'Product';

      const result = ReferencedTypesExtractor.filterCircularReferences(
        referencedTypes,
        currentClassName,
      );

      expect(result).toContain('Category');
      expect(result).toContain('Money');
      expect(result).not.toContain('Product');
      expect(result).toHaveLength(2);
    });

    it('should filter out fully qualified class name matches', () => {
      const referencedTypes = [
        'dw.catalog.Product',
        'dw.system.Site',
        'Category',
        'Money',
      ];
      const currentClassName = 'Product';

      const result = ReferencedTypesExtractor.filterCircularReferences(
        referencedTypes,
        currentClassName,
      );

      expect(result).toContain('dw.system.Site');
      expect(result).toContain('Category');
      expect(result).toContain('Money');
      expect(result).not.toContain('dw.catalog.Product');
      expect(result).toHaveLength(3);
    });

    it('should preserve types that do not create circular references', () => {
      const referencedTypes = [
        'Category',
        'Money',
        'ProductVariant', // Different from Product
        'dw.system.Site',
        'Boolean',
      ];
      const currentClassName = 'Product';

      const result = ReferencedTypesExtractor.filterCircularReferences(
        referencedTypes,
        currentClassName,
      );

      expect(result).toEqual([
        'Category',
        'Money',
        'ProductVariant',
        'dw.system.Site',
        'Boolean',
      ]);
      expect(result).toHaveLength(5);
    });

    it('should handle empty input arrays', () => {
      const result = ReferencedTypesExtractor.filterCircularReferences([], 'Product');
      expect(result).toEqual([]);
    });

    it('should handle case where all types are circular references', () => {
      const referencedTypes = [
        'Product',
        'dw.catalog.Product',
        'some.namespace.Product',
      ];
      const currentClassName = 'Product';

      const result = ReferencedTypesExtractor.filterCircularReferences(
        referencedTypes,
        currentClassName,
      );

      expect(result).toEqual([]);
    });

    it('should be case sensitive', () => {
      const referencedTypes = ['product', 'PRODUCT', 'Product'];
      const currentClassName = 'Product';

      const result = ReferencedTypesExtractor.filterCircularReferences(
        referencedTypes,
        currentClassName,
      );

      expect(result).toContain('product');
      expect(result).toContain('PRODUCT');
      expect(result).not.toContain('Product');
      expect(result).toHaveLength(2);
    });

    it('should handle complex namespace scenarios', () => {
      const referencedTypes = [
        'dw.catalog.Category',
        'dw.order.OrderItem', // Different class
        'com.custom.Product', // Different namespace but same class
        'Product', // Exact match
      ];
      const currentClassName = 'Product';

      const result = ReferencedTypesExtractor.filterCircularReferences(
        referencedTypes,
        currentClassName,
      );

      expect(result).toContain('dw.catalog.Category');
      expect(result).toContain('dw.order.OrderItem');
      expect(result).not.toContain('com.custom.Product'); // Should be filtered
      expect(result).not.toContain('Product'); // Should be filtered
      expect(result).toHaveLength(2);
    });
  });

  describe('extractFilteredReferencedTypes', () => {
    it('should extract and filter types in one operation', () => {
      const content = `
# Class Product

## Properties

### price
**Type:** Money

### category
**Type:** Category

### relatedProduct
**Type:** Product

## Methods

### getPrice(): Money
Returns price.

### getRelatedProduct(): Product
Returns related product.

### createProduct(name: String): Product
Creates a new product.
      `;

      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        content,
        'Product',
      );

      expect(result).toContain('Money');
      expect(result).toContain('Category');
      expect(result).toContain('String');
      expect(result).not.toContain('Product'); // Should be filtered out
      expect(result).toHaveLength(3);
    });

    it('should handle complex scenarios with multiple filtering needs', () => {
      const content = `
# Class OrderProcessor

## Properties

### defaultOrder
**Type:** dw.order.Order

### processor
**Type:** OrderProcessor

## Methods

### processOrder(order: dw.order.Order): OrderProcessor
Processes an order.

### createProcessor(): OrderProcessor
Creates processor instance.

### validatePayment(payment: PaymentInstrument): Boolean
Validates payment.
      `;

      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        content,
        'OrderProcessor',
      );

      expect(result).toContain('dw.order.Order');
      expect(result).toContain('PaymentInstrument');
      expect(result).toContain('Boolean');
      expect(result).not.toContain('OrderProcessor'); // Should be filtered out
      expect(result).toHaveLength(3);
    });

    it('should work with empty content', () => {
      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        '',
        'Product',
      );
      expect(result).toEqual([]);
    });

    it('should work when no types need filtering', () => {
      const content = `
# Class Product

## Properties

### price
**Type:** Money

### category
**Type:** Category

## Methods

### getInventory(): InventoryRecord
Returns inventory.
      `;

      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        content,
        'Product',
      );

      expect(result).toContain('Money');
      expect(result).toContain('Category');
      expect(result).toContain('InventoryRecord');
      expect(result).toHaveLength(3);
    });

    it('should work when all types need filtering', () => {
      const content = `
# Class Product

## Properties

### self
**Type:** Product

## Methods

### getSelf(): Product
Returns self.

### createProduct(): dw.catalog.Product
Creates product.
      `;

      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        content,
        'Product',
      );

      expect(result).toEqual([]);
    });
  });

  describe('integration tests', () => {
    it('should handle realistic SFCC class documentation', () => {
      const content = `
# Class dw.catalog.Product

The Product class represents a product in the catalog.

## Properties

### ID
**Type:** String

The product ID.

### name
**Type:** String  

The product name.

### primaryCategory
**Type:** Category

The primary category for this product.

### priceModel
**Type:** ProductPriceModel

The price model for this product.

### availabilityModel
**Type:** ProductAvailabilityModel

The availability model for this product.

## Methods

### getID(): String
Returns the product ID.

### getName(): String
Returns the product name.

### getPrimaryCategory(): Category
Returns the primary category.

### getPriceModel(): ProductPriceModel
Returns the price model.

### getAvailabilityModel(): ProductAvailabilityModel  
Returns the availability model.

### setName(name: String): void
Sets the product name.

### assignToCategory(category: Category, primary: Boolean): void
Assigns the product to a category.

### getVariationModel(): ProductVariationModel
Returns the variation model.

### isVariant(): Boolean
Returns true if this is a variant product.

### getMasterProduct(): Product
Returns the master product if this is a variant.

### getVariants(): Collection
Returns all variants of this master product.
      `;

      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        content,
        'Product',
      );

      expect(result).toContain('String');
      expect(result).toContain('Category');
      expect(result).toContain('ProductPriceModel');
      expect(result).toContain('ProductAvailabilityModel');
      expect(result).toContain('Boolean');
      expect(result).toContain('ProductVariationModel');
      expect(result).toContain('Collection');
      expect(result).not.toContain('Product'); // Should be filtered out
      expect(result).toHaveLength(7);
    });

    it('should handle documentation with inheritance information', () => {
      const content = `
# Class ProductVariant extends Product

A product variant inherits from Product.

## Properties

### masterProduct
**Type:** Product

The master product.

### variationAttributes
**Type:** Map

The variation attributes.

## Methods

### getMasterProduct(): Product
Returns the master product.

### getVariationValue(attribute: ProductAttribute): ProductAttributeValue
Returns variation value.

### isOnline(): Boolean
Checks if variant is online.
      `;

      const result = ReferencedTypesExtractor.extractFilteredReferencedTypes(
        content,
        'ProductVariant',
      );

      expect(result).toContain('Map');
      expect(result).toContain('ProductAttribute');
      expect(result).toContain('ProductAttributeValue');
      expect(result).toContain('Boolean');
      expect(result).toContain('Product'); // Will be included since it's extracted from content
      expect(result).not.toContain('ProductVariant'); // Should be filtered as self-reference
      expect(result).toHaveLength(5);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle null input gracefully', () => {
      expect(() => {
        ReferencedTypesExtractor.extractReferencedTypes(null as any);
      }).toThrow();
    });

    it('should handle undefined input gracefully', () => {
      expect(() => {
        ReferencedTypesExtractor.extractReferencedTypes(undefined as any);
      }).toThrow();
    });

    it('should handle very large content efficiently', () => {
      const largeContent = `
# Class Product

## Properties

### prop1
**Type:** Type1

`.repeat(1000);

      const result = ReferencedTypesExtractor.extractReferencedTypes(largeContent);
      expect(result).toContain('Type1');
      expect(result).toHaveLength(1);
    });

    it('should handle content with special characters', () => {
      const content = `
# Class Product

## Properties

### price€
**Type:** Money€

European price.

### nameÜnicode
**Type:** String

Unicode name.

## Methods

### getPrice€(): Money€
Returns European price.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);

      // The current regex pattern [A-Za-z0-9.] doesn't include Unicode characters
      // So Money€ will be extracted as just "Money"
      expect(result).toContain('Money'); // Money€ gets truncated to Money
      expect(result).toContain('String');
      expect(result).toHaveLength(2);
    });

    it('should handle malformed markdown gracefully', () => {
      const content = `
# Class Product

**Type:** Category
This is not a proper property definition.

### method(: Money
Malformed method signature.

**Type:**
Empty type.

### valid
**Type:** ValidType

This should work.
      `;

      const result = ReferencedTypesExtractor.extractReferencedTypes(content);
      // The extractor will find:
      // - "Category" from "**Type:** Category" (matches property pattern)
      // - "Money" from "method(: Money" (matches return type pattern)
      // - "ValidType" from the proper property definition
      expect(result).toContain('Category');
      expect(result).toContain('Money');
      expect(result).toContain('ValidType');
      expect(result).toHaveLength(3);
    });
  });
});
