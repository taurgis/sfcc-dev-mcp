## Package: dw.campaign

# Class CouponStatusCodes

## Inheritance Hierarchy

- Object
  - dw.campaign.CouponStatusCodes

## Description

Helper class containing status codes for why a coupon code cannot be added to cart or why a coupon code already in cart is not longer valid for redemption.

## Constants

### APPLIED

**Type:** String = "APPLIED"

Coupon is currently applied in basket = Coupon code is valid for redemption and Coupon is assigned to one or multiple applicable promotions.

### COUPON_ALREADY_IN_BASKET

**Type:** String = "COUPON_ALREADY_IN_BASKET"

Indicates that another code of the same MultiCode/System coupon has already been added to basket.

### COUPON_CODE_ALREADY_IN_BASKET

**Type:** String = "COUPON_CODE_ALREADY_IN_BASKET"

Indicates that coupon code has already been added to basket.

### COUPON_CODE_ALREADY_REDEEMED

**Type:** String = "COUPON_CODE_ALREADY_REDEEMED"

Indicates that code of MultiCode/System coupon has already been redeemed.

### COUPON_CODE_UNKNOWN

**Type:** String = "COUPON_CODE_UNKNOWN"

Indicates that coupon not found for given coupon code or that the code itself was not found.

### COUPON_DISABLED

**Type:** String = "COUPON_DISABLED"

Indicates that coupon is not enabled.

### CUSTOMER_REDEMPTION_LIMIT_EXCEEDED

**Type:** String = "CUSTOMER_REDEMPTION_LIMIT_EXCEEDED"

Indicates that No. of redemptions per code & customer exceeded.

### NO_ACTIVE_PROMOTION

**Type:** String = "NO_ACTIVE_PROMOTION"

Indicates that coupon is not assigned to an active promotion.

### NO_APPLICABLE_PROMOTION

**Type:** String = "NO_APPLICABLE_PROMOTION"

Coupon is assigned to one or multiple active promotions, but none of these promotions is currently applicable.

### REDEMPTION_LIMIT_EXCEEDED

**Type:** String = "REDEMPTION_LIMIT_EXCEEDED"

Indicates that no. of redemptions per code exceeded. Usually happens for single code coupons

### TIMEFRAME_REDEMPTION_LIMIT_EXCEEDED

**Type:** String = "TIMEFRAME_REDEMPTION_LIMIT_EXCEEDED"

Indicates that No. of redemptions per code,customer & time exceeded.

## Properties

## Constructor Summary

## Method Summary