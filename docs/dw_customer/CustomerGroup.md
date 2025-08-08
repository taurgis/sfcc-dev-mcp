## Package: dw.customer

# Class CustomerGroup

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.CustomerGroup

## Description

CustomerGroups provide a means to segment customers by various criteria. A merchant can then provide different site experiences (e.g. promotions, prices, sorting rules) to each customer segment. Customer groups can consist of either an explicit list of customers or a business rule that dynamically determines whether a customer is a member. The former type is called "explicit" and the latter type is called "dynamic". Explicit customer group: Consists of an explicit list of customers. Only registered customers can be member of such a group. isRuleBased==false. Dynamic customer group: Memberships are evaluated by a business rule that is attached to the customer group. Registered as well as anonymous customers can be member of such a group. isRuleBased==true. Note: this class might allow access to sensitive personal and private information, depending on how you segment your customers and the names given to your custoemer groups. Pay attention to appropriate legal and regulatory requirements when developing with this data.

## Properties

### description

**Type:** String (Read Only)

Gets the value of the description of the customer group.

### ID

**Type:** String (Read Only)

The unique ID of the customer group.

### ruleBased

**Type:** boolean (Read Only)

Returns true if the group determines the membership of customers
 based on rules. Returns false if the group provides explicit assignement
 of customers.

## Constructor Summary

## Method Summary

### assignCustomer

**Signature:** `assignCustomer(customer : Customer) : void`

Assigns the specified customer to this group.

### getDescription

**Signature:** `getDescription() : String`

Gets the value of the description of the customer group.

### getID

**Signature:** `getID() : String`

Returns the unique ID of the customer group.

### isRuleBased

**Signature:** `isRuleBased() : boolean`

Returns true if the group determines the membership of customers based on rules.

### unassignCustomer

**Signature:** `unassignCustomer(customer : Customer) : void`

Unassigns the specified customer from this group.

## Method Detail

## Method Details

### assignCustomer

**Signature:** `assignCustomer(customer : Customer) : void`

**Description:** Assigns the specified customer to this group. The customer must be registered and the group must not be rule-based.

**Parameters:**

- `customer`: Registered customer, must not be null.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Gets the value of the description of the customer group.

**Returns:**

the description of the customer group

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique ID of the customer group.

**Returns:**

The unique semantic ID of the customer group.

---

### isRuleBased

**Signature:** `isRuleBased() : boolean`

**Description:** Returns true if the group determines the membership of customers based on rules. Returns false if the group provides explicit assignement of customers.

**Returns:**

True, if the customer group is rule based.

---

### unassignCustomer

**Signature:** `unassignCustomer(customer : Customer) : void`

**Description:** Unassigns the specified customer from this group. The customer must be registered and the group must not be rule-based.

**Parameters:**

- `customer`: Registered customer, must not be null.

---