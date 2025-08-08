## Package: dw.web

# Class CSRFProtection

## Inheritance Hierarchy

- Object
  - dw.web.CSRFProtection

## Description

Used to generate and validate CSRF tokens. CSRFProtection allows applications to protect themselves against CSRF attacks, using synchronizer tokens, a best practice. Once created, these tokens are tied to a user’s session and valid for 60 minutes. Usage: Adding CSRF token to forms: //CSRF token generation <form ... action=""> <input name="foo" value="bar"> <input name="${dw.web.CSRFProtection.getTokenName()}" value="${dw.web.CSRFProtection.generateToken()"> </form> Then, in scripts call: dw.web.CSRFProtection.validateRequest();

## Properties

### tokenName

**Type:** String (Read Only)

The system generated CSRF token name. Currently, this name is not user configurable. Must be used for
 validateRequest() to work

## Constructor Summary

## Method Summary

### generateToken

**Signature:** `static generateToken() : String`

Constructs a new unique CSRF token for this session.

### getTokenName

**Signature:** `static getTokenName() : String`

Returns the system generated CSRF token name.

### validateRequest

**Signature:** `static validateRequest() : boolean`

Verifies that a client request contains a valid CSRF token, and that the token has not expired.

## Method Detail

## Method Details

### generateToken

**Signature:** `static generateToken() : String`

**Description:** Constructs a new unique CSRF token for this session.

**Returns:**

a new CSRF token

---

### getTokenName

**Signature:** `static getTokenName() : String`

**Description:** Returns the system generated CSRF token name. Currently, this name is not user configurable. Must be used for validateRequest() to work

**Returns:**

System-generated CSRF token parameter name

---

### validateRequest

**Signature:** `static validateRequest() : boolean`

**Description:** Verifies that a client request contains a valid CSRF token, and that the token has not expired. Returns true if these conditions are met, and false otherwise

**Returns:**

true if request contains a valid CSRF token, false otherwise

---