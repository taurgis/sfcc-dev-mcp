## Package: dw.order

# Class CouponLineItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.CouponLineItem

## Description

The CouponLineItem class is used to store redeemed coupons in the Basket.

## Properties

### applied

**Type:** boolean (Read Only)

Identifies if the coupon is currently applied in the basket. A coupon
 line is applied if there exists at least one price adjustment related
 to the coupon line item.

### basedOnCampaign

**Type:** boolean (Read Only)

Returns true if the line item represents a coupon of a campaign. If the coupon line item represents a custom
 coupon code, the method returns false.

### bonusDiscountLineItems

**Type:** Collection (Read Only)

The bonus discount line items of the line item container triggered
 by this coupon.

### couponCode

**Type:** String (Read Only)

The coupon code.

### priceAdjustments

**Type:** Collection (Read Only)

The price adjustments of the line item container triggered
 by this coupon.

### promotion

**Type:** Promotion (Read Only)

The promotion related to the coupon line item.

### promotionID

**Type:** String (Read Only)

The id of the related promotion.

### statusCode

**Type:** String (Read Only)

This method provides a detailed error status in case the coupon code of
 this coupon line item instance became invalid.

### valid

**Type:** CouponStatusCodes.APPLIED (Read Only)

Allows to check whether the coupon code of this coupon line item instance
 is valid. Coupon line item is valid, if status code is one of the following:
 
 CouponStatusCodes.APPLIED
 CouponStatusCodes.NO_APPLICABLE_PROMOTION

## Constructor Summary

## Method Summary

### associatePriceAdjustment

**Signature:** `associatePriceAdjustment(priceAdjustment : PriceAdjustment) : void`

Associates the specified price adjustment with the coupon line item.

### getBonusDiscountLineItems

**Signature:** `getBonusDiscountLineItems() : Collection`

Returns the bonus discount line items of the line item container triggered by this coupon.

### getCouponCode

**Signature:** `getCouponCode() : String`

Returns the coupon code.

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

Returns the price adjustments of the line item container triggered by this coupon.

### getPromotion

**Signature:** `getPromotion() : Promotion`

Returns the promotion related to the coupon line item.

### getPromotionID

**Signature:** `getPromotionID() : String`

Returns the id of the related promotion.

### getStatusCode

**Signature:** `getStatusCode() : String`

This method provides a detailed error status in case the coupon code of this coupon line item instance became invalid.

### isApplied

**Signature:** `isApplied() : boolean`

Identifies if the coupon is currently applied in the basket.

### isBasedOnCampaign

**Signature:** `isBasedOnCampaign() : boolean`

Returns true if the line item represents a coupon of a campaign.

### isValid

**Signature:** `isValid() : boolean`

Allows to check whether the coupon code of this coupon line item instance is valid.

## Method Detail

## Method Details

### associatePriceAdjustment

**Signature:** `associatePriceAdjustment(priceAdjustment : PriceAdjustment) : void`

**Description:** Associates the specified price adjustment with the coupon line item. This method is only applicable if used for price adjustments and coupon line items NOT based on B2C Commerce campaigns.

**Parameters:**

- `priceAdjustment`: Price adjustment to be associated with coupon line item.

---

### getBonusDiscountLineItems

**Signature:** `getBonusDiscountLineItems() : Collection`

**Description:** Returns the bonus discount line items of the line item container triggered by this coupon.

**Returns:**

Price adjustments triggered by the coupon

---

### getCouponCode

**Signature:** `getCouponCode() : String`

**Description:** Returns the coupon code.

**Returns:**

Coupon code

---

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

**Description:** Returns the price adjustments of the line item container triggered by this coupon.

**Returns:**

Price adjustments triggered by the coupon

---

### getPromotion

**Signature:** `getPromotion() : Promotion`

**Description:** Returns the promotion related to the coupon line item.

**Deprecated:**

A coupon code and its coupon can be associated with multiple promotions. Therefore, this method is not appropriate anymore. For backward-compatibility, the method returns one of the promotions associated with the coupon code.

**Returns:**

Promotion related to coupon represented by line item

---

### getPromotionID

**Signature:** `getPromotionID() : String`

**Description:** Returns the id of the related promotion.

**Deprecated:**

A coupon code and it's coupon can be associated with multiple promotions. Therefore, this method is not appropriate anymore. For backward-compatibility, the method returns the ID of one of the promotions associated with the coupon code.

**Returns:**

the id of the related promotion.

---

### getStatusCode

**Signature:** `getStatusCode() : String`

**Description:** This method provides a detailed error status in case the coupon code of this coupon line item instance became invalid.

**Returns:**

Returns APPLIED if coupon is applied, and otherwise one of the codes defined in CouponStatusCodes

---

### isApplied

**Signature:** `isApplied() : boolean`

**Description:** Identifies if the coupon is currently applied in the basket. A coupon line is applied if there exists at least one price adjustment related to the coupon line item.

**Returns:**

true if the coupon is currently applied in the basket.

---

### isBasedOnCampaign

**Signature:** `isBasedOnCampaign() : boolean`

**Description:** Returns true if the line item represents a coupon of a campaign. If the coupon line item represents a custom coupon code, the method returns false.

---

### isValid

**Signature:** `isValid() : boolean`

**Description:** Allows to check whether the coupon code of this coupon line item instance is valid. Coupon line item is valid, if status code is one of the following: CouponStatusCodes.APPLIED CouponStatusCodes.NO_APPLICABLE_PROMOTION

**Returns:**

true if the coupon code is valid, false otherwise.

---