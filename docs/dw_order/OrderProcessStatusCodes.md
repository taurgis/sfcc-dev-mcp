## Package: dw.order

# Class OrderProcessStatusCodes

## Inheritance Hierarchy

- Object
  - dw.order.OrderProcessStatusCodes

## Description

Contains constants representing different status codes for interacting with an order, such as cancelling or editing an order.

## Constants

### COUPON_INVALID

**Type:** String = "COUPON_INVALID"

Indicates that a coupon in the order is not valid.

### INVENTORY_RESERVATION_FAILED

**Type:** String = "INVENTORY_RESERVATION_FAILED"

Indicates that no inventory could be reserved for the order.

### ORDER_ALREADY_CANCELLED

**Type:** String = "ORDER_CANCELLED"

Indicates that the order could not be used because it has already been cancelled.

### ORDER_ALREADY_EXPORTED

**Type:** String = "ORDER_EXPORTED"

Indicates that the order could not be used because it has already been exported.

### ORDER_ALREADY_FAILED

**Type:** String = "ORDER_FAILED"

Indicates that the order could not be used because it has already been failed.

### ORDER_ALREADY_REPLACED

**Type:** String = "ORDER_REPLACED"

Indicates that the order could not be used because it has already been replaced.

### ORDER_CONTAINS_GC

**Type:** String = "CANCEL_ORDER_GC"

Indicates that the order could not be used because it contains gift certificates.

### ORDER_NOT_CANCELLED

**Type:** String = "ORDER_NOT_CANCELLED"

Indicates that the order could not be used because it is not cancelled.

### ORDER_NOT_FAILED

**Type:** String = "ORDER_NOT_FAILED"

Indicates that the order could not be used because it has not been failed.

### ORDER_NOT_PLACED

**Type:** String = "ORDER_NOT_PLACED"

Indicates that the order could not be used because it has not been placed.

## Properties

## Constructor Summary

OrderProcessStatusCodes()

## Method Summary

## Constructor Detail