## Package: dw.customer

# Class Credentials

## Inheritance Hierarchy

- Object
  - dw.customer.Credentials

## Description

Represents the credentials of a customer. Since 13.6 it is possible to have customers who are not authenticated through a login and password but through an external authentication provider via the OAuth2 protocol. In such cases, the AuthenticationProviderID will point to an OAuth provider configured in the system and the ExternalID will be the unique identifier of the customer on the Authentication Provider's system. For example, if an authentication provider with ID "Google123" is configured pointing to Google and the customer has a logged in into Google in the past and has created a profile there, Google assigns a unique number identifier to that customer. If the storefront is configured to allow authentication through Google and a new customer logs into the storefront using Google, the AuthenticationProviderID property of his Credentials will contain "Google123" and the ExternalID property will contain whatever unique identifier Google has assigned to him. In such cases the password-related properties of the Credentials will be empty. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Properties

### authenticationProviderID

**Type:** String

The authentication provider ID.

### enabled

**Type:** boolean (Read Only)

Identifies if this customer is enabled and can log in.

### enabledFlag

**Type:** boolean

Identifies if this customer is enabled and can log in - same as isEnabled().

### externalID

**Type:** String

The external ID of the customer.

### locked

**Type:** boolean (Read Only)

Identifies if this customer is temporarily locked out because of invalid
 login attempts.  If customer locking is not enabled, this method always
 returns false.

### login

**Type:** String

The login of the user. It must be unique.

### passwordAnswer

**Type:** String

The answer to the password question for the customer. The answer is used
 with the password question to confirm the identity of a customer when
 they are trying to fetch their password.

### passwordQuestion

**Type:** String

The password question for the customer. The password question is
 used with the password answer to confirm the identity of a customer when
 they are trying to fetch their password.

### passwordSet

**Type:** boolean (Read Only)

Returns whether the password is set. Creating externally authenticated customers
 results in customers with credentials for which the password is not set.

### remainingLoginAttempts

**Type:** Number (Read Only)

The number of consecutive failed logins after which this customer
 will be temporarily locked out and prevented from logging in to the
 current site. This value is based on the number of previous invalid
 logins for this customer and customer site preferences defining the
 limits.

 If this customer is already locked out, this method will always return 0.
 If customer locking is disabled altogether, or if the system cannot
 determine the number of failed login attempts for this customer, then
 this method will return a negative number.

## Constructor Summary

## Method Summary

### createResetPasswordToken

**Signature:** `createResetPasswordToken() : String`

Generate a random token which can be used for resetting the password of the underlying Customer.

### getAuthenticationProviderID

**Signature:** `getAuthenticationProviderID() : String`

Returns the authentication provider ID.

### getEnabledFlag

**Signature:** `getEnabledFlag() : boolean`

Identifies if this customer is enabled and can log in - same as isEnabled().

### getExternalID

**Signature:** `getExternalID() : String`

Returns the external ID of the customer.

### getLogin

**Signature:** `getLogin() : String`

Returns the login of the user.

### getPasswordAnswer

**Signature:** `getPasswordAnswer() : String`

Returns the answer to the password question for the customer.

### getPasswordQuestion

**Signature:** `getPasswordQuestion() : String`

Returns the password question for the customer.

### getRemainingLoginAttempts

**Signature:** `getRemainingLoginAttempts() : Number`

Returns the number of consecutive failed logins after which this customer will be temporarily locked out and prevented from logging in to the current site.

### isEnabled

**Signature:** `isEnabled() : boolean`

Identifies if this customer is enabled and can log in.

### isLocked

**Signature:** `isLocked() : boolean`

Identifies if this customer is temporarily locked out because of invalid login attempts.

### isPasswordSet

**Signature:** `isPasswordSet() : boolean`

Returns whether the password is set.

### setAuthenticationProviderID

**Signature:** `setAuthenticationProviderID(authenticationProviderID : String) : void`

Sets the authentication provider ID corresponding to an OAuth provider configured in the system.

### setEnabledFlag

**Signature:** `setEnabledFlag(enabledFlag : boolean) : void`

Sets the enabled status of the customer.

### setExternalID

**Signature:** `setExternalID(externalID : String) : void`

Sets the external ID of the customer at the authentication provider.

### setLogin

**Signature:** `setLogin(login : String) : void`

Sets the login value for the customer.

### setLogin

**Signature:** `setLogin(newLogin : String, currentPassword : String) : boolean`

Sets the login value for the customer, and also re-encrypt the customer password based on the new login.

### setPassword

**Signature:** `setPassword(newPassword : String, oldPassword : String, verifyOldPassword : boolean) : Status`

Sets the password of an authenticated customer. The method can be called for externally authenticated customers as well but these customers will still be externally authenticated so calling the method for such customers does not have an immediate practical benefit.

### setPasswordAnswer

**Signature:** `setPasswordAnswer(answer : String) : void`

Sets the answer to the password question for the customer.

### setPasswordQuestion

**Signature:** `setPasswordQuestion(question : String) : void`

Sets the password question for the customer.

### setPasswordWithToken

**Signature:** `setPasswordWithToken(token : String, newPassword : String) : Status`

Set the password of the specified customer to the specified value.

## Method Detail

## Method Details

### createResetPasswordToken

**Signature:** `createResetPasswordToken() : String`

**Description:** Generate a random token which can be used for resetting the password of the underlying Customer. The token is guaranteed to be unique and will be valid for 30 minutes. Any token previously generated for this customer will be invalidated.

**Returns:**

The generated token.

---

### getAuthenticationProviderID

**Signature:** `getAuthenticationProviderID() : String`

**Description:** Returns the authentication provider ID.

**Deprecated:**

As of release 17.2, replaced by methods on the new class ExternalProfile which can be obtained from Customer.getExternalProfiles() Until the method is fully removed from the API it will get the Authentication Provider from the first element of the Customer.getExternalProfiles() collection

**Returns:**

the authentication provider ID.

---

### getEnabledFlag

**Signature:** `getEnabledFlag() : boolean`

**Description:** Identifies if this customer is enabled and can log in - same as isEnabled().

**Returns:**

true if the customer is enabled and can log in, false otherwise.

---

### getExternalID

**Signature:** `getExternalID() : String`

**Description:** Returns the external ID of the customer.

**Deprecated:**

As of release 17.2, replaced by methods on the new class ExternalProfile which can be obtained from Customer.getExternalProfiles() Until the method is fully removed from the API it will get the External ID from the first element of the Customer.getExternalProfiles() collection

**Returns:**

the external ID of the customer.

---

### getLogin

**Signature:** `getLogin() : String`

**Description:** Returns the login of the user. It must be unique.

**Returns:**

the login of the user.

---

### getPasswordAnswer

**Signature:** `getPasswordAnswer() : String`

**Description:** Returns the answer to the password question for the customer. The answer is used with the password question to confirm the identity of a customer when they are trying to fetch their password.

**Returns:**

the answer to the password question for the customer.

---

### getPasswordQuestion

**Signature:** `getPasswordQuestion() : String`

**Description:** Returns the password question for the customer. The password question is used with the password answer to confirm the identity of a customer when they are trying to fetch their password.

**Returns:**

the password question for the customer.

---

### getRemainingLoginAttempts

**Signature:** `getRemainingLoginAttempts() : Number`

**Description:** Returns the number of consecutive failed logins after which this customer will be temporarily locked out and prevented from logging in to the current site. This value is based on the number of previous invalid logins for this customer and customer site preferences defining the limits. If this customer is already locked out, this method will always return 0. If customer locking is disabled altogether, or if the system cannot determine the number of failed login attempts for this customer, then this method will return a negative number.

**Returns:**

The number of consecutive failed logins after which this customer will be locked out.

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Identifies if this customer is enabled and can log in.

**Returns:**

true if the customer is enabled and can log in, false otherwise.

---

### isLocked

**Signature:** `isLocked() : boolean`

**Description:** Identifies if this customer is temporarily locked out because of invalid login attempts. If customer locking is not enabled, this method always returns false.

**Returns:**

true if the customer is locked, false otherwise.

---

### isPasswordSet

**Signature:** `isPasswordSet() : boolean`

**Description:** Returns whether the password is set. Creating externally authenticated customers results in customers with credentials for which the password is not set.

**Returns:**

true if the password is set.

---

### setAuthenticationProviderID

**Signature:** `setAuthenticationProviderID(authenticationProviderID : String) : void`

**Description:** Sets the authentication provider ID corresponding to an OAuth provider configured in the system.

**Deprecated:**

As of release 17.2, replaced by methods on the new class ExternalProfile which can be obtained from Customer.getExternalProfiles() Until the method is fully removed from the API it will set the Authentication Provider on the first element of the Customer.getExternalProfiles() collection if there is only one. It will create the collection and add an element if no elements are present. It will not change anything and will log an error if there are more than one elements in the collection.

**Parameters:**

- `authenticationProviderID`: the authentication Provider ID to set.

---

### setEnabledFlag

**Signature:** `setEnabledFlag(enabledFlag : boolean) : void`

**Description:** Sets the enabled status of the customer.

**Parameters:**

- `enabledFlag`: controls if a customer is enabled or not.

---

### setExternalID

**Signature:** `setExternalID(externalID : String) : void`

**Description:** Sets the external ID of the customer at the authentication provider. The value is provided by the authentication provider during the OAuth authentication and is unique within that provider.

**Deprecated:**

As of release 17.2, replaced by methods on the new class ExternalProfile which can be obtained from Customer.getExternalProfiles() Until the method is fully removed from the API it will set the ExternalID on the first element of the Customer.getExternalProfiles() collection if there is only one. It will create the collection and add an element if no elements are present. It will not change anything and will log an error if there are more than one elements in the collection.

**Parameters:**

- `externalID`: the external ID to set.

---

### setLogin

**Signature:** `setLogin(login : String) : void`

**Description:** Sets the login value for the customer. IMPORTANT: This method should no longer be used for the following reasons: It changes the login without re-encrypting the password. (The customer password is stored internally using a one-way encryption scheme which uses the login as one of its inputs. Therefore changing the login requires re-encrypting the password.) It does not validate the structure of the login to ensure that it only uses acceptable characters. It does not correctly prevent duplicate logins. If the passed login matches a different customer's login exactly, then this method will throw an exception. However, it does not prevent the creation of inexact matches, where two customers have a login differing only by alphabetic case (e.g. "JaneDoe" and "janedoe")

**Deprecated:**

Use setLogin(String, String)

**Parameters:**

- `login`: The login value for the customer.

---

### setLogin

**Signature:** `setLogin(newLogin : String, currentPassword : String) : boolean`

**Description:** Sets the login value for the customer, and also re-encrypt the customer password based on the new login. Customer login must be a sequence of letters, numbers, and the following characters: space, period, ampersand, underscore and dash. This method fails to set the login and returns false in the following cases: newLogin is of an invalid form (e.g. contains invalid characters). currentPassword is not the customer's correct password. newLogin is already in use by another customer (i.e. there is another customer in the system with the exact same login name or a name differing only by alphabetic case.) If newLogin is the same as the existing login, the method does nothing and returns true, regardless of whether currentPassword is the correct password.

**Parameters:**

- `newLogin`: The login value for the customer.
- `currentPassword`: The customer's current password in plain-text.

**Returns:**

true if setting the login succeeded, false otherwise.

---

### setPassword

**Signature:** `setPassword(newPassword : String, oldPassword : String, verifyOldPassword : boolean) : Status`

**Description:** Sets the password of an authenticated customer. The method can be called for externally authenticated customers as well but these customers will still be externally authenticated so calling the method for such customers does not have an immediate practical benefit. If such customers are converted back to regularly authenticated (via login and password) the new password will be used. Method call will fail under any of these conditions: customer is not registered customer is not authenticated verifyOldPassword=true && oldPassword is empty verifyOldPassword=true and oldPassword does not match the existing password newPassword is empty newPassword does not meet acceptance criteria

**Parameters:**

- `newPassword`: the new password
- `oldPassword`: the old password (optional, only needed if 'verifyOldPassword' is set to 'true'
- `verifyOldPassword`: whether the oldPassword should be verified

**Returns:**

Status the status of the operation (OK or ERROR). If status is Error, there will be additional information in the Status message

---

### setPasswordAnswer

**Signature:** `setPasswordAnswer(answer : String) : void`

**Description:** Sets the answer to the password question for the customer.

**Parameters:**

- `answer`: the answer to the password question.

---

### setPasswordQuestion

**Signature:** `setPasswordQuestion(question : String) : void`

**Description:** Sets the password question for the customer.

**Parameters:**

- `question`: the password question.

---

### setPasswordWithToken

**Signature:** `setPasswordWithToken(token : String, newPassword : String) : Status`

**Description:** Set the password of the specified customer to the specified value. This operation will fail if the specified token is invalid (i.e. not associated with the specified Customer), the token is expired, or the password does not satisfy system password requirements.

**Parameters:**

- `token`: The token required for performing the password reset.
- `newPassword`: The new password. Must meet all requirements for passwords

**Returns:**

Status the status of the operation (OK or ERROR). If status is Error, there will be additional information in the Status message

---