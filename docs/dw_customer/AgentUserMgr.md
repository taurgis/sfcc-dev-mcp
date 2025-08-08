## Package: dw.customer

# Class AgentUserMgr

## Inheritance Hierarchy

- Object
  - dw.customer.AgentUserMgr

## Description

Provides helper methods for handling agent user functionality (login and logout) Pay attention to appropriate legal and regulatory requirements related to this functionality.

## Constructor Summary

## Method Summary

### loginAgentUser

**Signature:** `static loginAgentUser(login : String, password : String) : Status`

Logs in an agent user (which for example is authorized to login on-behalf of a customer for instance to place an order).

### loginOnBehalfOfCustomer

**Signature:** `static loginOnBehalfOfCustomer(customer : Customer) : Status`

This method logs the specified customer into the current session if the current agent user has the functional permission 'Login_On_Behalf' in the current site.

### logoutAgentUser

**Signature:** `static logoutAgentUser() : Status`

Performs a logout of the agent user and the current customer which are attached to the current session.

## Method Detail

## Method Details

### loginAgentUser

**Signature:** `static loginAgentUser(login : String, password : String) : Status`

**Description:** Logs in an agent user (which for example is authorized to login on-behalf of a customer for instance to place an order). The login is only allowed during a secure protocol request (https) and only in the storefront context. The user must have the permission 'Login_Agent'. When the login is successful, a new session will be created. Any objects that need to be preserved in the session need to bet set on the session afterwards. A Status object is returned which signals whether the login was successful or not. In case of a login failure the status object contains the reason for this. See AgentUserStatusCodes for more information.

**Parameters:**

- `login`: the login name for the agent user.
- `password`: the password for the agent user.

**Returns:**

the login status (OK if successful, error code otherwise).

---

### loginOnBehalfOfCustomer

**Signature:** `static loginOnBehalfOfCustomer(customer : Customer) : Status`

**Description:** This method logs the specified customer into the current session if the current agent user has the functional permission 'Login_On_Behalf' in the current site. The dwcustomer cookie will not be set. The login is only allowed during a secure protocol request (https). A Status object is returned indicating whether the login was successful or not (and indicating the failure reason). See AgentUserStatusCodes for more information. Error conditions include: if the method is not called in the storefront context if the given customer is not a registered customer (anonymous) if the given customer is not registered for the current site if the given customer is disabled if there is no agent user at the current session if the agent user is not logged in if the agent user has not the functional permission 'Login_On_Behalf'

**Parameters:**

- `customer`: The customer, which should be logged instead of the agent user

**Returns:**

the login status (OK if successful, error code otherwise).

---

### logoutAgentUser

**Signature:** `static logoutAgentUser() : Status`

**Description:** Performs a logout of the agent user and the current customer which are attached to the current session. The logout is only allowed during a secure protocol request (https) and only in the storefront context.

**Returns:**

the logout status (OK if successful, error code otherwise).

---