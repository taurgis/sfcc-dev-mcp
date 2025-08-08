## Package: dw.catalog

# Class Store

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Store

## Description

Represents a store in Commerce Cloud Digital.

## Properties

### address1

**Type:** String (Read Only)

The address1 of the store.

### address2

**Type:** String (Read Only)

The address2 of the store.

### city

**Type:** String (Read Only)

The city of the store.

### countryCode

**Type:** EnumValue (Read Only)

The countryCode of the store.

### demandwarePosEnabled

**Type:** boolean (Read Only)

The demandwarePosEnabled flag for the store.
 Indicates that this store uses Commerce Cloud Store for point-of-sale.

### email

**Type:** String (Read Only)

The email of the store.

### fax

**Type:** String (Read Only)

The fax of the store.

### ID

**Type:** String (Read Only)

The ID of the store.

### image

**Type:** MediaFile (Read Only)

The store image.

### inventoryList

**Type:** ProductInventoryList (Read Only)

The inventory list the store is associated with. If the
 store is not associated with a inventory list, or the inventory list does not
 exist, the method returns null.

### inventoryListID

**Type:** String (Read Only)

The inventory list id the store is associated with. If the
 store is not associated with a inventory list, or the inventory list does not
 exist, the method returns null.

### latitude

**Type:** Number (Read Only)

The latitude of the store.

### longitude

**Type:** Number (Read Only)

The longitude of the store.

### name

**Type:** String (Read Only)

The name of the store.

### phone

**Type:** String (Read Only)

The phone of the store.

### posEnabled

**Type:** boolean (Read Only)

The posEnabled flag for the Store.
 Indicates that this store uses Commerce Cloud Store for point-of-sale.

### postalCode

**Type:** String (Read Only)

The postalCode of the store.

### stateCode

**Type:** String (Read Only)

The stateCode of the store.

### storeEvents

**Type:** MarkupText (Read Only)

The storeEvents of the store.

### storeGroups

**Type:** Collection (Read Only)

All the store groups this store belongs to.

### storeHours

**Type:** MarkupText (Read Only)

The storeHours of the store.

### storeLocatorEnabled

**Type:** boolean (Read Only)

The storeLocatorEnabled flag for the store.

## Constructor Summary

## Method Summary

### getAddress1

**Signature:** `getAddress1() : String`

Returns the address1 of the store.

### getAddress2

**Signature:** `getAddress2() : String`

Returns the address2 of the store.

### getCity

**Signature:** `getCity() : String`

Returns the city of the store.

### getCountryCode

**Signature:** `getCountryCode() : EnumValue`

Returns the countryCode of the store.

### getEmail

**Signature:** `getEmail() : String`

Returns the email of the store.

### getFax

**Signature:** `getFax() : String`

Returns the fax of the store.

### getID

**Signature:** `getID() : String`

Returns the ID of the store.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the store image.

### getInventoryList

**Signature:** `getInventoryList() : ProductInventoryList`

Returns the inventory list the store is associated with.

### getInventoryListID

**Signature:** `getInventoryListID() : String`

Returns the inventory list id the store is associated with.

### getLatitude

**Signature:** `getLatitude() : Number`

Returns the latitude of the store.

### getLongitude

**Signature:** `getLongitude() : Number`

Returns the longitude of the store.

### getName

**Signature:** `getName() : String`

Returns the name of the store.

### getPhone

**Signature:** `getPhone() : String`

Returns the phone of the store.

### getPostalCode

**Signature:** `getPostalCode() : String`

Returns the postalCode of the store.

### getStateCode

**Signature:** `getStateCode() : String`

Returns the stateCode of the store.

### getStoreEvents

**Signature:** `getStoreEvents() : MarkupText`

Returns the storeEvents of the store.

### getStoreGroups

**Signature:** `getStoreGroups() : Collection`

Returns all the store groups this store belongs to.

### getStoreHours

**Signature:** `getStoreHours() : MarkupText`

Returns the storeHours of the store.

### isDemandwarePosEnabled

**Signature:** `isDemandwarePosEnabled() : boolean`

Returns the demandwarePosEnabled flag for the store.

### isPosEnabled

**Signature:** `isPosEnabled() : boolean`

Returns the posEnabled flag for the Store.

### isStoreLocatorEnabled

**Signature:** `isStoreLocatorEnabled() : boolean`

Returns the storeLocatorEnabled flag for the store.

## Method Detail

## Method Details

### getAddress1

**Signature:** `getAddress1() : String`

**Description:** Returns the address1 of the store.

**Returns:**

address1 of the store

---

### getAddress2

**Signature:** `getAddress2() : String`

**Description:** Returns the address2 of the store.

**Returns:**

address2 of the store

---

### getCity

**Signature:** `getCity() : String`

**Description:** Returns the city of the store.

**Returns:**

city of the store

---

### getCountryCode

**Signature:** `getCountryCode() : EnumValue`

**Description:** Returns the countryCode of the store.

**Returns:**

countryCode of the store

---

### getEmail

**Signature:** `getEmail() : String`

**Description:** Returns the email of the store.

**Returns:**

email of the store

---

### getFax

**Signature:** `getFax() : String`

**Description:** Returns the fax of the store.

**Returns:**

fax of the store

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the store.

**Returns:**

ID of the store

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the store image.

**Returns:**

the store image.

---

### getInventoryList

**Signature:** `getInventoryList() : ProductInventoryList`

**Description:** Returns the inventory list the store is associated with. If the store is not associated with a inventory list, or the inventory list does not exist, the method returns null.

**Returns:**

ProductInventoryList or null

---

### getInventoryListID

**Signature:** `getInventoryListID() : String`

**Description:** Returns the inventory list id the store is associated with. If the store is not associated with a inventory list, or the inventory list does not exist, the method returns null.

**Returns:**

the inventory list id

---

### getLatitude

**Signature:** `getLatitude() : Number`

**Description:** Returns the latitude of the store.

**Returns:**

latitude of the store

---

### getLongitude

**Signature:** `getLongitude() : Number`

**Description:** Returns the longitude of the store.

**Returns:**

longitude of the store

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the store.

**Returns:**

name of the store

---

### getPhone

**Signature:** `getPhone() : String`

**Description:** Returns the phone of the store.

**Returns:**

phone of the store

---

### getPostalCode

**Signature:** `getPostalCode() : String`

**Description:** Returns the postalCode of the store.

**Returns:**

postalCode of the store

---

### getStateCode

**Signature:** `getStateCode() : String`

**Description:** Returns the stateCode of the store.

**Returns:**

stateCode of the store

---

### getStoreEvents

**Signature:** `getStoreEvents() : MarkupText`

**Description:** Returns the storeEvents of the store.

**Returns:**

storeEvents of the store

---

### getStoreGroups

**Signature:** `getStoreGroups() : Collection`

**Description:** Returns all the store groups this store belongs to.

**Returns:**

collection of store groups

---

### getStoreHours

**Signature:** `getStoreHours() : MarkupText`

**Description:** Returns the storeHours of the store.

**Returns:**

storeHours of the store

---

### isDemandwarePosEnabled

**Signature:** `isDemandwarePosEnabled() : boolean`

**Description:** Returns the demandwarePosEnabled flag for the store. Indicates that this store uses Commerce Cloud Store for point-of-sale.

**Deprecated:**

Use isPosEnabled() instead

**Returns:**

the demandwarePosEnabled flag

---

### isPosEnabled

**Signature:** `isPosEnabled() : boolean`

**Description:** Returns the posEnabled flag for the Store. Indicates that this store uses Commerce Cloud Store for point-of-sale.

**Returns:**

the posEnabled flag

---

### isStoreLocatorEnabled

**Signature:** `isStoreLocatorEnabled() : boolean`

**Description:** Returns the storeLocatorEnabled flag for the store.

**Returns:**

the storeLocatorEnabled flag

---