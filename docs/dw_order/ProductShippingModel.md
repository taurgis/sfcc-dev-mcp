## Package: dw.order

# Class ProductShippingModel

## Inheritance Hierarchy

- Object
  - dw.order.ProductShippingModel

## Description

Instances of ProductShippingModel provide access to product-level shipping information, such as applicable or inapplicable shipping methods and shipping cost defined for the product for a specified shipping method. Use ShippingMgr.getProductShippingModel(Product) to get the shipping model for a specific product.

## Properties

### applicableShippingMethods

**Type:** Collection (Read Only)

The active applicable shipping methods for the product related
 to this shipping model, i.e. shipping methods the product can be shipped
 with. A product can be shipping with a shipping methods if the shipping
 method is not explicitely marked as inapplicable for this product.

### inapplicableShippingMethods

**Type:** Collection (Read Only)

The active inapplicable shipping methods for the product related
 to this shipping model, i.e. shipping methods the product cannot be
 shipped with. A product cannot be shipping with a shipping methods if the
 shipping method is explicitely marked as inapplicable for this product.

### shippingMethodsWithShippingCost

**Type:** Collection (Read Only)

The active shipping methods for which either any fixed-price or
 surcharge product-level shipping cost is defined for the specified product. 
 Note that this can include inapplicable shipping methods
 (see getInapplicableShippingMethods()).

## Constructor Summary

## Method Summary

### getApplicableShippingMethods

**Signature:** `getApplicableShippingMethods() : Collection`

Returns the active applicable shipping methods for the product related to this shipping model, i.e.

### getInapplicableShippingMethods

**Signature:** `getInapplicableShippingMethods() : Collection`

Returns the active inapplicable shipping methods for the product related to this shipping model, i.e.

### getShippingCost

**Signature:** `getShippingCost(shippingMethod : ShippingMethod) : ProductShippingCost`

Returns the shipping cost object for the related product and the specified shipping method, or null if no product-level fixed-price or surcharge shipping cost are defined for the specified product.

### getShippingMethodsWithShippingCost

**Signature:** `getShippingMethodsWithShippingCost() : Collection`

Returns the active shipping methods for which either any fixed-price or surcharge product-level shipping cost is defined for the specified product.

## Method Detail

## Method Details

### getApplicableShippingMethods

**Signature:** `getApplicableShippingMethods() : Collection`

**Description:** Returns the active applicable shipping methods for the product related to this shipping model, i.e. shipping methods the product can be shipped with. A product can be shipping with a shipping methods if the shipping method is not explicitely marked as inapplicable for this product.

**Returns:**

Applicable shipping methods for the product

---

### getInapplicableShippingMethods

**Signature:** `getInapplicableShippingMethods() : Collection`

**Description:** Returns the active inapplicable shipping methods for the product related to this shipping model, i.e. shipping methods the product cannot be shipped with. A product cannot be shipping with a shipping methods if the shipping method is explicitely marked as inapplicable for this product.

**Returns:**

Inapplicable shipping methods for the product

---

### getShippingCost

**Signature:** `getShippingCost(shippingMethod : ShippingMethod) : ProductShippingCost`

**Description:** Returns the shipping cost object for the related product and the specified shipping method, or null if no product-level fixed-price or surcharge shipping cost are defined for the specified product. The following rules apply: if fixed and surcharge shipping cost is defined for a product, the fixed cost takes precedence if a product is member of multiple shipping cost groups, the lowest shipping cost takes precedence

**Parameters:**

- `shippingMethod`: the shipping method to use.

**Returns:**

Product shipping cost

---

### getShippingMethodsWithShippingCost

**Signature:** `getShippingMethodsWithShippingCost() : Collection`

**Description:** Returns the active shipping methods for which either any fixed-price or surcharge product-level shipping cost is defined for the specified product. Note that this can include inapplicable shipping methods (see getInapplicableShippingMethods()).

**Returns:**

Shipping methods with shipping cost

---