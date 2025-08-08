## Package: dw.campaign

# Class ABTestMgr

## Inheritance Hierarchy

- Object
  - dw.campaign.ABTestMgr

## Description

Manager class used to access AB-test information in the storefront.

## Properties

### assignedTestSegments

**Type:** Collection (Read Only)

Return the AB-test segments to which the current customer is assigned.
 AB-test segments deleted in the meantime will not be returned.

## Constructor Summary

## Method Summary

### getAssignedTestSegments

**Signature:** `static getAssignedTestSegments() : Collection`

Return the AB-test segments to which the current customer is assigned.

### isParticipant

**Signature:** `static isParticipant(testID : String, segmentID : String) : boolean`

Test whether the current customer is a member of the specified AB-test segment.

## Method Detail

## Method Details

### getAssignedTestSegments

**Signature:** `static getAssignedTestSegments() : Collection`

**Description:** Return the AB-test segments to which the current customer is assigned. AB-test segments deleted in the meantime will not be returned.

**Returns:**

unordered collection of ABTestSegment instances representing the AB-test segments to which the current customer is assigned.

---

### isParticipant

**Signature:** `static isParticipant(testID : String, segmentID : String) : boolean`

**Description:** Test whether the current customer is a member of the specified AB-test segment. This method can be used to customize the storefront experience in ways that are not supported using Business Manager configuration alone.

**Parameters:**

- `testID`: The ID of the AB-test, must not be null.
- `segmentID`: The ID of the segment within the AB-test, must not be null.

**Returns:**

true if the current customer is a member of the specified AB-test segment, false otherwise.

---