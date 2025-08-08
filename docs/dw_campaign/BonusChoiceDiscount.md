## Package: dw.campaign

# Class BonusChoiceDiscount

## Inheritance Hierarchy

- Object
  - dw.campaign.Discount
  - dw.campaign.BonusChoiceDiscount

## Description

Represents a choice of bonus products discount in the discount plan, for example "Choose 3 DVDs from a list of 20 options with your purchase of any DVD player."

## Properties

### bonusProducts

**Type:** List (Read Only)

Get the list of bonus products which the customer is allowed to choose
 from for this discount. This list is configured by a merchant entering a
 list of SKUs for the discount. Products which do not exist in the system,
 or are offline, or are not assigned to a category in the site catalog are
 filtered out. Unavailable (i.e. out-of-stock) products are NOT filtered
 out. This allows merchants to display out-of-stock bonus products with
 appropriate messaging.
 
 If a returned product is a master product, the customer is entitled to
 choose from any variant. If the product is an option product, the
 customer is entitled to choose any value for each option. Since the
 promotions engine does not touch the value of the product option line
 items, it is the responsibility of custom code to set option prices.
 
 If the promotion is rule based, then this method will return an empty list.
 A ProductSearchModel should be used to return the bonus products the
 customer may choose from instead. See
 ProductSearchModel.PROMOTION_PRODUCT_TYPE_BONUS and
 ProductSearchModel.setPromotionID(String)

### maxBonusItems

**Type:** Number (Read Only)

The maximum number of bonus items that a customer is entitled to
 select for this discount.

### ruleBased

**Type:** ProductSearchModel (Static) (Read Only)

Returns true if this is a "rule based" bonus choice discount.
 For such discounts, there is no static list of bonus products
 associated with the discount but rather a discounted product
 rule associated with the promotion which defines the bonus
 products. To retrieve the list of selectable bonus products for
 display in the storefront, it is necessary to search for the
 bonus products using the ProductSearchModel
 API since the method getBonusProducts() in this class
 will always return an empty list. Furthermore, for rule based
 bonus-choice discounts, getBonusProductPrice(Product)
 will always return a price of 0.00 for bonus products.

## Constructor Summary

## Method Summary

### getBonusProductPrice

**Signature:** `getBonusProductPrice(product : Product) : Number`

Get the effective price for the passed bonus product.

### getBonusProducts

**Signature:** `getBonusProducts() : List`

Get the list of bonus products which the customer is allowed to choose from for this discount.

### getMaxBonusItems

**Signature:** `getMaxBonusItems() : Number`

Returns the maximum number of bonus items that a customer is entitled to select for this discount.

### isRuleBased

**Signature:** `isRuleBased() : boolean`

Returns true if this is a "rule based" bonus choice discount.

## Method Detail

## Method Details

### getBonusProductPrice

**Signature:** `getBonusProductPrice(product : Product) : Number`

**Description:** Get the effective price for the passed bonus product. This is expected to be one of the products returned by getBonusProducts() with one exception: If a master product is configured as a bonus product, this implies that a customer may choose from any of its variants. In this case, it is allowed to pass in a variant to this method and a price will be returned. If the passed product is not a valid bonus product, this method throws an exception.

**Parameters:**

- `product`: The bonus product to retrieve a price for, must not be null.

**Returns:**

The price of the passed bonus product as a Number.

---

### getBonusProducts

**Signature:** `getBonusProducts() : List`

**Description:** Get the list of bonus products which the customer is allowed to choose from for this discount. This list is configured by a merchant entering a list of SKUs for the discount. Products which do not exist in the system, or are offline, or are not assigned to a category in the site catalog are filtered out. Unavailable (i.e. out-of-stock) products are NOT filtered out. This allows merchants to display out-of-stock bonus products with appropriate messaging. If a returned product is a master product, the customer is entitled to choose from any variant. If the product is an option product, the customer is entitled to choose any value for each option. Since the promotions engine does not touch the value of the product option line items, it is the responsibility of custom code to set option prices. If the promotion is rule based, then this method will return an empty list. A ProductSearchModel should be used to return the bonus products the customer may choose from instead. See ProductSearchModel.PROMOTION_PRODUCT_TYPE_BONUS and ProductSearchModel.setPromotionID(String)

**Returns:**

An ordered list of bonus products that the customer may choose from for this discount.

---

### getMaxBonusItems

**Signature:** `getMaxBonusItems() : Number`

**Description:** Returns the maximum number of bonus items that a customer is entitled to select for this discount.

**Returns:**

The maximum number of bonus items that this discount permits a customer to select.

---

### isRuleBased

**Signature:** `isRuleBased() : boolean`

**Description:** Returns true if this is a "rule based" bonus choice discount. For such discounts, there is no static list of bonus products associated with the discount but rather a discounted product rule associated with the promotion which defines the bonus products. To retrieve the list of selectable bonus products for display in the storefront, it is necessary to search for the bonus products using the ProductSearchModel API since the method getBonusProducts() in this class will always return an empty list. Furthermore, for rule based bonus-choice discounts, getBonusProductPrice(Product) will always return a price of 0.00 for bonus products.

**Returns:**

True if this is a rule-based bonus-choice discount, or false if this discount defines a simple static list of bonus products.

---