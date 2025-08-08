## Package: dw.customer

# Class CustomerContextMgr

## Inheritance Hierarchy

- Object
  - dw.customer.CustomerContextMgr

## Description

Provides helper methods for managing customer context, such as the Effective Time for which the customer is shopping at

## Properties

### effectiveTime

**Type:** Date

Get the effective time associated with the customer. By default, the effective time is null.

## Constructor Summary

## Method Summary

### getEffectiveTime

**Signature:** `static getEffectiveTime() : Date`

Get the effective time associated with the customer.

### setEffectiveTime

**Signature:** `static setEffectiveTime(effectiveTime : Date) : void`

Set the effective time for the customer.

## Method Detail

## Method Details

### getEffectiveTime

**Signature:** `static getEffectiveTime() : Date`

**Description:** Get the effective time associated with the customer. By default, the effective time is null.

**Returns:**

effective time. When null is returned it means no effective time is associated with the customer

---

### setEffectiveTime

**Signature:** `static setEffectiveTime(effectiveTime : Date) : void`

**Description:** Set the effective time for the customer. Null is allowed to remove effective time from the customer.

**Parameters:**

- `effectiveTime`: the effective time.

---