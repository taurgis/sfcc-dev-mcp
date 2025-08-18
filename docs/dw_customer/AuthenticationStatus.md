## Package: dw.customer

# Class AuthenticationStatus

## Inheritance Hierarchy

- Object
  - dw.customer.AuthenticationStatus

## Description

Holds the status of an authentication process.

## Constants

### AUTH_OK

**Type:** String = "AUTH_OK"

Authentication was successful

### ERROR_CUSTOMER_DISABLED

**Type:** String = "ERROR_CUSTOMER_DISABLED"

customer could be found, but is disabled. Password was not verified.

### ERROR_CUSTOMER_LOCKED

**Type:** String = "ERROR_CUSTOMER_LOCKED"

customer could be found, but is locked (too many failed login attempts). Password was verified before.

### ERROR_CUSTOMER_NOT_FOUND

**Type:** String = "ERROR_CUSTOMER_NOT_FOUND"

customer could not be found

### ERROR_PASSWORD_EXPIRED

**Type:** String = "ERROR_PASSWORD_EXPIRED"

Password does match, but is expired.

### ERROR_PASSWORD_MISMATCH

**Type:** String = "ERROR_PASSWORD_MISMATCH"

the used password is not correct

### ERROR_UNKNOWN

**Type:** String = "ERROR_UNKNOWN"

Any other error

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