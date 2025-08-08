## Package: dw.customer

# Class CustomerList

## Inheritance Hierarchy

- Object
  - dw.customer.CustomerList

## Description

Object representing the collection of customers who are registered for a given site. In Commerce Cloud Digital, every site has exactly one assigned customer list but multiple sites may share a customer list.

## Properties

### description

**Type:** String (Read Only)

Get the optional description of the customer list.

### ID

**Type:** String (Read Only)

Get the ID of the customer list.  For customer lists that were created automatically
 for a given site, this is equal to the ID of the site itself.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Get the optional description of the customer list.

### getID

**Signature:** `getID() : String`

Get the ID of the customer list.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Get the optional description of the customer list.

**Returns:**

The optional description of the list.

---

### getID

**Signature:** `getID() : String`

**Description:** Get the ID of the customer list. For customer lists that were created automatically for a given site, this is equal to the ID of the site itself.

**Returns:**

The ID of the customer list.

---