## Package: dw.customer

# Class AuthenticationStatus

## Inheritance Hierarchy

- Object
  - dw.customer.AuthenticationStatus

## Description

Holds the status of an authentication process.

## Constants

## Properties

### authenticated

**Type:** boolean (Read Only)

checks whether the authentication was successful or not

### customer

**Type:** Customer (Read Only)

The customer, corresponding to the login used during authentication. This customer is not logged in after authentication.

### status

**Type:** String (Read Only)

the status code (see the constants above)

## Constructor Summary

## Method Summary

### getCustomer

**Signature:** `getCustomer() : Customer`

The customer, corresponding to the login used during authentication.

### getStatus

**Signature:** `getStatus() : String`

the status code (see the constants above)

### isAuthenticated

**Signature:** `isAuthenticated() : boolean`

checks whether the authentication was successful or not

## Method Detail

## Method Details

### getCustomer

**Signature:** `getCustomer() : Customer`

**Description:** The customer, corresponding to the login used during authentication. This customer is not logged in after authentication.

**Returns:**

the customer described by the login

---

### getStatus

**Signature:** `getStatus() : String`

**Description:** the status code (see the constants above)

**Returns:**

the status code

---

### isAuthenticated

**Signature:** `isAuthenticated() : boolean`

**Description:** checks whether the authentication was successful or not

**Returns:**

the when the authentication was successful

---