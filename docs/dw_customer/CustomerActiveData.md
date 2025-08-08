## Package: dw.customer

# Class CustomerActiveData

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.object.ActiveData
      - dw.customer.CustomerActiveData

## Description

Represents the active data for a Customer in Commerce Cloud Digital. Note: this class allows access to sensitive personal and private information. Pay attention to appropriate legal and regulatory requirements when developing.

## Properties

### avgOrderValue

**Type:** Number (Read Only)

The average order value of the customer, or null
 if none has been set or the value is no longer valid.

### discountValueWithCoupon

**Type:** Number (Read Only)

The discount value resulting from coupons, that has been applied
 to orders of the customer, or null if none has been set or
 the value is no longer valid.

### discountValueWithoutCoupon

**Type:** Number (Read Only)

The discount value resulting from promotions other than coupons,
 that has been applied to orders of the customer, or null
 if none has been set or the value is no longer valid.

### giftOrders

**Type:** Number (Read Only)

The number of orders for the Customer that contained at least
 one product unit marked as a gift, or null if none has been
 set or the value is no longer valid.

### giftUnits

**Type:** Number (Read Only)

The number of product units in orders for the customer
 that were marked as a gift, or null if none has been set
 or the value is no longer valid.

### lastOrderDate

**Type:** Date (Read Only)

The date of the last order for the customer, or null
 if there are no orders for the customer.

### orders

**Type:** Number (Read Only)

The orders of the customer, or null if none
 has been set or the value is no longer valid.

### orderValue

**Type:** Number (Read Only)

The lifetime order value of the customer, or null
 if none has been set or the value is no longer valid.

### orderValueMonth

**Type:** Number (Read Only)

The order value of the customer, over the most recent 30 days,
 or null if none has been set or the value is no longer valid.

### productMastersOrdered

**Type:** String (Read Only)

An array containing the master product SKUs of variation products
 in orders for the customer, or an empty collection if no SKUs have been
 set or the collection of SKUs is no longer valid. There is no specific
 limit on the number of SKUs that will be returned in the collection, but
 there is also no guarantee that it will contain the SKUs for all products
 ordered by the customer.

### productsAbandonedMonth

**Type:** String (Read Only)

An array containing the SKUs of products in baskets abandoned
 by the customer in the last 30 days, or an empty collection if no SKUs
 have been set or the collection is no longer valid.  There is no specific
 limit on the number of SKUs that will be returned in the collection, but
 there is also no guarantee that it will contain the SKUs for all products
 in baskets abandoned by the customer.

### productsOrdered

**Type:** String (Read Only)

An array containing the SKUs of products in orders
 for the customer, or an empty collection if no SKUs have been set or the
 collection of SKUs is no longer valid.  There is no specific limit on the
 number of SKUs that will be returned in the collection, but there is also
 no guarantee that it will contain the SKUs for all products ordered by
 the customer.

### productsViewedMonth

**Type:** String (Read Only)

An array containing the SKUs of products viewed by the
 customer in the last 30 days, or an empty collection if no SKUs have been
 set or the collection is no longer valid.  There is no specific limit on
 the number of SKUs that will be returned in the collection, but there is
 also no guarantee that it will contain the SKUs for all products viewed
 by the customer.

### returns

**Type:** Number (Read Only)

The number of returns of the customer, or null
 if none has been set or the value is no longer valid.

### returnValue

**Type:** Number (Read Only)

The returned revenue of the customer, or null
 if none has been set or the value is no longer valid.

### sourceCodeOrders

**Type:** Number (Read Only)

The number of orders for the customer where a source code was
 in effect, or null if none has been set or the value
 is no longer valid.

### topCategoriesOrdered

**Type:** String (Read Only)

An array containing the IDs of up to the top 20 categories for
 customer orders, or an empty list if no categories have been set or the
 list of categories is no longer valid. The top category is the one for
 which the most orders for the customer contained at least one product
 found in that category.

### visitsMonth

**Type:** Number (Read Only)

The visits of the customer, over the most recent 30 days,
 or null if none has been set or the value
 is no longer valid.

### visitsWeek

**Type:** Number (Read Only)

The visits of the customer, over the most recent 7 days,
 or null if none has been set or the value
 is no longer valid.

### visitsYear

**Type:** Number (Read Only)

The visits of the customer, over the most recent 365 days,
 or null if none has been set or the value
 is no longer valid.

## Constructor Summary

## Method Summary

### getAvgOrderValue

**Signature:** `getAvgOrderValue() : Number`

Returns the average order value of the customer, or null if none has been set or the value is no longer valid.

### getDiscountValueWithCoupon

**Signature:** `getDiscountValueWithCoupon() : Number`

Returns the discount value resulting from coupons, that has been applied to orders of the customer, or null if none has been set or the value is no longer valid.

### getDiscountValueWithoutCoupon

**Signature:** `getDiscountValueWithoutCoupon() : Number`

Returns the discount value resulting from promotions other than coupons, that has been applied to orders of the customer, or null if none has been set or the value is no longer valid.

### getGiftOrders

**Signature:** `getGiftOrders() : Number`

Returns the number of orders for the Customer that contained at least one product unit marked as a gift, or null if none has been set or the value is no longer valid.

### getGiftUnits

**Signature:** `getGiftUnits() : Number`

Returns the number of product units in orders for the customer that were marked as a gift, or null if none has been set or the value is no longer valid.

### getLastOrderDate

**Signature:** `getLastOrderDate() : Date`

Returns the date of the last order for the customer, or null if there are no orders for the customer.

### getOrders

**Signature:** `getOrders() : Number`

Returns the orders of the customer, or null if none has been set or the value is no longer valid.

### getOrderValue

**Signature:** `getOrderValue() : Number`

Returns the lifetime order value of the customer, or null if none has been set or the value is no longer valid.

### getOrderValueMonth

**Signature:** `getOrderValueMonth() : Number`

Returns the order value of the customer, over the most recent 30 days, or null if none has been set or the value is no longer valid.

### getProductMastersOrdered

**Signature:** `getProductMastersOrdered() : String[]`

Returns an array containing the master product SKUs of variation products in orders for the customer, or an empty collection if no SKUs have been set or the collection of SKUs is no longer valid.

### getProductsAbandonedMonth

**Signature:** `getProductsAbandonedMonth() : String[]`

Returns an array containing the SKUs of products in baskets abandoned by the customer in the last 30 days, or an empty collection if no SKUs have been set or the collection is no longer valid.

### getProductsOrdered

**Signature:** `getProductsOrdered() : String[]`

Returns an array containing the SKUs of products in orders for the customer, or an empty collection if no SKUs have been set or the collection of SKUs is no longer valid.

### getProductsViewedMonth

**Signature:** `getProductsViewedMonth() : String[]`

Returns an array containing the SKUs of products viewed by the customer in the last 30 days, or an empty collection if no SKUs have been set or the collection is no longer valid.

### getReturns

**Signature:** `getReturns() : Number`

Returns the number of returns of the customer, or null if none has been set or the value is no longer valid.

### getReturnValue

**Signature:** `getReturnValue() : Number`

Returns the returned revenue of the customer, or null if none has been set or the value is no longer valid.

### getSourceCodeOrders

**Signature:** `getSourceCodeOrders() : Number`

Returns the number of orders for the customer where a source code was in effect, or null if none has been set or the value is no longer valid.

### getTopCategoriesOrdered

**Signature:** `getTopCategoriesOrdered() : String[]`

Returns an array containing the IDs of up to the top 20 categories for customer orders, or an empty list if no categories have been set or the list of categories is no longer valid.

### getVisitsMonth

**Signature:** `getVisitsMonth() : Number`

Returns the visits of the customer, over the most recent 30 days, or null if none has been set or the value is no longer valid.

### getVisitsWeek

**Signature:** `getVisitsWeek() : Number`

Returns the visits of the customer, over the most recent 7 days, or null if none has been set or the value is no longer valid.

### getVisitsYear

**Signature:** `getVisitsYear() : Number`

Returns the visits of the customer, over the most recent 365 days, or null if none has been set or the value is no longer valid.

## Method Detail

## Method Details

### getAvgOrderValue

**Signature:** `getAvgOrderValue() : Number`

**Description:** Returns the average order value of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the average order size.

---

### getDiscountValueWithCoupon

**Signature:** `getDiscountValueWithCoupon() : Number`

**Description:** Returns the discount value resulting from coupons, that has been applied to orders of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the discount value resulting from coupons.

---

### getDiscountValueWithoutCoupon

**Signature:** `getDiscountValueWithoutCoupon() : Number`

**Description:** Returns the discount value resulting from promotions other than coupons, that has been applied to orders of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the discount value resulting from promotions other than coupons.

---

### getGiftOrders

**Signature:** `getGiftOrders() : Number`

**Description:** Returns the number of orders for the Customer that contained at least one product unit marked as a gift, or null if none has been set or the value is no longer valid.

**Returns:**

the number of gift orders.

---

### getGiftUnits

**Signature:** `getGiftUnits() : Number`

**Description:** Returns the number of product units in orders for the customer that were marked as a gift, or null if none has been set or the value is no longer valid.

**Returns:**

the number of gift product units.

---

### getLastOrderDate

**Signature:** `getLastOrderDate() : Date`

**Description:** Returns the date of the last order for the customer, or null if there are no orders for the customer.

**Returns:**

the date of the last order for the customer.

---

### getOrders

**Signature:** `getOrders() : Number`

**Description:** Returns the orders of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the orders.

---

### getOrderValue

**Signature:** `getOrderValue() : Number`

**Description:** Returns the lifetime order value of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the lifetime value.

---

### getOrderValueMonth

**Signature:** `getOrderValueMonth() : Number`

**Description:** Returns the order value of the customer, over the most recent 30 days, or null if none has been set or the value is no longer valid.

**Returns:**

the value over the last 30 days.

---

### getProductMastersOrdered

**Signature:** `getProductMastersOrdered() : String[]`

**Description:** Returns an array containing the master product SKUs of variation products in orders for the customer, or an empty collection if no SKUs have been set or the collection of SKUs is no longer valid. There is no specific limit on the number of SKUs that will be returned in the collection, but there is also no guarantee that it will contain the SKUs for all products ordered by the customer.

**Returns:**

a collection containing the master product SKUs of variation products that were ordered.

---

### getProductsAbandonedMonth

**Signature:** `getProductsAbandonedMonth() : String[]`

**Description:** Returns an array containing the SKUs of products in baskets abandoned by the customer in the last 30 days, or an empty collection if no SKUs have been set or the collection is no longer valid. There is no specific limit on the number of SKUs that will be returned in the collection, but there is also no guarantee that it will contain the SKUs for all products in baskets abandoned by the customer.

**Returns:**

a collection containing the SKUs of products that were abandoned.

---

### getProductsOrdered

**Signature:** `getProductsOrdered() : String[]`

**Description:** Returns an array containing the SKUs of products in orders for the customer, or an empty collection if no SKUs have been set or the collection of SKUs is no longer valid. There is no specific limit on the number of SKUs that will be returned in the collection, but there is also no guarantee that it will contain the SKUs for all products ordered by the customer.

**Returns:**

a collection containing the SKUs of products that were ordered.

---

### getProductsViewedMonth

**Signature:** `getProductsViewedMonth() : String[]`

**Description:** Returns an array containing the SKUs of products viewed by the customer in the last 30 days, or an empty collection if no SKUs have been set or the collection is no longer valid. There is no specific limit on the number of SKUs that will be returned in the collection, but there is also no guarantee that it will contain the SKUs for all products viewed by the customer.

**Returns:**

a collection containing the SKUs of products that were ordered.

---

### getReturns

**Signature:** `getReturns() : Number`

**Description:** Returns the number of returns of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the returns.

---

### getReturnValue

**Signature:** `getReturnValue() : Number`

**Description:** Returns the returned revenue of the customer, or null if none has been set or the value is no longer valid.

**Returns:**

the returned revenue.

---

### getSourceCodeOrders

**Signature:** `getSourceCodeOrders() : Number`

**Description:** Returns the number of orders for the customer where a source code was in effect, or null if none has been set or the value is no longer valid.

**Returns:**

the number of orders with source codes in effect.

---

### getTopCategoriesOrdered

**Signature:** `getTopCategoriesOrdered() : String[]`

**Description:** Returns an array containing the IDs of up to the top 20 categories for customer orders, or an empty list if no categories have been set or the list of categories is no longer valid. The top category is the one for which the most orders for the customer contained at least one product found in that category.

**Returns:**

a list containing the top 20 categories.

---

### getVisitsMonth

**Signature:** `getVisitsMonth() : Number`

**Description:** Returns the visits of the customer, over the most recent 30 days, or null if none has been set or the value is no longer valid.

**Returns:**

the visits over the last 30 days.

---

### getVisitsWeek

**Signature:** `getVisitsWeek() : Number`

**Description:** Returns the visits of the customer, over the most recent 7 days, or null if none has been set or the value is no longer valid.

**Returns:**

the visits over the last 7 days.

---

### getVisitsYear

**Signature:** `getVisitsYear() : Number`

**Description:** Returns the visits of the customer, over the most recent 365 days, or null if none has been set or the value is no longer valid.

**Returns:**

the visits over the last 365 days.

---