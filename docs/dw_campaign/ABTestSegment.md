## Package: dw.campaign

# Class ABTestSegment

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.campaign.ABTestSegment

## Description

Object representing an AB-test segment in the Commerce Cloud Digital. Each AB-test defines 1 or more segments to which customers are randomly assigned by the platform when they qualify for the AB-test. Customers are assigned to segments according to allocation percentages controlled by the merchant. Each AB-test segment defines a set of "experiences" that the merchant is testing and which which apply only to the customers in that segment. There is always one "control" segment which contains only the default set of experiences for that site.

## Properties

### ABTest

**Type:** ABTest (Read Only)

Get the AB-test to which this segment belongs.

### controlSegment

**Type:** boolean (Read Only)

Returns true if this is the "control segment" for the AB-test, meaning
 the segment that has no experiences associated with it.

### ID

**Type:** String (Read Only)

Get the ID of the AB-test segment.

## Constructor Summary

## Method Summary

### getABTest

**Signature:** `getABTest() : ABTest`

Get the AB-test to which this segment belongs.

### getID

**Signature:** `getID() : String`

Get the ID of the AB-test segment.

### isControlSegment

**Signature:** `isControlSegment() : boolean`

Returns true if this is the "control segment" for the AB-test, meaning the segment that has no experiences associated with it.

## Method Detail

## Method Details

### getABTest

**Signature:** `getABTest() : ABTest`

**Description:** Get the AB-test to which this segment belongs.

**Returns:**

the AB-test to which this segment belongs.

---

### getID

**Signature:** `getID() : String`

**Description:** Get the ID of the AB-test segment.

**Returns:**

the ID of the AB-test segment.

---

### isControlSegment

**Signature:** `isControlSegment() : boolean`

**Description:** Returns true if this is the "control segment" for the AB-test, meaning the segment that has no experiences associated with it.

**Returns:**

true if this segment is the "control segment" for the AB-test, or false otherwise.

---