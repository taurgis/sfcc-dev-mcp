## Package: dw.customer

# Class ExternalProfile

## Inheritance Hierarchy

- Object
  - dw.customer.ExternalProfile

## Description

Represents the credentials of a customer. Since 13.6 it is possible to have customers who are not authenticated through a login and password but through an external authentication provider via the OAuth2 protocol. In such cases, the AuthenticationProviderID will point to an OAuth provider configured in the system and the ExternalID will be the unique identifier of the customer on the Authentication Provider's system. For example, if an authentication provider with ID "Google123" is configured pointing to Google and the customer has a logged in into Google in the past and has created a profile there, Google assigns a unique number identifier to that customer. If the storefront is configured to allow authentication through Google and a new customer logs into the storefront using Google, the AuthenticationProviderID property of his Credentials will contain "Google123" and the ExternalID property will contain whatever unique identifier Google has assigned to him. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Properties

### authenticationProviderID

**Type:** String (Read Only)

The authentication provider ID.

### customer

**Type:** Customer (Read Only)

The customer object related to this profile.

### email

**Type:** String

The customer's email address.

### externalID

**Type:** String (Read Only)

The external ID.

### lastLoginTime

**Type:** Date (Read Only)

The last login time of the customer through the external provider

## Constructor Summary

## Method Summary

### getAuthenticationProviderID

**Signature:** `getAuthenticationProviderID() : String`

Returns the authentication provider ID.

### getCustomer

**Signature:** `getCustomer() : Customer`

Returns the customer object related to this profile.

### getEmail

**Signature:** `getEmail() : String`

Returns the customer's email address.

### getExternalID

**Signature:** `getExternalID() : String`

Returns the external ID.

### getLastLoginTime

**Signature:** `getLastLoginTime() : Date`

Returns the last login time of the customer through the external provider

### setEmail

**Signature:** `setEmail(email : String) : void`

Sets the customer's email address.

## Method Detail

## Method Details

### getAuthenticationProviderID

**Signature:** `getAuthenticationProviderID() : String`

**Description:** Returns the authentication provider ID.

**Returns:**

the authentication provider ID.

---

### getCustomer

**Signature:** `getCustomer() : Customer`

**Description:** Returns the customer object related to this profile.

**Returns:**

customer object related to profile.

---

### getEmail

**Signature:** `getEmail() : String`

**Description:** Returns the customer's email address.

**Returns:**

the customer's email address.

---

### getExternalID

**Signature:** `getExternalID() : String`

**Description:** Returns the external ID.

**Returns:**

the external ID.

---

### getLastLoginTime

**Signature:** `getLastLoginTime() : Date`

**Description:** Returns the last login time of the customer through the external provider

**Returns:**

the time, when the customer was last logged in through this external provider

---

### setEmail

**Signature:** `setEmail(email : String) : void`

**Description:** Sets the customer's email address.

**Parameters:**

- `email`: the customer's email address.

---