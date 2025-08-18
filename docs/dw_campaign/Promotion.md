## Package: dw.campaign

# Class Promotion

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.campaign.Promotion

## Description

This class represents a promotion in Commerce Cloud Digital. Examples of promotions include: "Get 20% off your order" "$15 off a given product" "free shipping for all orders over $50" Get a bonus product with purchase of another product The Promotion class provides access to the basic attributes of the promotion such as name, callout message, and description, but the details of the promotion rules are not available in the API due to their complexity. Commerce Cloud Digital allows merchants to create a single logical "promotion rule" (e.g. "Get 20% off your order") and then assign it to one or more "containers" where the supported container types are campaigns or AB-tests. A Promotion represents a specific instance of a promotion rule assigned to a container. Promotion rules themselves that are not assigned to any container are inaccessible through the API. Each instance (i.e. assignment) can have separate "qualifiers". Qualifiers are the customer groups, source code groups, or coupons that trigger a given promotion for a customer.

## Constants

### EXCLUSIVITY_CLASS

**Type:** String = "CLASS"

Constant representing promotion exclusivity of type class.

### EXCLUSIVITY_GLOBAL

**Type:** String = "GLOBAL"

Constant representing promotion exclusivity of type global.

### EXCLUSIVITY_NO

**Type:** String = "NO"

Constant representing promotion exclusivity of type no.

### PROMOTION_CLASS_ORDER

**Type:** String = "ORDER"

Constant representing promotion class of type order.

### PROMOTION_CLASS_PRODUCT

**Type:** String = "PRODUCT"

Constant representing promotion class of type product.

### PROMOTION_CLASS_SHIPPING

**Type:** String = "SHIPPING"

Constant representing promotion class of type shipping.

### QUALIFIER_MATCH_MODE_ALL

**Type:** String = "all"

Constant indicating that that all qualifier conditions must be met in order for this promotion to apply for a given customer.

### QUALIFIER_MATCH_MODE_ANY

**Type:** String = "any"

Constant indicating that that at least one qualifier condition must be met in order for this promotion to apply for a given customer.

## Properties

### active

**Type:** boolean (Read Only)

Returns 'true' if promotion is active, otherwise 'false'. 
 A promotion is active if its campaign is active, and the promotion
 is enabled, and it is scheduled for now.

### basedOnCoupon

**Type:** boolean (Read Only)

Returns 'true' if the promotion is triggered by a coupon,
 false otherwise.

### basedOnCoupons

**Type:** boolean (Read Only)

Returns 'true' if the promotion is triggered by coupons,
 false otherwise.

### basedOnCustomerGroups

**Type:** boolean (Read Only)

Returns 'true' if the promotion is triggered by customer groups,
 false otherwise.

### basedOnSourceCodes

**Type:** boolean (Read Only)

Returns 'true' if the promotion is triggered by source codes,
 false otherwise.

### calloutMsg

**Type:** MarkupText (Read Only)

The callout message of the promotion.

### campaign

**Type:** Campaign (Read Only)

The campaign this particular instance of the promotion is defined
 in.
 
 Note: If this promotion is defined as part of an AB-test, then a Campaign
 object will be returned, but it is a mock implementation, and not a true
 Campaign. This behavior is required for backwards compatibility and
 should not be relied upon as it may change in future releases.

### combinablePromotions

**Type:** String (Read Only)

The promotion's combinable promotions. Combinable promotions is a set of promotions or groups this
 promotion can be combined with.

### conditionalDescription

**Type:** MarkupText (Read Only)

A description of the condition that must be met for this
 promotion to be applicable.
 
 The method and the related attribute have been deprecated. Use the
 getDetails() method instead.

### coupons

**Type:** Collection (Read Only)

The coupons directly assigned to the promotion or assigned to the campaign of the promotion. 
 If the promotion is not based on coupons (see isBasedOnCoupons()), or no coupons is assigned to the
 promotion or its campaign, an empty collection is returned.

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes for this extensible object.

### customerGroups

**Type:** Collection (Read Only)

The customer groups directly assigned to the promotion or assigned to the campaign of the promotion. 
 If the promotion is not based on customer groups (see isBasedOnCustomerGroups()), or no customer group is assigned to the
 promotion or its campaign, an empty collection is returned.

### description

**Type:** MarkupText (Read Only)

The description of the promotion.
 
 Method is deprecated and returns the same value as getCalloutMsg().

### details

**Type:** MarkupText (Read Only)

The detailed description of the promotion.

### enabled

**Type:** boolean (Read Only)

Returns true if promotion is enabled, otherwise false.

### endDate

**Type:** Date (Read Only)

The effective end date of this instance of the promotion. If no
 explicit end date is defined for the promotion, the end date of the
 containing Campaign or AB-test is returned.

### exclusivity

**Type:** String (Read Only)

The promotion's exclusivity specifying how the promotion can be
 combined with other promotions.
 Possible values are EXCLUSIVITY_NO, EXCLUSIVITY_CLASS
 and EXCLUSIVITY_GLOBAL.

### ID

**Type:** String (Read Only)

The unique ID of the promotion.

### image

**Type:** MediaFile (Read Only)

The reference to the promotion image.

### lastModified

**Type:** Date (Read Only)

The date that this object was last modified.

### mutuallyExclusivePromotions

**Type:** String (Read Only)

The promotion's mutually exclusive Promotions. Mutually exclusive Promotions is a set of promotions or
 groups this promotion cannot be combined with.

### name

**Type:** String (Read Only)

The name of the promotion.

### promotionClass

**Type:** String (Read Only)

The promotion class indicating the general type of the promotion.
 Possible values are PROMOTION_CLASS_PRODUCT,
 PROMOTION_CLASS_ORDER, and PROMOTION_CLASS_SHIPPING.

### qualifierMatchMode

**Type:** String (Read Only)

The qualifier matching mode specified by this promotion. A
 promotion may have up to 3 qualifier conditions based on whether it is
 customer-group based, coupon based, and/or source-code based. A promotion
 may require for example that a customer belong to a certain customer
 group and also have a certain coupon in the cart in order for the
 promotion to apply. This method returns QUALIFIER_MATCH_MODE_ALL if it is
 necessary that all the qualifier conditions are satisfied in order for
 this promotion to apply for a given customer. Otherwise, this method
 returns QUALIFIER_MATCH_MODE_ANY indicating that at least of the
 qualifier conditions must be satisfied.
 
 Note: currently QUALIFIER_MATCH_MODE_ALL is only supported for promotions
 assigned to campaigns, and not those assigned to AB-tests.

### rank

**Type:** Number (Read Only)

The promotion's rank. Rank is a numeric attribute that you can specify.
 Promotions with a defined rank are calculated before promotions without a defined rank.
 If two promotions have a rank, the one with the lowest rank is calculated first.
 For example, a promotion with rank 10 is calculated before one with rank 30.

### refinable

**Type:** boolean (Read Only)

Returns true if promotion is refinable, otherwise false.

### sourceCodeGroups

**Type:** Collection (Read Only)

The source code groups directly assigned to the promotion or assigned to the campaign of the promotion. 
 If the promotion is not based on source code groups (see isBasedOnSourceCodes()), or no source code group is assigned to the
 promotion or its campaign, an empty collection is returned.

### startDate

**Type:** Date (Read Only)

The effective start date of this instance of the promotion. If no
 explicit start date is defined for this instance, the start date of the
 containing Campaign or AB-test is returned.

### tags

**Type:** String (Read Only)

The promotion's tags. Tags are a way of categorizing and organizing promotions. A promotion can have many
 tags. Tags will be returned in alphabetical order.

## Constructor Summary

## Method Summary

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

Returns the callout message of the promotion.

### getCampaign

**Signature:** `getCampaign() : Campaign`

Returns the campaign this particular instance of the promotion is defined in.

### getCombinablePromotions

**Signature:** `getCombinablePromotions() : String[]`

Returns the promotion's combinable promotions.

### getConditionalDescription

**Signature:** `getConditionalDescription() : MarkupText`

Returns a description of the condition that must be met for this promotion to be applicable.

### getCoupons

**Signature:** `getCoupons() : Collection`

Returns the coupons directly assigned to the promotion or assigned to the campaign of the promotion.

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes for this extensible object.

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

Returns the customer groups directly assigned to the promotion or assigned to the campaign of the promotion.

### getDescription

**Signature:** `getDescription() : MarkupText`

Returns the description of the promotion.

### getDetails

**Signature:** `getDetails() : MarkupText`

Returns the detailed description of the promotion.

### getEndDate

**Signature:** `getEndDate() : Date`

Returns the effective end date of this instance of the promotion.

### getExclusivity

**Signature:** `getExclusivity() : String`

Returns the promotion's exclusivity specifying how the promotion can be combined with other promotions.

### getID

**Signature:** `getID() : String`

Returns the unique ID of the promotion.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the reference to the promotion image.

### getLastModified

**Signature:** `getLastModified() : Date`

Returns the date that this object was last modified.

### getMutuallyExclusivePromotions

**Signature:** `getMutuallyExclusivePromotions() : String[]`

Returns the promotion's mutually exclusive Promotions.

### getName

**Signature:** `getName() : String`

Returns the name of the promotion.

### getPromotionalPrice

**Signature:** `getPromotionalPrice(product : Product) : Money`

Returns the promotional price for the specified product.

### getPromotionalPrice

**Signature:** `getPromotionalPrice(product : Product, optionModel : ProductOptionModel) : Money`

This method follows the same logic as getPromotionalPrice(Product) but prices are calculated based on the option values selected in the specified option model.

### getPromotionClass

**Signature:** `getPromotionClass() : String`

Returns the promotion class indicating the general type of the promotion.

### getQualifierMatchMode

**Signature:** `getQualifierMatchMode() : String`

Returns the qualifier matching mode specified by this promotion.

### getRank

**Signature:** `getRank() : Number`

Returns the promotion's rank.

### getSourceCodeGroups

**Signature:** `getSourceCodeGroups() : Collection`

Returns the source code groups directly assigned to the promotion or assigned to the campaign of the promotion.

### getStartDate

**Signature:** `getStartDate() : Date`

Returns the effective start date of this instance of the promotion.

### getTags

**Signature:** `getTags() : String[]`

Returns the promotion's tags.

### isActive

**Signature:** `isActive() : boolean`

Returns 'true' if promotion is active, otherwise 'false'.

### isBasedOnCoupon

**Signature:** `isBasedOnCoupon() : boolean`

Returns 'true' if the promotion is triggered by a coupon, false otherwise.

### isBasedOnCoupons

**Signature:** `isBasedOnCoupons() : boolean`

Returns 'true' if the promotion is triggered by coupons, false otherwise.

### isBasedOnCustomerGroups

**Signature:** `isBasedOnCustomerGroups() : boolean`

Returns 'true' if the promotion is triggered by customer groups, false otherwise.

### isBasedOnSourceCodes

**Signature:** `isBasedOnSourceCodes() : boolean`

Returns 'true' if the promotion is triggered by source codes, false otherwise.

### isEnabled

**Signature:** `isEnabled() : boolean`

Returns true if promotion is enabled, otherwise false.

### isRefinable

**Signature:** `isRefinable() : boolean`

Returns true if promotion is refinable, otherwise false.

## Method Detail

## Method Details

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

**Description:** Returns the callout message of the promotion.

**Returns:**

Callout message of the promotion.

---

### getCampaign

**Signature:** `getCampaign() : Campaign`

**Description:** Returns the campaign this particular instance of the promotion is defined in. Note: If this promotion is defined as part of an AB-test, then a Campaign object will be returned, but it is a mock implementation, and not a true Campaign. This behavior is required for backwards compatibility and should not be relied upon as it may change in future releases.

**Returns:**

Campaign of the promotion.

---

### getCombinablePromotions

**Signature:** `getCombinablePromotions() : String[]`

**Description:** Returns the promotion's combinable promotions. Combinable promotions is a set of promotions or groups this promotion can be combined with.

**Returns:**

The promotion's set of combinable promotions.

---

### getConditionalDescription

**Signature:** `getConditionalDescription() : MarkupText`

**Description:** Returns a description of the condition that must be met for this promotion to be applicable. The method and the related attribute have been deprecated. Use the getDetails() method instead.

**Deprecated:**

Use getDetails()

**Returns:**

Condition promotion description.

---

### getCoupons

**Signature:** `getCoupons() : Collection`

**Description:** Returns the coupons directly assigned to the promotion or assigned to the campaign of the promotion. If the promotion is not based on coupons (see isBasedOnCoupons()), or no coupons is assigned to the promotion or its campaign, an empty collection is returned.

**Returns:**

Coupons assigned to promotion in no particular order.

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes for this extensible object.

---

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

**Description:** Returns the customer groups directly assigned to the promotion or assigned to the campaign of the promotion. If the promotion is not based on customer groups (see isBasedOnCustomerGroups()), or no customer group is assigned to the promotion or its campaign, an empty collection is returned.

**Returns:**

Customer groups assigned to promotion in no particular order.

---

### getDescription

**Signature:** `getDescription() : MarkupText`

**Description:** Returns the description of the promotion. Method is deprecated and returns the same value as getCalloutMsg().

**Deprecated:**

Use getCalloutMsg()

**Returns:**

Description of the promotion.

---

### getDetails

**Signature:** `getDetails() : MarkupText`

**Description:** Returns the detailed description of the promotion.

**Returns:**

Detailed promotion description.

---

### getEndDate

**Signature:** `getEndDate() : Date`

**Description:** Returns the effective end date of this instance of the promotion. If no explicit end date is defined for the promotion, the end date of the containing Campaign or AB-test is returned.

**Returns:**

End date of the promotion, or null if no end date is defined.

---

### getExclusivity

**Signature:** `getExclusivity() : String`

**Description:** Returns the promotion's exclusivity specifying how the promotion can be combined with other promotions. Possible values are EXCLUSIVITY_NO, EXCLUSIVITY_CLASS and EXCLUSIVITY_GLOBAL.

**Returns:**

Promotion exclusivity

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique ID of the promotion.

**Returns:**

ID of the promotion.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the reference to the promotion image.

**Returns:**

Image of the promotion.

---

### getLastModified

**Signature:** `getLastModified() : Date`

**Description:** Returns the date that this object was last modified.

**Returns:**

the date that this object was last modified.

---

### getMutuallyExclusivePromotions

**Signature:** `getMutuallyExclusivePromotions() : String[]`

**Description:** Returns the promotion's mutually exclusive Promotions. Mutually exclusive Promotions is a set of promotions or groups this promotion cannot be combined with.

**Returns:**

The promotion's set of mutually exclusive Promotions.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the promotion.

**Returns:**

Name of the promotion.

---

### getPromotionalPrice

**Signature:** `getPromotionalPrice(product : Product) : Money`

**Description:** Returns the promotional price for the specified product. The promotional price is only returned if the following conditions are met: this promotion is a product promotion without purchase conditions, i.e. is of type 'Without qualifying products'. this promotion's discount is Discount.TYPE_AMOUNT, Discount.TYPE_PERCENTAGE, Discount.TYPE_FIXED_PRICE, or Discount.TYPE_PRICEBOOK_PRICE. specified product is one of the discounted products of the promotion. the product has a valid sales price for quantity 1.0. In all other cases, the method will return Money.NOT_AVAILABLE. It is not required that this promotion be an active customer promotion. NOTE: the method might be extended in the future to support more promotion types. To calculate the promotional price, the method uses the current sales price of the product for quantity 1.0, and applies the discount associated with the promotion to this price. For example, if the product price is $14.99, and the promotion discount is 10%, the method will return $13.49. If the discount is $2 off, the method will return $12.99. If the discount is $10.00 fixed price, the method will return $10.00.

**Parameters:**

- `product`: the product to calculate the discount for

**Returns:**

the price of the passed product after promotional discount is applied, or Money.NOT_AVAILABLE if any of the restrictions on product or promotion are not met.

---

### getPromotionalPrice

**Signature:** `getPromotionalPrice(product : Product, optionModel : ProductOptionModel) : Money`

**Description:** This method follows the same logic as getPromotionalPrice(Product) but prices are calculated based on the option values selected in the specified option model.

**Parameters:**

- `product`: the product to calculate the discount for
- `optionModel`: the option model to use when calculating

**Returns:**

the price of the passed product after promotional discount is applied, or Money.NOT_AVAILABLE if any of the restrictions on product or promotion are not met.

---

### getPromotionClass

**Signature:** `getPromotionClass() : String`

**Description:** Returns the promotion class indicating the general type of the promotion. Possible values are PROMOTION_CLASS_PRODUCT, PROMOTION_CLASS_ORDER, and PROMOTION_CLASS_SHIPPING.

**Returns:**

Promotion class or null if the promotion rule has not been configured.

---

### getQualifierMatchMode

**Signature:** `getQualifierMatchMode() : String`

**Description:** Returns the qualifier matching mode specified by this promotion. A promotion may have up to 3 qualifier conditions based on whether it is customer-group based, coupon based, and/or source-code based. A promotion may require for example that a customer belong to a certain customer group and also have a certain coupon in the cart in order for the promotion to apply. This method returns QUALIFIER_MATCH_MODE_ALL if it is necessary that all the qualifier conditions are satisfied in order for this promotion to apply for a given customer. Otherwise, this method returns QUALIFIER_MATCH_MODE_ANY indicating that at least of the qualifier conditions must be satisfied. Note: currently QUALIFIER_MATCH_MODE_ALL is only supported for promotions assigned to campaigns, and not those assigned to AB-tests.

**Returns:**

the qualifier matching mode specified by this promotion, either QUALIFIER_MATCH_MODE_ALL or QUALIFIER_MATCH_MODE_ANY.

---

### getRank

**Signature:** `getRank() : Number`

**Description:** Returns the promotion's rank. Rank is a numeric attribute that you can specify. Promotions with a defined rank are calculated before promotions without a defined rank. If two promotions have a rank, the one with the lowest rank is calculated first. For example, a promotion with rank 10 is calculated before one with rank 30.

**Returns:**

The promotion's rank.

---

### getSourceCodeGroups

**Signature:** `getSourceCodeGroups() : Collection`

**Description:** Returns the source code groups directly assigned to the promotion or assigned to the campaign of the promotion. If the promotion is not based on source code groups (see isBasedOnSourceCodes()), or no source code group is assigned to the promotion or its campaign, an empty collection is returned.

**Returns:**

Source code groups assigned to promotion in no particular order.

---

### getStartDate

**Signature:** `getStartDate() : Date`

**Description:** Returns the effective start date of this instance of the promotion. If no explicit start date is defined for this instance, the start date of the containing Campaign or AB-test is returned.

**Returns:**

Start date of the promotion, or null if no start date is defined.

---

### getTags

**Signature:** `getTags() : String[]`

**Description:** Returns the promotion's tags. Tags are a way of categorizing and organizing promotions. A promotion can have many tags. Tags will be returned in alphabetical order.

**Returns:**

The promotion's set of tags.

---

### isActive

**Signature:** `isActive() : boolean`

**Description:** Returns 'true' if promotion is active, otherwise 'false'. A promotion is active if its campaign is active, and the promotion is enabled, and it is scheduled for now.

**Returns:**

true if promotion is active, otherwise false.

---

### isBasedOnCoupon

**Signature:** `isBasedOnCoupon() : boolean`

**Description:** Returns 'true' if the promotion is triggered by a coupon, false otherwise.

**Deprecated:**

Use isBasedOnCoupons()

**Returns:**

true if promotion is triggered by coupon, otherwise false.

---

### isBasedOnCoupons

**Signature:** `isBasedOnCoupons() : boolean`

**Description:** Returns 'true' if the promotion is triggered by coupons, false otherwise.

**Returns:**

true if promotion is triggered by coupons, otherwise false.

---

### isBasedOnCustomerGroups

**Signature:** `isBasedOnCustomerGroups() : boolean`

**Description:** Returns 'true' if the promotion is triggered by customer groups, false otherwise.

**Returns:**

true if promotion is triggered by customer groups, otherwise false.

---

### isBasedOnSourceCodes

**Signature:** `isBasedOnSourceCodes() : boolean`

**Description:** Returns 'true' if the promotion is triggered by source codes, false otherwise.

**Returns:**

true if promotion is triggered by source codes, otherwise false.

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Returns true if promotion is enabled, otherwise false.

**Returns:**

true if promotion is enabled, otherwise false.

---

### isRefinable

**Signature:** `isRefinable() : boolean`

**Description:** Returns true if promotion is refinable, otherwise false.

**Returns:**

true if promotion is refinable, otherwise false.

---