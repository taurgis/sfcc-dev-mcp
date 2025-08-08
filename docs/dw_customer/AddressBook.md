## Package: dw.customer

# Class AddressBook

## Inheritance Hierarchy

- Object
  - dw.customer.AddressBook

## Description

Represents a set of addresses associated with a specific customer. The AddressBook object gets its data from the Profile object for the customer. When scripting, this class allows AddressBook to be treated as a separate object from the Profile. However, data is only stored in the platform in the Profile object and there is no separate AddressBook object. For this reason, the AddressBook ID is always the customer profile ID. Note: this class allows access to sensitive personal and private information. Pay attention to appropriate legal and regulatory requirements when developing.

## Properties

### addresses

**Type:** List (Read Only)

A sorted list of addresses in the address book.  The addresses
 are sorted so that the preferred address is always sorted first.  The
 remaining addresses are sorted alphabetically by ID.

### preferredAddress

**Type:** CustomerAddress

The address that has been defined as the customer's preferred
 address.

## Constructor Summary

## Method Summary

### createAddress

**Signature:** `createAddress(name : String) : CustomerAddress`

Creates a new, empty address object with the specified name.

### getAddress

**Signature:** `getAddress(id : String) : CustomerAddress`

Returns the address with the given name from the address book.

### getAddresses

**Signature:** `getAddresses() : List`

Returns a sorted list of addresses in the address book.

### getPreferredAddress

**Signature:** `getPreferredAddress() : CustomerAddress`

Returns the address that has been defined as the customer's preferred address.

### removeAddress

**Signature:** `removeAddress(address : CustomerAddress) : void`

Removes the specified address from the address book.

### setPreferredAddress

**Signature:** `setPreferredAddress(anAddress : CustomerAddress) : void`

Sets the specified address as the customer's preferred address.

## Method Detail

## Method Details

### createAddress

**Signature:** `createAddress(name : String) : CustomerAddress`

**Description:** Creates a new, empty address object with the specified name.

**Parameters:**

- `name`: the ID of the address to create, must not be null.

**Returns:**

the new address object or null if an address with the given name already exists in the address book.

**Throws:**

NullArgumentException - If passed 'name' is null.
IllegalArgumentException - If passed 'name' is not null, but an empty string.

---

### getAddress

**Signature:** `getAddress(id : String) : CustomerAddress`

**Description:** Returns the address with the given name from the address book. The name is a unique identifier of the address within the address book.

**Parameters:**

- `id`: An address ID, must not be null.

**Returns:**

The Address object or null if the address does not exist.

**Throws:**

NullArgumentException - If passed 'id' is null.
IllegalArgumentException - If passed 'id' is not null, but an empty string.

---

### getAddresses

**Signature:** `getAddresses() : List`

**Description:** Returns a sorted list of addresses in the address book. The addresses are sorted so that the preferred address is always sorted first. The remaining addresses are sorted alphabetically by ID.

**Returns:**

Sorted List of customer addresses in the address book.

---

### getPreferredAddress

**Signature:** `getPreferredAddress() : CustomerAddress`

**Description:** Returns the address that has been defined as the customer's preferred address.

**Returns:**

the default CustomerAddress object, or null if there is no preferred address.

---

### removeAddress

**Signature:** `removeAddress(address : CustomerAddress) : void`

**Description:** Removes the specified address from the address book. Because an address can be associated with a product list, you may want to verify if the address is being used by a product list. See ProductListMgr.findAddress().

**Parameters:**

- `address`: the address to remove, must not be null.

---

### setPreferredAddress

**Signature:** `setPreferredAddress(anAddress : CustomerAddress) : void`

**Description:** Sets the specified address as the customer's preferred address. If null is passed, and there is an existing preferred address, then the address book will have no preferred address.

**Parameters:**

- `anAddress`: the address to be set as preferred, or null if the goal is to unset the existing preferred address.

---