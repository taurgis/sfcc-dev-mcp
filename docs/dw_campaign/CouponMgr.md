## Package: dw.campaign

# Class CouponMgr

## Inheritance Hierarchy

- Object
  - dw.campaign.CouponMgr

## Description

Manager to access coupons.

## Constants

### MR_ERROR_INVALID_SITE_ID

**Type:** String = "MASKREDEMPTIONS_SITE_NOT_FOUND"

Indicates that an error occurred because a valid data domain cannot be found for given siteID.

## Properties

### coupons

**Type:** Collection (Read Only)

All coupons in the current site in no specific order.

## Constructor Summary

## Method Summary

### getCoupon

**Signature:** `static getCoupon(couponID : String) : Coupon`

Returns the coupon with the specified ID.

### getCouponByCode

**Signature:** `static getCouponByCode(couponCode : String) : Coupon`

Tries to find a coupon for the given coupon code.

### getCoupons

**Signature:** `static getCoupons() : Collection`

Returns all coupons in the current site in no specific order.

### getRedemptions

**Signature:** `static getRedemptions(couponID : String, couponCode : String) : Collection`

Returns list of CouponRedemptions for the specified coupon and coupon code, sorted by redemption date descending (i.e.

### maskRedemptions

**Signature:** `static maskRedemptions(siteID : String, email : String) : Status`

Mask customer email address in coupon redemptions for the given siteID and email address

## Method Detail

## Method Details

### getCoupon

**Signature:** `static getCoupon(couponID : String) : Coupon`

**Description:** Returns the coupon with the specified ID.

**Parameters:**

- `couponID`: the coupon identifier.

**Returns:**

Coupon with specified ID or null

---

### getCouponByCode

**Signature:** `static getCouponByCode(couponCode : String) : Coupon`

**Description:** Tries to find a coupon for the given coupon code. The method first searches for a coupon with a fixed code matching the passed value. If no such fixed coupon is found, it searches for a coupon with a system-generated code matching the passed value. If found, the coupon is returned. Otherwise, the method returns null.

**Parameters:**

- `couponCode`: The coupon code to get the coupon for.

**Returns:**

The coupon with the matching coupon code or null if no coupon was found.

---

### getCoupons

**Signature:** `static getCoupons() : Collection`

**Description:** Returns all coupons in the current site in no specific order.

**Returns:**

Coupons in current site

---

### getRedemptions

**Signature:** `static getRedemptions(couponID : String, couponCode : String) : Collection`

**Description:** Returns list of CouponRedemptions for the specified coupon and coupon code, sorted by redemption date descending (i.e. last redemption first). Usually, there should only either be 0 or 1 redemption. But if a coupon and code is removed and recreated and re-issued later, there might be multiple such redemption records. Returns an empty list if no redemption record exists in system for the specified coupon and code.

**Parameters:**

- `couponID`: The coupon id to find redemption for.
- `couponCode`: The coupon code to find redemption for.

**Returns:**

A sorted list of CouponRedemptions for the specified coupon and coupon code or an empty list if no redemption record exists.

---

### maskRedemptions

**Signature:** `static maskRedemptions(siteID : String, email : String) : Status`

**Description:** Mask customer email address in coupon redemptions for the given siteID and email address

**Parameters:**

- `siteID`: the site ID
- `email`: the customer email address

**Returns:**

The status of the masking result

---