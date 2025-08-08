## Package: dw.customer

# Class CustomerCDPData

## Inheritance Hierarchy

- Object
  - dw.customer.CustomerCDPData

## Description

Represents the read-only Customer's Salesforce CDP (Customer Data Platform) data for a Customer in Commerce Cloud. Please see Salesforce CDP enablement documentation

## Properties

### empty

**Type:** boolean (Read Only)

Return true if the CDPData is empty (has no meaningful data)

### segments

**Type:** String (Read Only)

An array containing the CDP segments for the customer, or an empty array if no segments found

## Constructor Summary

## Method Summary

### getSegments

**Signature:** `getSegments() : String[]`

Returns an array containing the CDP segments for the customer, or an empty array if no segments found

### isEmpty

**Signature:** `isEmpty() : boolean`

Return true if the CDPData is empty (has no meaningful data)

## Method Detail

## Method Details

### getSegments

**Signature:** `getSegments() : String[]`

**Description:** Returns an array containing the CDP segments for the customer, or an empty array if no segments found

**Returns:**

a collection containing the CDP segments for the customer

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Return true if the CDPData is empty (has no meaningful data)

**Returns:**

true if CDPData is empty, false otherwise

---