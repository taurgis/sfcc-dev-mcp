## Package: dw.campaign

# Class Coupon

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.campaign.Coupon

## Description

Represents a coupon in Commerce Cloud Digital.

## Constants

## Properties

### codePrefix

**Type:** String (Read Only)

The prefix defined for coupons of type TYPE_SYSTEM_CODES
 If no prefix is defined, or coupon is of type TYPE_SINGLE_CODE
 or TYPE_MULTIPLE_CODES, null is returned.

### enabled

**Type:** boolean (Read Only)

Returns true if coupon is enabled, else false.

### ID

**Type:** String (Read Only)

The ID of the coupon.

### nextCouponCode

**Type:** String (Read Only)

The next unissued code of this coupon.
 For single-code coupons, the single fixed coupon code is returned.
 For all multi-code coupons, the next available, unissued coupon code is returned.
 If all codes of the coupon have been issued, then there is no next code, and null is returned.

 A transaction is required when calling this method. This needs to be ensured by the calling script.

### promotions

**Type:** Collection (Read Only)

The coupon-based promotions directly or indirectly (through
 campaigns) assigned to this coupon.

### redemptionLimitPerCode

**Type:** Number (Read Only)

The defined limit on redemption per coupon code. Null is
 returned if no limit is defined, which means that each code can be
 redeemed an unlimited number of times.

### redemptionLimitPerCustomer

**Type:** Number (Read Only)

The defined limit on redemption of this coupon per customer.
 Null is returned if no limit is defined, which means that customers can
 redeem this coupon an unlimited number of times.

### redemptionLimitPerTimeFrame

**Type:** Number (Read Only)

The defined limit on redemption per customer per time-frame (see
 getRedemptionLimitTimeFrame(). Null is returned if no limit is
 defined, which means that there is no time-specific redemption limit for
 customers.

### redemptionLimitTimeFrame

**Type:** Number (Read Only)

The time-frame (in days) of the defined limit on redemption per
 customer per time-frame. Null is returned if no limit is defined, which
 means that there is no time-specific redemption limit for customers.

### type

**Type:** String (Read Only)

The coupon type.
 Possible values are TYPE_SINGLE_CODE, TYPE_MULTIPLE_CODES
 and TYPE_SYSTEM_CODES.

## Constructor Summary

## Method Summary

### getCodePrefix

**Signature:** `getCodePrefix() : String`

Returns the prefix defined for coupons of type TYPE_SYSTEM_CODES If no prefix is defined, or coupon is of type TYPE_SINGLE_CODE or TYPE_MULTIPLE_CODES, null is returned.

### getID

**Signature:** `getID() : String`

Returns the ID of the coupon.

### getNextCouponCode

**Signature:** `getNextCouponCode() : String`

Returns the next unissued code of this coupon.

### getPromotions

**Signature:** `getPromotions() : Collection`

Returns the coupon-based promotions directly or indirectly (through campaigns) assigned to this coupon.

### getRedemptionLimitPerCode

**Signature:** `getRedemptionLimitPerCode() : Number`

Returns the defined limit on redemption per coupon code.

### getRedemptionLimitPerCustomer

**Signature:** `getRedemptionLimitPerCustomer() : Number`

Returns the defined limit on redemption of this coupon per customer.

### getRedemptionLimitPerTimeFrame

**Signature:** `getRedemptionLimitPerTimeFrame() : Number`

Returns the defined limit on redemption per customer per time-frame (see getRedemptionLimitTimeFrame().

### getRedemptionLimitTimeFrame

**Signature:** `getRedemptionLimitTimeFrame() : Number`

Returns the time-frame (in days) of the defined limit on redemption per customer per time-frame.

### getType

**Signature:** `getType() : String`

Returns the coupon type.

### isEnabled

**Signature:** `isEnabled() : boolean`

Returns true if coupon is enabled, else false.

## Method Detail

## Method Details

### getCodePrefix

**Signature:** `getCodePrefix() : String`

**Description:** Returns the prefix defined for coupons of type TYPE_SYSTEM_CODES If no prefix is defined, or coupon is of type TYPE_SINGLE_CODE or TYPE_MULTIPLE_CODES, null is returned.

**Returns:**

Coupon code prefix or null

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the coupon.

**Returns:**

Coupon ID

---

### getNextCouponCode

**Signature:** `getNextCouponCode() : String`

**Description:** Returns the next unissued code of this coupon. For single-code coupons, the single fixed coupon code is returned. For all multi-code coupons, the next available, unissued coupon code is returned. If all codes of the coupon have been issued, then there is no next code, and null is returned. A transaction is required when calling this method. This needs to be ensured by the calling script.

**Returns:**

Next available code of this coupon, or null if there are no available codes.

---

### getPromotions

**Signature:** `getPromotions() : Collection`

**Description:** Returns the coupon-based promotions directly or indirectly (through campaigns) assigned to this coupon.

**Returns:**

Promotions assigned to the coupon in no particular order.

---

### getRedemptionLimitPerCode

**Signature:** `getRedemptionLimitPerCode() : Number`

**Description:** Returns the defined limit on redemption per coupon code. Null is returned if no limit is defined, which means that each code can be redeemed an unlimited number of times.

**Returns:**

The maximum number of redemption per coupon code

---

### getRedemptionLimitPerCustomer

**Signature:** `getRedemptionLimitPerCustomer() : Number`

**Description:** Returns the defined limit on redemption of this coupon per customer. Null is returned if no limit is defined, which means that customers can redeem this coupon an unlimited number of times.

**Returns:**

The maximum number of redemption per customer

---

### getRedemptionLimitPerTimeFrame

**Signature:** `getRedemptionLimitPerTimeFrame() : Number`

**Description:** Returns the defined limit on redemption per customer per time-frame (see getRedemptionLimitTimeFrame(). Null is returned if no limit is defined, which means that there is no time-specific redemption limit for customers.

**Returns:**

The maximum number of redemption per customer within time-frame

**See Also:**

getRedemptionLimitTimeFrame()

---

### getRedemptionLimitTimeFrame

**Signature:** `getRedemptionLimitTimeFrame() : Number`

**Description:** Returns the time-frame (in days) of the defined limit on redemption per customer per time-frame. Null is returned if no limit is defined, which means that there is no time-specific redemption limit for customers.

**Returns:**

Timeframe (days) of redemption per time

**See Also:**

getRedemptionLimitPerTimeFrame()

---

### getType

**Signature:** `getType() : String`

**Description:** Returns the coupon type. Possible values are TYPE_SINGLE_CODE, TYPE_MULTIPLE_CODES and TYPE_SYSTEM_CODES.

**Returns:**

Coupon type

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Returns true if coupon is enabled, else false.

**Returns:**

true if coupon is enabled.

---