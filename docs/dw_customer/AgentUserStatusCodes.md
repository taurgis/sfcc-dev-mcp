## Package: dw.customer

# Class AgentUserStatusCodes

## Inheritance Hierarchy

- Object
  - dw.customer.AgentUserStatusCodes

## Description

AgentUserStatusCodes contains constants representing status codes that can be used with a Status object to indicate the success or failure of the agent user login process.

## Constants

### AGENT_USER_NOT_AVAILABLE

**Type:** String = "AGENT_USER_NOT_AVAILABLE"

Indicates that the agent user is not available.

### AGENT_USER_NOT_LOGGED_IN

**Type:** String = "AGENT_USER_NOT_LOGGED_IN"

Indicates that the agent user is not logged in.

### CREDENTIALS_INVALID

**Type:** String = "CREDENTIALS_INVALID"

Indicates that the given agent user login or password was wrong.

### CUSTOMER_DISABLED

**Type:** String = "CUSTOMER_DISABLED"

Indicates that the customer is disabled.

### CUSTOMER_UNREGISTERED

**Type:** String = "CUSTOMER_UNREGISTERED"

Indicates that the customer is either not registered or not registered with the current site.

### INSECURE_CONNECTION

**Type:** String = "INSECURE_CONNECTION"

Indicates that the current connection is not secure (HTTP instead of HTTPS) and the server is configured to require a secure connection.

### INSUFFICIENT_PERMISSION

**Type:** String = "INSUFFICIENT_PERMISSION"

Indicates that the given agent user does not have the permission 'Login_Agent' which is required to login to the storefront as an agent user.

### LOGIN_SUCCESSFUL

**Type:** String = "LOGIN_SUCCESSFUL"

Indicates that the agent user login was successful.

### NO_STOREFRONT

**Type:** String = "NO_STOREFRONT"

Indicates that the current context is not a storefront request.

### PASSWORD_EXPIRED

**Type:** String = "PASSWORD_EXPIRED"

Indicates that the given agent user password has expired and needs to be changed in the Business Manager.

### USER_DISABLED

**Type:** String = "USER_DISABLED"

Indicates that the agent user account has been disabled in the Business Manager.

### USER_LOCKED

**Type:** String = "USER_LOCKED"

Indicates that the agent user account is locked, because the maximum number of failed login attempts was exceeded.

## Properties

## Constructor Summary

AgentUserStatusCodes()

## Method Summary

## Constructor Detail