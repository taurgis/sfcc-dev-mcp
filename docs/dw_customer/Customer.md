## Package: dw.customer

# Class Customer

## Inheritance Hierarchy

- Object
  - dw.customer.Customer

## Description

Represents a customer.

## Properties

### activeData

**Type:** CustomerActiveData (Read Only)

The active data for this customer.

### addressBook

**Type:** AddressBook (Read Only)

The address book for the profile of this customer,
 or null if this customer has no profile, such as for an
 anonymous customer.

### anonymous

**Type:** boolean (Read Only)

Identifies if the customer is anonymous. An anonymous
 customer is the opposite of a registered customer.

### authenticated

**Type:** boolean (Read Only)

Identifies if the customer is authenticated. This method checks whether
 this customer is the customer associated with the session and than checks
 whether the session in an authenticated state.

 Note: The pipeline debugger will always show 'false' for this value
 regardless of whether the customer is authenticated or not.

### CDPData

**Type:** CustomerCDPData (Read Only)

The Salesforce CDP (Customer Data Platform) data for this customer.

### customerGroups

**Type:** Collection (Static) (Read Only)

The customer groups this customer is member of.
 
 Result contains static customer groups in storefront and job session
 Result contains dynamic customer groups in storefront  and job session.
 Dynamic customer groups referring session or request data are not available
 when processing the customer in a job session, or when this customer is not the customer assigned to the current session.
 
 Result contains system groups 'Everyone', 'Unregistered', 'Registered' for all customers in storefront and job sessions

### externallyAuthenticated

**Type:** boolean (Read Only)

Identifies if the customer is externally authenticated. An externally
 authenticated customer does not have the password stored in our system
 but logs in through an external OAuth provider (Google, Facebook, LinkedIn, etc.)

### externalProfiles

**Type:** Collection (Read Only)

A collection of any external profiles the customer may have

### globalPartyID

**Type:** String (Read Only)

The Global Party ID for the customer, if there is one.
 Global Party ID is created by Customer 360 and identifies a person across multiple systems.

### ID

**Type:** String (Read Only)

The unique, system generated ID of the customer.

### note

**Type:** String

The note for this customer, or null if this customer has no note, such as for an anonymous
 customer or when note has 0 length.

### orderHistory

**Type:** OrderHistory (Read Only)

The customer order history.

### profile

**Type:** Profile (Read Only)

The customer profile.

### registered

**Type:** boolean (Read Only)

Identifies if the customer is registered. A registered customer
 may or may not be authenticated. This method checks whether
 the user has a profile.

## Constructor Summary

## Method Summary

### createExternalProfile

**Signature:** `createExternalProfile(authenticationProviderId : String, externalId : String) : ExternalProfile`

Creates an externalProfile and attaches it to the list of external profiles for the customer

### getActiveData

**Signature:** `getActiveData() : CustomerActiveData`

Returns the active data for this customer.

### getAddressBook

**Signature:** `getAddressBook() : AddressBook`

Returns the address book for the profile of this customer, or null if this customer has no profile, such as for an anonymous customer.

### getCDPData

**Signature:** `getCDPData() : CustomerCDPData`

Returns the Salesforce CDP (Customer Data Platform) data for this customer.

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

Returns the customer groups this customer is member of.

### getExternalProfile

**Signature:** `getExternalProfile(authenticationProviderId : String, externalId : String) : ExternalProfile`

A convenience method for finding an external profile among the customer's external profiles collection

### getExternalProfiles

**Signature:** `getExternalProfiles() : Collection`

Returns a collection of any external profiles the customer may have

### getGlobalPartyID

**Signature:** `getGlobalPartyID() : String`

Returns the Global Party ID for the customer, if there is one.

### getID

**Signature:** `getID() : String`

Returns the unique, system generated ID of the customer.

### getNote

**Signature:** `getNote() : String`

Returns the note for this customer, or null if this customer has no note, such as for an anonymous customer or when note has 0 length.

### getOrderHistory

**Signature:** `getOrderHistory() : OrderHistory`

Returns the customer order history.

### getProductLists

**Signature:** `getProductLists(type : Number) : Collection`

Returns the product lists of the specified type.

### getProfile

**Signature:** `getProfile() : Profile`

Returns the customer profile.

### isAnonymous

**Signature:** `isAnonymous() : boolean`

Identifies if the customer is anonymous.

### isAuthenticated

**Signature:** `isAuthenticated() : boolean`

Identifies if the customer is authenticated.

### isExternallyAuthenticated

**Signature:** `isExternallyAuthenticated() : boolean`

Identifies if the customer is externally authenticated.

### isMemberOfAnyCustomerGroup

**Signature:** `isMemberOfAnyCustomerGroup(groupIDs : String...) : boolean`

Returns true if there exist CustomerGroup for all of the given IDs and the customer is member of at least one of that groups.

### isMemberOfCustomerGroup

**Signature:** `isMemberOfCustomerGroup(group : CustomerGroup) : boolean`

Returns true if the customer is member of the specified CustomerGroup.

### isMemberOfCustomerGroup

**Signature:** `isMemberOfCustomerGroup(groupID : String) : boolean`

Returns true if there is a CustomerGroup with such an ID and the customer is member of that group.

### isMemberOfCustomerGroups

**Signature:** `isMemberOfCustomerGroups(groupIDs : String...) : boolean`

Returns true if there exist CustomerGroup for all of the given IDs and the customer is member of all that groups.

### isRegistered

**Signature:** `isRegistered() : boolean`

Identifies if the customer is registered.

### removeExternalProfile

**Signature:** `removeExternalProfile(externalProfile : ExternalProfile) : void`

Removes an external profile from the customer

### setNote

**Signature:** `setNote(aValue : String) : void`

Sets the note for this customer.

## Method Detail

## Method Details

### createExternalProfile

**Signature:** `createExternalProfile(authenticationProviderId : String, externalId : String) : ExternalProfile`

**Description:** Creates an externalProfile and attaches it to the list of external profiles for the customer

**Parameters:**

- `authenticationProviderId`: the authenticationProviderId for the externalProfile
- `externalId`: the externalId for the external Profile

**Returns:**

the new externalProfile

---

### getActiveData

**Signature:** `getActiveData() : CustomerActiveData`

**Description:** Returns the active data for this customer.

**Returns:**

the active data for this customer.

---

### getAddressBook

**Signature:** `getAddressBook() : AddressBook`

**Description:** Returns the address book for the profile of this customer, or null if this customer has no profile, such as for an anonymous customer.

---

### getCDPData

**Signature:** `getCDPData() : CustomerCDPData`

**Description:** Returns the Salesforce CDP (Customer Data Platform) data for this customer.

**Returns:**

the Salesforce CDP data for this customer.

---

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

**Description:** Returns the customer groups this customer is member of. Result contains static customer groups in storefront and job session Result contains dynamic customer groups in storefront and job session. Dynamic customer groups referring session or request data are not available when processing the customer in a job session, or when this customer is not the customer assigned to the current session. Result contains system groups 'Everyone', 'Unregistered', 'Registered' for all customers in storefront and job sessions

**Returns:**

Collection of customer groups of this customer

---

### getExternalProfile

**Signature:** `getExternalProfile(authenticationProviderId : String, externalId : String) : ExternalProfile`

**Description:** A convenience method for finding an external profile among the customer's external profiles collection

**Parameters:**

- `authenticationProviderId`: the authenticationProviderId to look for
- `externalId`: the externalId to look for

**Returns:**

the externalProfile found among the customer's external profile or null if not found

---

### getExternalProfiles

**Signature:** `getExternalProfiles() : Collection`

**Description:** Returns a collection of any external profiles the customer may have

**Returns:**

a collection of any external profiles the customer may have

---

### getGlobalPartyID

**Signature:** `getGlobalPartyID() : String`

**Description:** Returns the Global Party ID for the customer, if there is one. Global Party ID is created by Customer 360 and identifies a person across multiple systems.

**Returns:**

The global party ID

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique, system generated ID of the customer.

**Returns:**

the ID of the customer.

---

### getNote

**Signature:** `getNote() : String`

**Description:** Returns the note for this customer, or null if this customer has no note, such as for an anonymous customer or when note has 0 length.

**Returns:**

the note for this customer.

---

### getOrderHistory

**Signature:** `getOrderHistory() : OrderHistory`

**Description:** Returns the customer order history.

**Returns:**

the customer order history.

---

### getProductLists

**Signature:** `getProductLists(type : Number) : Collection`

**Description:** Returns the product lists of the specified type.

**Parameters:**

- `type`: the type of product lists to return.

**Returns:**

the product lists of the specified type.

**See Also:**

ProductList

---

### getProfile

**Signature:** `getProfile() : Profile`

**Description:** Returns the customer profile.

**Returns:**

the customer profile.

---

### isAnonymous

**Signature:** `isAnonymous() : boolean`

**Description:** Identifies if the customer is anonymous. An anonymous customer is the opposite of a registered customer.

**Returns:**

true if the customer is anonymous, false otherwise. Note: this method handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

---

### isAuthenticated

**Signature:** `isAuthenticated() : boolean`

**Description:** Identifies if the customer is authenticated. This method checks whether this customer is the customer associated with the session and than checks whether the session in an authenticated state. Note: The pipeline debugger will always show 'false' for this value regardless of whether the customer is authenticated or not.

**Returns:**

true if the customer is authenticated, false otherwise.

---

### isExternallyAuthenticated

**Signature:** `isExternallyAuthenticated() : boolean`

**Description:** Identifies if the customer is externally authenticated. An externally authenticated customer does not have the password stored in our system but logs in through an external OAuth provider (Google, Facebook, LinkedIn, etc.)

**Returns:**

true if the customer is externally authenticated, false otherwise. Note: this method handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

---

### isMemberOfAnyCustomerGroup

**Signature:** `isMemberOfAnyCustomerGroup(groupIDs : String...) : boolean`

**Description:** Returns true if there exist CustomerGroup for all of the given IDs and the customer is member of at least one of that groups.

**Parameters:**

- `groupIDs`: A list of unique semantic customer group IDs.

**Returns:**

True if customer groups exist for the given IDs and the customer is member of at least one of that existing groups. False if none of customer groups exist or if the customer is not a member of any of that existing groups.

---

### isMemberOfCustomerGroup

**Signature:** `isMemberOfCustomerGroup(group : CustomerGroup) : boolean`

**Description:** Returns true if the customer is member of the specified CustomerGroup.

**Parameters:**

- `group`: Customer group

**Returns:**

True if customer is member of the group, otherwise false.

---

### isMemberOfCustomerGroup

**Signature:** `isMemberOfCustomerGroup(groupID : String) : boolean`

**Description:** Returns true if there is a CustomerGroup with such an ID and the customer is member of that group.

**Parameters:**

- `groupID`: The unique semantic customer group ID.

**Returns:**

True if a customer group with such an ID exist and the customer is member of that group. False if no such customer group exist or, if the group exist, the customer is not member of that group.

---

### isMemberOfCustomerGroups

**Signature:** `isMemberOfCustomerGroups(groupIDs : String...) : boolean`

**Description:** Returns true if there exist CustomerGroup for all of the given IDs and the customer is member of all that groups.

**Parameters:**

- `groupIDs`: A list of unique semantic customer group IDs.

**Returns:**

True if customer groups exist for all of the given IDs and the customer is member of all that groups. False if there is at least one ID for which no customer group exist or, if all groups exist, the customer is not member of all that groups.

---

### isRegistered

**Signature:** `isRegistered() : boolean`

**Description:** Identifies if the customer is registered. A registered customer may or may not be authenticated. This method checks whether the user has a profile.

**Returns:**

true if the customer is registered, false otherwise.

---

### removeExternalProfile

**Signature:** `removeExternalProfile(externalProfile : ExternalProfile) : void`

**Description:** Removes an external profile from the customer

**Parameters:**

- `externalProfile`: the externalProfile to be removed

---

### setNote

**Signature:** `setNote(aValue : String) : void`

**Description:** Sets the note for this customer. This is a no-op for an anonymous customer.

**Parameters:**

- `aValue`: the value of the note

---