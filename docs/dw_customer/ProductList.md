## Package: dw.customer

# Class ProductList

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.ProductList

## Description

Represents a list of products (and optionally a gift certificate) that is typically maintained by a customer. This class can be used to implement a number of different storefront features, e.g. shopping list, wish list and gift registry. A product list is always owned by a customer. The owner can be anonymous or a registered customer. The owner can be the person for which items from that list will be purchased (wish list). Or it can be a person who maintains the list, for example a gift registry, on behalf of the bridal couple. Each product list can have a registrant and a co-registrant. A registrant is typically associated with an event related product list such as a gift registry. It holds information about a person associated with the event such as a bride or groom. A shipping address can be associated with this product list to ship the items, e.g. to an event location. A post-event shipping address can be associated to ship items to which could not be delivered on event date. The product list can also hold information about the event date and event location.

## Constants

## Properties

### anonymous

**Type:** boolean (Read Only)

Returns true if this product list is owned by an anonymous customer.

### coRegistrant

**Type:** ProductListRegistrant (Read Only)

The ProductListRegistrant assigned to the coRegistrant attribute or null
 if this list has no co-registrant.

### currentShippingAddress

**Type:** CustomerAddress (Read Only)

This is a helper method typically used with an event related list.
 It provides the appropriate shipping address based on the eventDate.
 If the current date is after the eventDate, then the postEventShippingAddress
 is returned, otherwise the shippingAddress is returned.  If the eventDate
 is null, then null is returned.

### description

**Type:** String

A description text that, for example, explains the purpose of this product list.

### eventCity

**Type:** String

For event related uses (e.g. gift registry), this holds the event city.

### eventCountry

**Type:** String

For event related uses (e.g. gift registry), this holds the event country.

### eventDate

**Type:** Date

For event related uses (e.g. gift registry), this holds the date
 of the event.

### eventState

**Type:** String

For event related uses (e.g. gift registry), this holds the event state.

### eventType

**Type:** String

For event related uses (e.g. gift registry), this holds the type
 of event, e.g. Wedding, Baby Shower.

### exportStatus

**Type:** EnumValue (Read Only)

The export status of the product list.
 Possible values are: EXPORT_STATUS_NOTEXPORTED,
 EXPORT_STATUS_EXPORTED.

### giftCertificateItem

**Type:** ProductListItem (Read Only)

The item in the list that represents a gift certificate.

### ID

**Type:** String (Read Only)

The unique system generated ID of the object.

### items

**Type:** Collection (Read Only)

A collection containing all items in the list.

### lastExportTime

**Type:** Date (Read Only)

The date where this product list has been exported successfully
 the last time.

### name

**Type:** String

The name of this product list given by its owner.

### owner

**Type:** Customer (Read Only)

The customer that created and owns the product list.

### postEventShippingAddress

**Type:** CustomerAddress

The shipping address for purchases made after the event date.

### productItems

**Type:** Collection (Read Only)

A collection containing all items in the list that reference products.

### public

**Type:** boolean

A flag, typically used to determine if the object is searchable
 by other customers.

### publicItems

**Type:** Collection (Read Only)

A collection containing all items in the list that are flagged as public.

### purchases

**Type:** Collection (Read Only)

The aggregated purchases from all the individual items.

### registrant

**Type:** ProductListRegistrant (Read Only)

The ProductListRegistrant assigned to the registrant attribute or null
 if this list has no registrant.

### shippingAddress

**Type:** CustomerAddress

Return the address that should be used as the shipping address for purchases
 made from the list.

### type

**Type:** Number (Read Only)

An int representing the type of object (e.g. wish list,
 gift registry). This is set at object creation time.

## Constructor Summary

## Method Summary

### createCoRegistrant

**Signature:** `createCoRegistrant() : ProductListRegistrant`

Create a ProductListRegistrant and assign it to the coRegistrant attribute of the list.

### createGiftCertificateItem

**Signature:** `createGiftCertificateItem() : ProductListItem`

Create an item in the list that represents a gift certificate.

### createProductItem

**Signature:** `createProductItem(product : Product) : ProductListItem`

Create an item in the list that references the specified product.

### createRegistrant

**Signature:** `createRegistrant() : ProductListRegistrant`

Create a ProductListRegistrant and assign it to the registrant attribute of the list.

### getCoRegistrant

**Signature:** `getCoRegistrant() : ProductListRegistrant`

Returns the ProductListRegistrant assigned to the coRegistrant attribute or null if this list has no co-registrant.

### getCurrentShippingAddress

**Signature:** `getCurrentShippingAddress() : CustomerAddress`

This is a helper method typically used with an event related list.

### getDescription

**Signature:** `getDescription() : String`

Returns a description text that, for example, explains the purpose of this product list.

### getEventCity

**Signature:** `getEventCity() : String`

For event related uses (e.g.

### getEventCountry

**Signature:** `getEventCountry() : String`

For event related uses (e.g.

### getEventDate

**Signature:** `getEventDate() : Date`

For event related uses (e.g.

### getEventState

**Signature:** `getEventState() : String`

For event related uses (e.g.

### getEventType

**Signature:** `getEventType() : String`

For event related uses (e.g.

### getExportStatus

**Signature:** `getExportStatus() : EnumValue`

Returns the export status of the product list. Possible values are: EXPORT_STATUS_NOTEXPORTED, EXPORT_STATUS_EXPORTED.

### getGiftCertificateItem

**Signature:** `getGiftCertificateItem() : ProductListItem`

Returns the item in the list that represents a gift certificate.

### getID

**Signature:** `getID() : String`

Returns the unique system generated ID of the object.

### getItem

**Signature:** `getItem(ID : String) : ProductListItem`

Returns the item from the list that has the specified ID.

### getItems

**Signature:** `getItems() : Collection`

Returns a collection containing all items in the list.

### getLastExportTime

**Signature:** `getLastExportTime() : Date`

Returns the date where this product list has been exported successfully the last time.

### getName

**Signature:** `getName() : String`

Returns the name of this product list given by its owner.

### getOwner

**Signature:** `getOwner() : Customer`

Returns the customer that created and owns the product list.

### getPostEventShippingAddress

**Signature:** `getPostEventShippingAddress() : CustomerAddress`

Returns the shipping address for purchases made after the event date.

### getProductItems

**Signature:** `getProductItems() : Collection`

Returns a collection containing all items in the list that reference products.

### getPublicItems

**Signature:** `getPublicItems() : Collection`

Returns a collection containing all items in the list that are flagged as public.

### getPurchases

**Signature:** `getPurchases() : Collection`

Returns the aggregated purchases from all the individual items.

### getRegistrant

**Signature:** `getRegistrant() : ProductListRegistrant`

Returns the ProductListRegistrant assigned to the registrant attribute or null if this list has no registrant.

### getShippingAddress

**Signature:** `getShippingAddress() : CustomerAddress`

Return the address that should be used as the shipping address for purchases made from the list.

### getType

**Signature:** `getType() : Number`

Returns an int representing the type of object (e.g.

### isAnonymous

**Signature:** `isAnonymous() : boolean`

Returns true if this product list is owned by an anonymous customer.

### isPublic

**Signature:** `isPublic() : boolean`

A flag, typically used to determine if the object is searchable by other customers.

### removeCoRegistrant

**Signature:** `removeCoRegistrant() : void`

Removes the ProductListRegistrant assigned to the coRegistrant attribute.

### removeItem

**Signature:** `removeItem(item : ProductListItem) : void`

Removes the specified item from the list.

### removeRegistrant

**Signature:** `removeRegistrant() : void`

Removes the ProductListRegistrant assigned to the registrant attribute.

### setDescription

**Signature:** `setDescription(description : String) : void`

Set the description of this product list.

### setEventCity

**Signature:** `setEventCity(eventCity : String) : void`

Set the event city to which this product list is related.

### setEventCountry

**Signature:** `setEventCountry(eventCountry : String) : void`

Set the event country to which this product list is related.

### setEventDate

**Signature:** `setEventDate(eventDate : Date) : void`

Set the date of the event to which this product list is related.

### setEventState

**Signature:** `setEventState(eventState : String) : void`

Set the event state to which this product list is related.

### setEventType

**Signature:** `setEventType(eventType : String) : void`

Set the event type for which this product list was created by the owner.

### setName

**Signature:** `setName(name : String) : void`

Set the name of this product list.

### setPostEventShippingAddress

**Signature:** `setPostEventShippingAddress(address : CustomerAddress) : void`

This is typically used by an event related list (e.g.

### setPublic

**Signature:** `setPublic(flag : boolean) : void`

Makes this product list visible to other customers or hides it.

### setShippingAddress

**Signature:** `setShippingAddress(address : CustomerAddress) : void`

Associate an address, used as the shipping address for purchases made from the list.

## Method Detail

## Method Details

### createCoRegistrant

**Signature:** `createCoRegistrant() : ProductListRegistrant`

**Description:** Create a ProductListRegistrant and assign it to the coRegistrant attribute of the list. An exception is thrown if the list already has a coRegistrant assigned to it.

**Returns:**

the created ProductListRegistrant instance.

**Throws:**

CreateException - if one already exists

---

### createGiftCertificateItem

**Signature:** `createGiftCertificateItem() : ProductListItem`

**Description:** Create an item in the list that represents a gift certificate. A list may only contain a single gift certificate, so an exception is thrown if one already exists in the list.

**Returns:**

the created item.

**Throws:**

CreateException - if a gift certificate item already exists in the list.

---

### createProductItem

**Signature:** `createProductItem(product : Product) : ProductListItem`

**Description:** Create an item in the list that references the specified product.

**Parameters:**

- `product`: the product to use to create the list item.

**Returns:**

the created item.

---

### createRegistrant

**Signature:** `createRegistrant() : ProductListRegistrant`

**Description:** Create a ProductListRegistrant and assign it to the registrant attribute of the list. An exception is thrown if the list already has a registrant assigned to it.

**Returns:**

the created ProductListRegistrant instance.

**Throws:**

CreateException - if one already exists

---

### getCoRegistrant

**Signature:** `getCoRegistrant() : ProductListRegistrant`

**Description:** Returns the ProductListRegistrant assigned to the coRegistrant attribute or null if this list has no co-registrant.

**Returns:**

the ProductListRegistrant assigned to the coRegistrant attribute or null if this list has no co-registrant.

---

### getCurrentShippingAddress

**Signature:** `getCurrentShippingAddress() : CustomerAddress`

**Description:** This is a helper method typically used with an event related list. It provides the appropriate shipping address based on the eventDate. If the current date is after the eventDate, then the postEventShippingAddress is returned, otherwise the shippingAddress is returned. If the eventDate is null, then null is returned.

**Returns:**

the appropriate address, as described above.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns a description text that, for example, explains the purpose of this product list.

**Returns:**

a description text explaining the purpose of this product list. Returns an empty string if the description is not set.

---

### getEventCity

**Signature:** `getEventCity() : String`

**Description:** For event related uses (e.g. gift registry), this holds the event city.

**Returns:**

the event city. The event city or an empty string if no event city is set.

---

### getEventCountry

**Signature:** `getEventCountry() : String`

**Description:** For event related uses (e.g. gift registry), this holds the event country.

**Returns:**

the event country. The event country or an empty string if no event country is set.

---

### getEventDate

**Signature:** `getEventDate() : Date`

**Description:** For event related uses (e.g. gift registry), this holds the date of the event.

**Returns:**

the date of the event.

---

### getEventState

**Signature:** `getEventState() : String`

**Description:** For event related uses (e.g. gift registry), this holds the event state.

**Returns:**

the event state. The event state or an empty string if no event state is set.

---

### getEventType

**Signature:** `getEventType() : String`

**Description:** For event related uses (e.g. gift registry), this holds the type of event, e.g. Wedding, Baby Shower.

**Returns:**

the type of event. Returns an empty string, if not set.

---

### getExportStatus

**Signature:** `getExportStatus() : EnumValue`

**Description:** Returns the export status of the product list. Possible values are: EXPORT_STATUS_NOTEXPORTED, EXPORT_STATUS_EXPORTED.

**Returns:**

Product list export status

---

### getGiftCertificateItem

**Signature:** `getGiftCertificateItem() : ProductListItem`

**Description:** Returns the item in the list that represents a gift certificate.

**Returns:**

the gift certificate item, or null if it doesn't exist.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique system generated ID of the object.

**Returns:**

the ID of object.

---

### getItem

**Signature:** `getItem(ID : String) : ProductListItem`

**Description:** Returns the item from the list that has the specified ID.

**Parameters:**

- `ID`: the product list item identifier.

**Returns:**

the specified item, or null if it's not found in the list.

---

### getItems

**Signature:** `getItems() : Collection`

**Description:** Returns a collection containing all items in the list.

**Returns:**

all items.

---

### getLastExportTime

**Signature:** `getLastExportTime() : Date`

**Description:** Returns the date where this product list has been exported successfully the last time.

**Returns:**

The time of the last successful export or null if this product list was not exported yet.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of this product list given by its owner.

**Returns:**

the name of this product list. Returns an empty string if the name is not set.

---

### getOwner

**Signature:** `getOwner() : Customer`

**Description:** Returns the customer that created and owns the product list.

**Returns:**

Owning customer

---

### getPostEventShippingAddress

**Signature:** `getPostEventShippingAddress() : CustomerAddress`

**Description:** Returns the shipping address for purchases made after the event date.

**Returns:**

the shipping address for purchases made after the event date. Returns null if no post-event shipping address is associated.

---

### getProductItems

**Signature:** `getProductItems() : Collection`

**Description:** Returns a collection containing all items in the list that reference products.

**Returns:**

all product items.

---

### getPublicItems

**Signature:** `getPublicItems() : Collection`

**Description:** Returns a collection containing all items in the list that are flagged as public.

**Returns:**

all public items.

---

### getPurchases

**Signature:** `getPurchases() : Collection`

**Description:** Returns the aggregated purchases from all the individual items.

**Returns:**

purchases

---

### getRegistrant

**Signature:** `getRegistrant() : ProductListRegistrant`

**Description:** Returns the ProductListRegistrant assigned to the registrant attribute or null if this list has no registrant.

**Returns:**

the ProductListRegistrant assigned to the registrant attribute or null if this list has no registrant.

---

### getShippingAddress

**Signature:** `getShippingAddress() : CustomerAddress`

**Description:** Return the address that should be used as the shipping address for purchases made from the list.

**Returns:**

the shipping address. The shipping address of this list or null if no address is associated.

---

### getType

**Signature:** `getType() : Number`

**Description:** Returns an int representing the type of object (e.g. wish list, gift registry). This is set at object creation time.

**Returns:**

the type of object.

---

### isAnonymous

**Signature:** `isAnonymous() : boolean`

**Description:** Returns true if this product list is owned by an anonymous customer.

**Returns:**

true if the owner of this product list is anonymous, false otherwise.

---

### isPublic

**Signature:** `isPublic() : boolean`

**Description:** A flag, typically used to determine if the object is searchable by other customers.

**Returns:**

true if the product list is public. False otherwise.

---

### removeCoRegistrant

**Signature:** `removeCoRegistrant() : void`

**Description:** Removes the ProductListRegistrant assigned to the coRegistrant attribute.

---

### removeItem

**Signature:** `removeItem(item : ProductListItem) : void`

**Description:** Removes the specified item from the list. This will also cause all purchase information associated with that item to be removed.

**Parameters:**

- `item`: The item to remove.

---

### removeRegistrant

**Signature:** `removeRegistrant() : void`

**Description:** Removes the ProductListRegistrant assigned to the registrant attribute.

---

### setDescription

**Signature:** `setDescription(description : String) : void`

**Description:** Set the description of this product list.

**Parameters:**

- `description`: The description of this product list. The description can have up to 256 characters, longer descriptions get truncated. If an empty string is provided, the description gets set to null.

---

### setEventCity

**Signature:** `setEventCity(eventCity : String) : void`

**Description:** Set the event city to which this product list is related.

**Parameters:**

- `eventCity`: The event city can have up to 256 characters, longer event city get truncated. If an empty string is provided, the event city gets set to null.

---

### setEventCountry

**Signature:** `setEventCountry(eventCountry : String) : void`

**Description:** Set the event country to which this product list is related.

**Parameters:**

- `eventCountry`: The event country can have up to 256 characters, longer event country get truncated. If an empty string is provided, the event country gets set to null.

---

### setEventDate

**Signature:** `setEventDate(eventDate : Date) : void`

**Description:** Set the date of the event to which this product list is related.

**Parameters:**

- `eventDate`: The event date or null if no event date should be available.

---

### setEventState

**Signature:** `setEventState(eventState : String) : void`

**Description:** Set the event state to which this product list is related.

**Parameters:**

- `eventState`: The event state can have up to 256 characters, longer event state get truncated. If an empty string is provided, the event state gets set to null.

---

### setEventType

**Signature:** `setEventType(eventType : String) : void`

**Description:** Set the event type for which this product list was created by the owner.

**Parameters:**

- `eventType`: The event type can have up to 256 characters, longer event type get truncated. If an empty string is provided, the event type gets set to null.

---

### setName

**Signature:** `setName(name : String) : void`

**Description:** Set the name of this product list.

**Parameters:**

- `name`: The name of this product list. The name can have up to 256 characters, longer names get truncated. If an empty string is provided, the name gets set to null.

---

### setPostEventShippingAddress

**Signature:** `setPostEventShippingAddress(address : CustomerAddress) : void`

**Description:** This is typically used by an event related list (e.g. gift registry) to specify a shipping address for purchases made after the event date.

**Parameters:**

- `address`: The shipping address.

---

### setPublic

**Signature:** `setPublic(flag : boolean) : void`

**Description:** Makes this product list visible to other customers or hides it.

**Parameters:**

- `flag`: If true, this product list becomes visible to other customers. If false, this product list can only be seen and searched by its owner.

---

### setShippingAddress

**Signature:** `setShippingAddress(address : CustomerAddress) : void`

**Description:** Associate an address, used as the shipping address for purchases made from the list.

**Parameters:**

- `address`: The shipping address.

---