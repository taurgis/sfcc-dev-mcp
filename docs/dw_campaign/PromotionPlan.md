## Package: dw.campaign

# Class PromotionPlan

## Inheritance Hierarchy

- Object
  - dw.campaign.PromotionPlan

## Description

PromotionPlan represents a set of Promotion instances and is used to display active or upcoming promotions on storefront pages, or to pass it to the PromotionMgr to calculate a DiscountPlan and subsequently apply discounts to a line item container. Instances of the class are returned by the PromotionMgr.getActivePromotions(), PromotionMgr.getActiveCustomerPromotions() and PromotionMgr.getUpcomingPromotions(Number). PromotionPlan provides methods to access the promotions in the plan and to remove promotions from the plan. All methods which return a collection of promotions sort them by the following ordered criteria: Exclusivity: GLOBAL exclusive promotions first, followed by CLASS exclusive promotions, and NO exclusive promotions last. Rank: sorted ascending Promotion Class: PRODUCT promotions first, followed by ORDER promotions, and SHIPPING promotions last. Discount type: Fixed price promotions first, followed by free, amount-off, percentage-off, and bonus product promotions last. Best discount: Sorted descending. For example, 30% off comes before 20% off. ID: alphanumeric ascending.

## Constants

### SORT_BY_EXCLUSIVITY

**Type:** Number = 1

Constant indicating that a collection of promotions should be sorted first by exclusivity, then rank, promotion class, etc. See class-level javadoc for details. This is the default sort order for methods that return a collection of promotions.

### SORT_BY_START_DATE

**Type:** Number = 2

Constant indicating that a collection of promotions should be sorted by start date ascending. If there is no explicit start date for a promotion the start date of its containing Campaign or AB-test is used instead. Promotions without a start date are sorted before promotions with a start date in the future and after promotions with a start date in the past. In case two promotion assignments have the same start date, they are sorted by their ID.

## Properties

### orderPromotions

**Type:** Collection (Read Only)

All order promotions contained in this plan.

### productPromotions

**Type:** Collection (Read Only)

All product promotions contained in this plan.

### promotions

**Type:** Collection (Read Only)

All promotions contained in this plan sorted by exclusivity.

### shippingPromotions

**Type:** Collection (Read Only)

All shipping promotions contained in this plan.

## Constructor Summary

## Method Summary

### getOrderPromotions

**Signature:** `getOrderPromotions() : Collection`

Returns all order promotions contained in this plan.

### getPaymentCardPromotions

**Signature:** `getPaymentCardPromotions(paymentCard : PaymentCard) : Collection`

Returns the order promotions explicitly associated to the specified discounted payment card.

### getPaymentMethodPromotions

**Signature:** `getPaymentMethodPromotions(paymentMethod : PaymentMethod) : Collection`

Returns the order promotions explicitly associated to the specified discounted payment method.

### getProductPromotions

**Signature:** `getProductPromotions() : Collection`

Returns all product promotions contained in this plan.

### getProductPromotions

**Signature:** `getProductPromotions(product : Product) : Collection`

Returns the promotions related to the specified product.

### getProductPromotionsForDiscountedProduct

**Signature:** `getProductPromotionsForDiscountedProduct(product : Product) : Collection`

Returns the product promotions for which the specified product is a discounted (and possibly also a qualifying) product.

### getProductPromotionsForQualifyingProduct

**Signature:** `getProductPromotionsForQualifyingProduct(product : Product) : Collection`

Returns the product promotions for which the specified product is a qualifying but NOT a discounted product.

### getPromotions

**Signature:** `getPromotions() : Collection`

Returns all promotions contained in this plan sorted by exclusivity.

### getPromotions

**Signature:** `getPromotions(sortOrder : Number) : Collection`

Returns all promotions contained in this plan sorted according to the specified sort order.

### getPromotions

**Signature:** `getPromotions(product : Product) : Collection`

Returns the promotions related to the specified product.

### getShippingPromotions

**Signature:** `getShippingPromotions() : Collection`

Returns all shipping promotions contained in this plan.

### getShippingPromotions

**Signature:** `getShippingPromotions(shippingMethod : ShippingMethod) : Collection`

Returns the shipping promotions related to the specified discounted shipping method, i.e.

### removePromotion

**Signature:** `removePromotion(promotion : Promotion) : void`

Remove promotion from promotion plan.

## Method Detail

## Method Details

### getOrderPromotions

**Signature:** `getOrderPromotions() : Collection`

**Description:** Returns all order promotions contained in this plan.

**Returns:**

The sorted collection of order promotions contained in the promotion plan.

---

### getPaymentCardPromotions

**Signature:** `getPaymentCardPromotions(paymentCard : PaymentCard) : Collection`

**Description:** Returns the order promotions explicitly associated to the specified discounted payment card. This method is usually used to display order promotions along with payment card choices.

**Parameters:**

- `paymentCard`: Discounted payment card

**Returns:**

The sorted collection of order promotions associated with the specified payment card.

---

### getPaymentMethodPromotions

**Signature:** `getPaymentMethodPromotions(paymentMethod : PaymentMethod) : Collection`

**Description:** Returns the order promotions explicitly associated to the specified discounted payment method. This method is usually used to display order promotions along with payment method choices.

**Parameters:**

- `paymentMethod`: Discounted payment method

**Returns:**

The sorted collection of order promotions associated with the specified payment method.

---

### getProductPromotions

**Signature:** `getProductPromotions() : Collection`

**Description:** Returns all product promotions contained in this plan.

**Returns:**

The sorted collection of product promotions contained in the promotion plan.

---

### getProductPromotions

**Signature:** `getProductPromotions(product : Product) : Collection`

**Description:** Returns the promotions related to the specified product. The method returns all promotions where the product is either a qualifying product, or a discounted product, or both. It also returns promotions where the specified product is a bonus product. This method is usually used to display product promotions on a product details page. If a master product is passed, then this method will return promotions which are relevant for the master itself or at least one of its variants.

**Parameters:**

- `product`: Product associated with promotion

**Returns:**

The sorted collection of promotions related to specified discounted product.

---

### getProductPromotionsForDiscountedProduct

**Signature:** `getProductPromotionsForDiscountedProduct(product : Product) : Collection`

**Description:** Returns the product promotions for which the specified product is a discounted (and possibly also a qualifying) product. It also returns promotions where the specified product is a bonus product. This method is usually used to display product promotions on a product details page when separate callout messages are defined depending on if the product is a qualifying or discounted product for the promotion. If a master product is passed, then this method will return promotions for which the master product itself or at least one of its product's variants is a discounted product.

**Parameters:**

- `product`: The discounted product.

**Returns:**

Product promotions related to the specified discounted product.

---

### getProductPromotionsForQualifyingProduct

**Signature:** `getProductPromotionsForQualifyingProduct(product : Product) : Collection`

**Description:** Returns the product promotions for which the specified product is a qualifying but NOT a discounted product. This method is usually used to display product promotions on a product details page when separate callout messages are defined depending on if the product is a qualifying or discounted product for the promotion. If a master product is passed, then this method will return promotions for which the master product itself or at least one of its product's variants is a qualifying product.

**Parameters:**

- `product`: The qualifying product.

**Returns:**

Product promotions related to the specified qualifying product.

---

### getPromotions

**Signature:** `getPromotions() : Collection`

**Description:** Returns all promotions contained in this plan sorted by exclusivity.

**Returns:**

The sorted collection of promotions contained in the promotion plan.

---

### getPromotions

**Signature:** `getPromotions(sortOrder : Number) : Collection`

**Description:** Returns all promotions contained in this plan sorted according to the specified sort order. If the passed sort order is invalid, then the returned promotions will be sorted by exclusivity.

**Parameters:**

- `sortOrder`: the sort order to use. Must be SORT_BY_EXCLUSIVITY or SORT_BY_START_DATE. If an invalid value is passed, SORT_BY_EXCLUSIVITY is used.

**Returns:**

The sorted collection of promotions contained in the promotion plan.

---

### getPromotions

**Signature:** `getPromotions(product : Product) : Collection`

**Description:** Returns the promotions related to the specified product. The method returns all promotions where the product is either a qualifying product, or a discounted product, or both. It also returns promotions where the specified product is a bonus product. This method is usually used to display product promotions on a product details page.

**Deprecated:**

Use getProductPromotions(Product)

**Parameters:**

- `product`: Product associated with promotion

**Returns:**

The sorted collection of promotions related to the specified discounted product.

---

### getShippingPromotions

**Signature:** `getShippingPromotions() : Collection`

**Description:** Returns all shipping promotions contained in this plan.

**Returns:**

The sorted collection of shipping promotions contained in promotion plan.

---

### getShippingPromotions

**Signature:** `getShippingPromotions(shippingMethod : ShippingMethod) : Collection`

**Description:** Returns the shipping promotions related to the specified discounted shipping method, i.e. the returned promotions apply a discount on the specified shipping method. This method is usually used to display shipping promotions along with shipping methods.

**Parameters:**

- `shippingMethod`: Discounted shipping method

**Returns:**

The sorted collection of shipping promotions with specified method as discounted method.

---

### removePromotion

**Signature:** `removePromotion(promotion : Promotion) : void`

**Description:** Remove promotion from promotion plan. Please note that this is the only way to remove promotions from the plan, i.e. removing promotions from the collections returned by methods such as getProductPromotions() has no effect on the promotion plan.

**Parameters:**

- `promotion`: Promotion to remove from promotion plan

---