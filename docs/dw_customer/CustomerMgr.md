## Package: dw.customer

# Class CustomerMgr

## Inheritance Hierarchy

- Object
  - dw.customer.CustomerMgr

## Description

Provides helper methods for managing customers and customer profiles. Note: this class allows access to sensitive information through operations that retrieve the Profile object. Pay attention to appropriate legal and regulatory requirements related to this data.

## Properties

### customerGroups

**Type:** Collection (Read Only)

The customer groups of the current site.

### passwordConstraints

**Type:** CustomerPasswordConstraints (Read Only)

An instance of CustomerPasswordConstraints
 for the customer list assigned to the current site.

### registeredCustomerCount

**Type:** Number (Read Only)

The number of registered customers in the system. This number can be used for reporting
 purposes.

### siteCustomerList

**Type:** CustomerList (Read Only)

The customer list of the current site.

## Constructor Summary

## Method Summary

### authenticateCustomer

**Signature:** `static authenticateCustomer(login : String, password : String) : AuthenticationStatus`

This method authenticates a customer using the supplied login and password.

### createCustomer

**Signature:** `static createCustomer(login : String, password : String) : Customer`

Creates a new Customer using the supplied login, password.

### createCustomer

**Signature:** `static createCustomer(login : String, password : String, customerNo : String) : Customer`

Creates a new Customer using the supplied login, password, and a customerNo.

### createExternallyAuthenticatedCustomer

**Signature:** `static createExternallyAuthenticatedCustomer(authenticationProviderId : String, externalId : String) : Customer`

Given an authentication provider Id and an external Id: creates a Customer record in the system if one does not exist already for the same 'authenticationProviderId' and 'externalId' pair.

### describeProfileType

**Signature:** `static describeProfileType() : ObjectTypeDefinition`

Returns the meta data for profiles.

### getCustomerByCustomerNumber

**Signature:** `static getCustomerByCustomerNumber(customerNumber : String) : Customer`

Returns the customer with the specified customer number.

### getCustomerByLogin

**Signature:** `static getCustomerByLogin(login : String) : Customer`

Returns the customer for the specified login name.

### getCustomerByToken

**Signature:** `static getCustomerByToken(token : String) : Customer`

Returns the customer associated with the specified password reset token.

### getCustomerGroup

**Signature:** `static getCustomerGroup(id : String) : CustomerGroup`

Returns the customer group with the specified ID or null if group does not exists.

### getCustomerGroups

**Signature:** `static getCustomerGroups() : Collection`

Returns the customer groups of the current site.

### getCustomerList

**Signature:** `static getCustomerList(id : String) : CustomerList`

Returns the customer list identified by the specified ID.

### getExternallyAuthenticatedCustomerProfile

**Signature:** `static getExternallyAuthenticatedCustomerProfile(authenticationProviderId : String, externalId : String) : Profile`

Given an authentication provider Id and external Id returns the Customer Profile in our system.

### getPasswordConstraints

**Signature:** `static getPasswordConstraints() : CustomerPasswordConstraints`

Returns an instance of CustomerPasswordConstraints for the customer list assigned to the current site.

### getProfile

**Signature:** `static getProfile(customerNumber : String) : Profile`

Returns the profile with the specified customer number.

### getRegisteredCustomerCount

**Signature:** `static getRegisteredCustomerCount() : Number`

Returns the number of registered customers in the system.

### getSiteCustomerList

**Signature:** `static getSiteCustomerList() : CustomerList`

Returns the customer list of the current site.

### isAcceptablePassword

**Signature:** `static isAcceptablePassword(password : String) : boolean`

Checks if the given password matches the password constraints (for example password length) of the current site's assigned customerlist.

### isPasswordExpired

**Signature:** `static isPasswordExpired(login : String) : boolean`

Checks if the password for the given customer is expired

### loginCustomer

**Signature:** `static loginCustomer(login : String, password : String, rememberMe : boolean) : Customer`

This method authenticates the current session using the supplied login and password.

### loginCustomer

**Signature:** `static loginCustomer(authStatus : AuthenticationStatus, rememberMe : boolean) : Customer`

This method logs in the authenticated customer (from a previous authenticateCustomer() call).

### loginExternallyAuthenticatedCustomer

**Signature:** `static loginExternallyAuthenticatedCustomer(authenticationProviderId : String, externalId : String, rememberMe : boolean) : Customer`

Logs in externally authenticated customer if it has already been created in the system and the profile is not disabled or locked

### logoutCustomer

**Signature:** `static logoutCustomer(rememberMe : boolean) : Customer`

Logs out the customer currently logged into the storefront.

### processProfiles

**Signature:** `static processProfiles(processFunction : Function, queryString : String, args : Object...) : void`

Executes a user-definable function on a set of customer profiles.

### queryProfile

**Signature:** `static queryProfile(queryString : String, args : Object...) : Profile`

Searches for a single profile instance.

### queryProfiles

**Signature:** `static queryProfiles(queryString : String, sortString : String, args : Object...) : SeekableIterator`

Searches for profile instances.

### queryProfiles

**Signature:** `static queryProfiles(queryAttributes : Map, sortString : String) : SeekableIterator`

Searches for profile instances.

### removeCustomer

**Signature:** `static removeCustomer(customer : Customer) : void`

Logs out the supplied customer and deletes the customer record.

### removeCustomerTrackingData

**Signature:** `static removeCustomerTrackingData(customer : Customer) : void`

Removes (asynchronously) tracking data for this customer (from external systems or data stores).

### searchProfile

**Signature:** `static searchProfile(queryString : String, args : Object...) : Profile`

Searches for a single profile instance.

### searchProfiles

**Signature:** `static searchProfiles(queryString : String, sortString : String, args : Object...) : SeekableIterator`

Searches for profile instances.

### searchProfiles

**Signature:** `static searchProfiles(queryAttributes : Map, sortString : String) : SeekableIterator`

Searches for profile instances.

## Method Detail

## Method Details

### authenticateCustomer

**Signature:** `static authenticateCustomer(login : String, password : String) : AuthenticationStatus`

**Description:** This method authenticates a customer using the supplied login and password. It will not log in the customer into the current session, but returns only a status indicating success or failure (with different error codes for the failure cases). Upon successful authentication (status code 'AUTH_OK') the status object also holds the authenticated customer. To continue the login process, call the loginCustomer(AuthenticationStatus, boolean) method. This method verifies that the password for the customer is not expired. If it is expired the authentication will fail, with a status code of ERROR_PASSWORD_EXPIRED. This allows the storefront to require the customer to change the password, and then the login can proceed.

**Parameters:**

- `login`: Login name, must not be null.
- `password`: Password, must not be null.

**Returns:**

the status of the authentication process

---

### createCustomer

**Signature:** `static createCustomer(login : String, password : String) : Customer`

**Description:** Creates a new Customer using the supplied login, password. The system automatically assigns a customer number based on the customer sequence numbers configured for the site or organization. The number is guaranteed to be unique, but is not guaranteed to be sequential. It can be higher or lower than a previously created number. As a result, sorting customers by customer number is not guaranteed to sort them in their order of creation. The method throws an exception if any of the following conditions are encountered: A Customer with the supplied Login already exists The Login is not acceptable. The Password is not acceptable. The system cannot create the Customer. A valid login name is between 1 and 256 characters in length (not counting leading or trailing whitespace), and may contain only the following characters: alphanumeric (Unicode letters or decimal digits) space period dash underscore @ Note: a storefront can be customized to provide further constraints on characters in a login name, but it cannot remove any constraints described above. If customers are created using this Script API call then any updated to the customer records should be done through Script API calls as well. The customer records created with Script API call should not be updated with OCAPI calls as the email validation is handled differently in these calls and may result in InvalidEmailException.

**Parameters:**

- `login`: The unique login name associated with the new customer and its profile, must not be null. If login is already in use, an exception will be thrown.
- `password`: Customer plain customer password, which is encrypted before it is stored at the profile, must not be null.

**Returns:**

customer The new customer object.

---

### createCustomer

**Signature:** `static createCustomer(login : String, password : String, customerNo : String) : Customer`

**Description:** Creates a new Customer using the supplied login, password, and a customerNo. If the customerNo is not specified, the system automatically assigns a customer number based on the customer sequence numbers configured for the site or organization. An automatically assigned number is guaranteed to be unique, but is not guaranteed to be sequential. It can be higher or lower than a previously created number. As a result, sorting customers by customer number is not guaranteed to sort them in their order of creation. The method throws an exception if any of the following conditions are encountered: A Customer with the supplied Login already exists A Customer with the explicitly provided or calculated customer number already exists. The Login is not acceptable. The Password is not acceptable. The system cannot create the Customer. A valid login name is between 1 and 256 characters in length (not counting leading or trailing whitespace), and may contain only the following characters: alphanumeric (Unicode letters or decimal digits) space period dash underscore @ Note: a storefront can be customized to provide further constraints on characters in a login name, but it cannot remove any constraints described above. A valid CustomerNo is between 1 and 100 characters in length (not counting leading or trailing whitespace). Commerce Cloud Digital recommends that a CustomerNo only contain characters valid for URLs. If customers are created using this Script API call then any updated to the customer records should be done through Script API calls as well. The customer records created with Script API call should not be updated with OCAPI calls as the email validation is handled differently in these calls and may result in InvalidEmailException.

**Parameters:**

- `login`: The unique login name associated with the new customer and its profile, must not be null. If login is already in use, an exception will be thrown.
- `password`: Customer plain customer password, which is encrypted before it is stored at the profile, must not be null.
- `customerNo`: The unique customerNo can be null, the system will then automatically assign a new value. If provided explicitly, the system will make sure that no other customer uses the same value and will throw an exception otherwise.

**Returns:**

customer The new customer object.

---

### createExternallyAuthenticatedCustomer

**Signature:** `static createExternallyAuthenticatedCustomer(authenticationProviderId : String, externalId : String) : Customer`

**Description:** Given an authentication provider Id and an external Id: creates a Customer record in the system if one does not exist already for the same 'authenticationProviderId' and 'externalId' pair. If one already exists - it is returned.

**Parameters:**

- `authenticationProviderId`: the Id of the authentication provider as configured in Commerce Cloud Digital.
- `externalId`: the Id of the customer at the authentication provider. Each authentication provider generates these in a different way, they are unique within their system

**Returns:**

On success: the created customer. On failure - null

---

### describeProfileType

**Signature:** `static describeProfileType() : ObjectTypeDefinition`

**Description:** Returns the meta data for profiles.

**Returns:**

the meta data for profiles.

---

### getCustomerByCustomerNumber

**Signature:** `static getCustomerByCustomerNumber(customerNumber : String) : Customer`

**Description:** Returns the customer with the specified customer number. If no customer with this customer number exists, null is returned.

**Parameters:**

- `customerNumber`: the customer number associated with the customer, must not be null.

**Returns:**

The customer if found, null otherwise

---

### getCustomerByLogin

**Signature:** `static getCustomerByLogin(login : String) : Customer`

**Description:** Returns the customer for the specified login name. If no customer with this login name exists, null is returned.

**Parameters:**

- `login`: the unique login name associated with the customer, must not be null.

**Returns:**

The customer if found, null otherwise

---

### getCustomerByToken

**Signature:** `static getCustomerByToken(token : String) : Customer`

**Description:** Returns the customer associated with the specified password reset token. A valid token is one that is associated with a customer record and is not expired. Such a token can be generated by Credentials.createResetPasswordToken(). If the passed token is valid, the associated customer is returned. Otherwise null is returned

**Parameters:**

- `token`: password reset token

**Returns:**

The customer associated with the token. Null if the token is invalid.

---

### getCustomerGroup

**Signature:** `static getCustomerGroup(id : String) : CustomerGroup`

**Description:** Returns the customer group with the specified ID or null if group does not exists.

**Parameters:**

- `id`: the customer group identifier.

**Returns:**

Customer group for ID or null

---

### getCustomerGroups

**Signature:** `static getCustomerGroups() : Collection`

**Description:** Returns the customer groups of the current site.

**Returns:**

Customer groups of current site.

---

### getCustomerList

**Signature:** `static getCustomerList(id : String) : CustomerList`

**Description:** Returns the customer list identified by the specified ID. Returns null if no customer list with the specified id exists. Note: Typically the ID of an automatically created customer list is equal to the ID of the site.

**Parameters:**

- `id`: The ID of the customer list.

**Returns:**

The CustomerList, or null if not found.

---

### getExternallyAuthenticatedCustomerProfile

**Signature:** `static getExternallyAuthenticatedCustomerProfile(authenticationProviderId : String, externalId : String) : Profile`

**Description:** Given an authentication provider Id and external Id returns the Customer Profile in our system.

**Parameters:**

- `authenticationProviderId`: the Id of the authentication provider as configured in Commerce Cloud Digital.
- `externalId`: the Id of the customer at the authentication provider. Each authentication provider generates these in a different way, they are unique within their system

**Returns:**

The Profile of the customer if found, null otherwise

---

### getPasswordConstraints

**Signature:** `static getPasswordConstraints() : CustomerPasswordConstraints`

**Description:** Returns an instance of CustomerPasswordConstraints for the customer list assigned to the current site.

**Returns:**

customer password constraints for current site

---

### getProfile

**Signature:** `static getProfile(customerNumber : String) : Profile`

**Description:** Returns the profile with the specified customer number.

**Parameters:**

- `customerNumber`: the customer number of the customer of the to be retrieved profile

**Returns:**

Profile for specified customer number

---

### getRegisteredCustomerCount

**Signature:** `static getRegisteredCustomerCount() : Number`

**Description:** Returns the number of registered customers in the system. This number can be used for reporting purposes.

**Returns:**

the number of registered customers in the system.

---

### getSiteCustomerList

**Signature:** `static getSiteCustomerList() : CustomerList`

**Description:** Returns the customer list of the current site.

**Returns:**

The customer list assigned to the current site.

---

### isAcceptablePassword

**Signature:** `static isAcceptablePassword(password : String) : boolean`

**Description:** Checks if the given password matches the password constraints (for example password length) of the current site's assigned customerlist.

**Parameters:**

- `password`: the to be checked password

**Returns:**

true if the given password matches all required criteria

---

### isPasswordExpired

**Signature:** `static isPasswordExpired(login : String) : boolean`

**Description:** Checks if the password for the given customer is expired

**Parameters:**

- `login`: the login for the customer to be checked

**Returns:**

true if the password is expired

---

### loginCustomer

**Signature:** `static loginCustomer(login : String, password : String, rememberMe : boolean) : Customer`

**Description:** This method authenticates the current session using the supplied login and password. If a different customer is currently authenticated in the session, then this customer is "logged out" and her/his privacy and form data are deleted. If the authentication with the given credentials fails, then null is returned and no changes to the session are made. The authentication will be sucessful even when the password of the customer is already expired (according to the customer list settings). If the input value "RememberMe" is set to true, this method stores a cookie on the customer's machine which will be used to identify the customer when the next session is initiated. The cookie is set to expire in 180 days (i.e. 6 months). Note that a customer who is remembered is not automatically authenticated and will have to explicitly log in to access any personal information.

**Deprecated:**

use authenticateCustomer(login, password) and loginCustomer(authStatus, rememberMe) instead since they correctly check for expired passwords

**Parameters:**

- `login`: Login name, must not be null.
- `password`: Password, must not be null.
- `rememberMe`: Boolean value indicating if the customer wants to be remembered on the current computer. If a value of true is supplied a cookie identifying the customer is stored upon successful login. If a value of false, or a null value, is supplied, then no cookie is stored and any existing cookie is removed.

**Returns:**

Customer successfully authenticated customer. Null if the authentication with the given credentials fails.

---

### loginCustomer

**Signature:** `static loginCustomer(authStatus : AuthenticationStatus, rememberMe : boolean) : Customer`

**Description:** This method logs in the authenticated customer (from a previous authenticateCustomer() call). If a different customer is currently authenticated in the session, then this customer is "logged out" and all privacy-relevant data and all form data are deleted. If the previous authentication was not successful, then null is returned and no changes to the session are made. If the input value "RememberMe" is set to true, this method stores a cookie on the customer's machine which will be used to identify the customer when the next session is initiated. The cookie is set to expire in 180 days (i.e. 6 months). Note that a customer who is remembered is not automatically authenticated and will have to explicitly log in to access any personal information.

**Parameters:**

- `authStatus`: the authentication status from the previous authenticateCustomer call
- `rememberMe`: Boolean value indicating if the customer wants to be remembered on the current computer. If a value of true is supplied a cookie identifying the customer is stored upon successful login. If a value of false, or a null value, is supplied, then no cookie is stored and any existing cookie is removed.

**Returns:**

Customer successfully authenticated customer. Null if the authentication status was not indicating success of the authentication.

---

### loginExternallyAuthenticatedCustomer

**Signature:** `static loginExternallyAuthenticatedCustomer(authenticationProviderId : String, externalId : String, rememberMe : boolean) : Customer`

**Description:** Logs in externally authenticated customer if it has already been created in the system and the profile is not disabled or locked

**Parameters:**

- `authenticationProviderId`: the Id of the authentication provider as configured in Commerce Cloud Digital.
- `externalId`: the Id of the customer at the authentication provider.
- `rememberMe`: whether to drop the remember me cookie

**Returns:**

Customer if found in the system and not disabled or locked. getExternallyAuthenticatedCustomerProfile(String, String)

---

### logoutCustomer

**Signature:** `static logoutCustomer(rememberMe : boolean) : Customer`

**Description:** Logs out the customer currently logged into the storefront. The boolean value "RememberMe" indicates, if the customer would like to be remembered on the current browser. If a value of true is supplied, the customer authentication state is set to "not logged in" and additionally the following session data is removed: the customer session private data, the form status data, dictionary information of interaction continue nodes, basket reference information, the secure token cookie. If the value is set to false or null, the complete session dictionary is cleaned up. The customer and anonymous cookie are removed and a new session cookie is set.

**Parameters:**

- `rememberMe`: Boolean value indicating if the customer wants to be remembered on the current browser. If a value of true is supplied, the customer authentication state is set to "not logged in" and additionally the following session data is removed: the customer session private data, the form status data, dictionary information of interaction continue nodes, basket reference information, the secure token cookie. If the value is set to false or null, the complete session dictionary is cleaned up. The customer and anonymous cookie are removed and a new session cookie is set.

**Returns:**

the new customer identity after logout. If rememberMe is true, null is returned.

---

### processProfiles

**Signature:** `static processProfiles(processFunction : Function, queryString : String, args : Object...) : void`

**Description:** Executes a user-definable function on a set of customer profiles. This method is intended to be used in batch processes and jobs, since it allows efficient processing of large result sets (which might take a while to process). First, a search with the given parameters is executed. Then the given function is executed once for each profile of the search result. The profile is handed over as the only parameter to this function. The search can be configured using a simple query language, which provides most common filter and operator functionality. For a description of this query language, see the queryProfile(String, Object...) method. The callback function will be supplied with a single argument of type 'Profile'. When the callback function defines additional arguments, they will be undefined when the function is called. When the callback function doesn't define any arguments at all, it will be called anyway (no error will happen, but the function won't get a profile as parameter). Error during execution of the callback function will be logged, and execution will continue with the next element from the result set. This method can be used as in this example (which counts the number of men): var count=0; function callback(profile: Profile) { count++; dw.system.Logger.debug("customer found: "+profile.customerNo) } CustomerMgr.processProfiles(callback, "gender=1"); dw.system.Logger.debug("found "+count+" men in customer list");

**Parameters:**

- `processFunction`: the function to execute for each profile
- `queryString`: the query string to use when searching for a profile.
- `args`: the query string arguments.

---

### queryProfile

**Signature:** `static queryProfile(queryString : String, args : Object...) : Profile`

**Description:** Searches for a single profile instance. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Caseindependent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) If there is more than one object matching the specified query criteria, the result is not deterministic. In order to retrieve a single object from a sorted result set it is recommended to use the following code: queryProfiles("", "custom.myAttr asc", null).first(). The method first() returns only the next element and closes the iterator. This method is deprecated and will be removed in a future release. One of the following methods should be used instead: searchProfile(String, Object...), searchProfiles(Map, String) and searchProfiles(String, String, Object...) to search for customers and processProfiles(Function, String, Object...) to search and process customers in jobs.

**Deprecated:**

use searchProfile(String, Object...) instead.

**Parameters:**

- `queryString`: the query string to use when searching for a profile.
- `args`: the query string arguments.

**Returns:**

the profile which was found when executing the queryString.

---

### queryProfiles

**Signature:** `static queryProfiles(queryString : String, sortString : String, args : Object...) : SeekableIterator`

**Description:** Searches for profile instances. The search can be configured using a simple query language, which provides most common filter and operator functionality. For a description of this query language, see the queryProfile(String, Object...) method. This method is deprecated and will be removed in a future release. One of the following methods should be used instead: searchProfile(String, Object...), searchProfiles(Map, String) and searchProfiles(String, String, Object...) to search for customers and processProfiles(Function, String, Object...) to search and process customers in jobs.

**Deprecated:**

use searchProfiles(String, String, Object...) instead.

**Parameters:**

- `queryString`: the actual query.
- `sortString`: an optional sorting or null if no sorting is necessary.
- `args`: optional parameters for the query string.

**Returns:**

SeekableIterator containing the result set of the query.

---

### queryProfiles

**Signature:** `static queryProfiles(queryAttributes : Map, sortString : String) : SeekableIterator`

**Description:** Searches for profile instances. The search can be configured with a map, which key-value pairs are converted into a query expression. The key-value pairs are turned into a sequence of '=' or 'like' conditions, which are combined with AND statements. Example: A map with the key/value pairs: 'name'/'tom*', 'age'/66 will be converted as follows: "name like 'tom*' and age = 66" The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources. See SeekableIterator.close() This method is deprecated and will be removed in a future release. One of the following methods should be used instead: searchProfile(String, Object...), searchProfiles(Map, String) and searchProfiles(String, String, Object...) to search for customers and processProfiles(Function, String, Object...) to search and process customers in jobs.

**Deprecated:**

use searchProfiles(Map, String) instead.

**Parameters:**

- `queryAttributes`: key-value pairs that define the query.
- `sortString`: an optional sorting or null if no sorting is necessary.

**Returns:**

SeekableIterator containing the result set of the query.

---

### removeCustomer

**Signature:** `static removeCustomer(customer : Customer) : void`

**Description:** Logs out the supplied customer and deletes the customer record. The customer must be a registered customer and the customer must currently be logged in. The customer must be logged in for security reasons to ensure that only the customer itself can remove itself from the system. While logout the customers session is reset to an anonymous session and, if present, the "Remember me" cookie of the customer is removed. Deleting the customer record includes the customer credentials, profile, address-book with all addresses, customer payment instruments, product lists and memberships in customer groups. Orders placed by this customer won't be deleted. If the supplied customer is not a registered customer or is not logged in, the API throws an exception

**Parameters:**

- `customer`: The customer to remove, must not be null.

---

### removeCustomerTrackingData

**Signature:** `static removeCustomerTrackingData(customer : Customer) : void`

**Description:** Removes (asynchronously) tracking data for this customer (from external systems or data stores). This will not remove the customer from the database, nor will it prevent tracking to start again in the future for this customer. The customer is identified by login / email /customerNo / cookie when its a registered customer, and by cookie when its an anonymous customer.

**Parameters:**

- `customer`: the customer

---

### searchProfile

**Signature:** `static searchProfile(queryString : String, args : Object...) : Profile`

**Description:** Searches for a single profile instance. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Caseindependent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) If there is more than one object matching the specified query criteria, the result is not deterministic. In order to retrieve a single object from a sorted result set it is recommended to use the following code: queryProfiles("", "custom.myAttr asc", null).first(). The method first() returns only the next element and closes the iterator. If the customer search API is configured to use the new Search Service, these differences apply: Search may match and return documents with missing (NULL) values in search fields, depending on how the query is structured, potentially leading to broader result sets. For example, a query like custom.searchField != "some value" also returns documents where custom.searchField is NULL — whereas in relational databases, such documents are excluded. Newly created customers might not be found immediately via the search service, and changes to existing customers might also not be in effect immediately (there is a slight delay in updating the index) Wildcards are filtered from the query (*, %, +) and replaced by spaces LIKE and ILIKE queries are executed as fulltext queries (working on whole words), not as substring searches LIKE queries are always case insensitive Using logical operators may change the execution of LIKE/ILIKE clauses to exact string comparison, depending on how they are combined Using logical operators may result in degraded performance, depending on how they are combined

**Parameters:**

- `queryString`: the query string to use when searching for a profile.
- `args`: the query string arguments.

**Returns:**

the profile which was found when executing the queryString.

---

### searchProfiles

**Signature:** `static searchProfiles(queryString : String, sortString : String, args : Object...) : SeekableIterator`

**Description:** Searches for profile instances. The search can be configured using a simple query language, which provides most common filter and operator functionality. For a description of this query language, see the searchProfile(String, Object...) method. If the customer search API is configured to use the new Search Service, these differences apply: Search may match and return documents with missing (NULL) values in search fields, depending on how the query is structured, potentially leading to broader result sets. For example, a query like custom.searchField != "some value" also returns documents where custom.searchField is NULL — whereas in relational databases, such documents are excluded. Newly created customers might not be found immediately via the search service, and changes to existing customers might also not be in effect immediately (there is a slight delay in updating the index) Wildcards are filtered from the query (*, %, +) and replaced by spaces LIKE and ILIKE queries are executed as fulltext queries (working on whole words), not as substring searches LIKE queries are always case insensitive Using logical operators may change the execution of LIKE/ILIKE clauses to exact string comparison, depending on how they are combined Using logical operators may result in degraded performance, depending on how they are combined The search returns only the first 1000 hits from the search result

**Parameters:**

- `queryString`: the actual query.
- `sortString`: an optional sorting or null if no sorting is necessary.
- `args`: optional parameters for the query string.

**Returns:**

SeekableIterator containing the result set of the query.

---

### searchProfiles

**Signature:** `static searchProfiles(queryAttributes : Map, sortString : String) : SeekableIterator`

**Description:** Searches for profile instances. The search can be configured with a map, which key-value pairs are converted into a query expression. The key-value pairs are turned into a sequence of '=' or 'like' conditions, which are combined with AND statements. Example: A map with the key/value pairs: 'name'/'tom*', 'age'/66 will be converted as follows: "name like 'tom*' and age = 66" The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources. SeekableIterator.close() If the customer search API is configured to use the new Search Service, these differences apply: Search may match and return documents with missing (NULL) values in search fields, depending on how the query is structured, potentially leading to broader result sets. For example, a query like custom.searchField != "some value" also returns documents where custom.searchField is NULL — whereas in relational databases, such documents are excluded. Newly created customers might not be found immediately via the search service, and changes to existing customers might also not be in effect immediately (there is a slight delay in updating the index) Wildcards are filtered from the query (*, %, +) and replaced by spaces LIKE and ILIKE queries are executed as fulltext queries (working on whole words), not as substring searches LIKE queries are always case insensitive Using logical operators may change the execution of LIKE/ILIKE clauses to exact string comparison, depending on how they are combined Using logical operators may result in degraded performance, depending on how they are combined The search returns only the first 1000 hits from the search result

**Parameters:**

- `queryAttributes`: key-value pairs that define the query.
- `sortString`: an optional sorting or null if no sorting is necessary.

**Returns:**

SeekableIterator containing the result set of the query.

---