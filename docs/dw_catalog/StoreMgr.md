## Package: dw.catalog

# Class StoreMgr

## Inheritance Hierarchy

- Object
  - dw.catalog.StoreMgr

## Description

Provides helper methods for getting stores based on id and querying for stores based on geolocation.

## Properties

### allStoreGroups

**Type:** Collection (Read Only)

All the store groups of the current site.

### storeIDFromSession

**Type:** String (Read Only)

Get the store id associated with the current session. By default, the session store id is null.

## Constructor Summary

## Method Summary

### getAllStoreGroups

**Signature:** `static getAllStoreGroups() : Collection`

Returns all the store groups of the current site.

### getStore

**Signature:** `static getStore(storeID : String) : Store`

Returns the store object with the specified id or null if store with this id does not exist in the site.

### getStoreGroup

**Signature:** `static getStoreGroup(storeGroupID : String) : StoreGroup`

Returns the store group with the specified id or null if the store group with this id does not exist in the current site.

### getStoreIDFromSession

**Signature:** `static getStoreIDFromSession() : String`

Get the store id associated with the current session.

### searchStoresByCoordinates

**Signature:** `static searchStoresByCoordinates(latitude : Number, longitude : Number, distanceUnit : String, maxDistance : Number, queryString : String, args : Object...) : LinkedHashMap`

Search for stores based on geo-coordinates.

### searchStoresByCoordinates

**Signature:** `static searchStoresByCoordinates(latitude : Number, longitude : Number, distanceUnit : String, maxDistance : Number) : LinkedHashMap`

Convenience method.

### searchStoresByPostalCode

**Signature:** `static searchStoresByPostalCode(countryCode : String, postalCode : String, distanceUnit : String, maxDistance : Number, queryString : String, args : Object...) : LinkedHashMap`

Search for stores by country/postal code and optionally by additional filter criteria.

### searchStoresByPostalCode

**Signature:** `static searchStoresByPostalCode(countryCode : String, postalCode : String, distanceUnit : String, maxDistance : Number) : LinkedHashMap`

Convenience method.

### setStoreIDToSession

**Signature:** `static setStoreIDToSession(storeID : String) : void`

Set the store id for the current session.

## Method Detail

## Method Details

### getAllStoreGroups

**Signature:** `static getAllStoreGroups() : Collection`

**Description:** Returns all the store groups of the current site.

**Returns:**

The store groups of the current site.

---

### getStore

**Signature:** `static getStore(storeID : String) : Store`

**Description:** Returns the store object with the specified id or null if store with this id does not exist in the site.

**Parameters:**

- `storeID`: the store identifier.

**Returns:**

Store for specified id or null.

---

### getStoreGroup

**Signature:** `static getStoreGroup(storeGroupID : String) : StoreGroup`

**Description:** Returns the store group with the specified id or null if the store group with this id does not exist in the current site.

**Parameters:**

- `storeGroupID`: the store group identifier.

**Returns:**

The store group for specified id or null.

---

### getStoreIDFromSession

**Signature:** `static getStoreIDFromSession() : String`

**Description:** Get the store id associated with the current session. By default, the session store id is null.

**Returns:**

store id, null is returned and means no store id is set on session

---

### searchStoresByCoordinates

**Signature:** `static searchStoresByCoordinates(latitude : Number, longitude : Number, distanceUnit : String, maxDistance : Number, queryString : String, args : Object...) : LinkedHashMap`

**Description:** Search for stores based on geo-coordinates. The method returns a list of stores for the current site that are within a specified distance of a location on the earth and which optionally satisfy additional filter criteria. If no additional criteria are specified, then this method behaves similar to GetNearestStores pipelet. The criteria are specified as a querystring, using the same syntax as SystemObjectMgr.querySystemObjects(String, String, String, Object...) The stores and their distance from the specified location are returned as a LinkedHashMap of Store objects to distances, sorting in ascending order by distance. The distance is interpreted either in miles or kilometers depending on the "distanceUnit" parameter. The latitude and longitude of each store is determined by first looking at Store.getLatitude() and Store.getLongitude(). If these are not set, then the system deduces the location of the store by looking for a configured geolocation matching the store's postal and country codes.

**Parameters:**

- `latitude`: Latitude coordinate which is the center of the search area. Must not be null or an exception is thrown.
- `longitude`: Longitude coordinate which is the center of the search area. Must not be null or an exception is thrown.
- `distanceUnit`: The distance unit to be used for the calculation. Supported values are 'mi' and 'km' (for miles and kilometers respectively). If an invalid value is passed then 'km' will be used.
- `maxDistance`: Area (radius) in DistanceUnit where Stores will be searched for. If null is passed, a system default is used.
- `queryString`: optional filter criteria specified as querystring.
- `args`: the arguments to fill in the values in the querystring.

**Returns:**

The stores and their distance from the specified location, sorted in ascending order by distance.

---

### searchStoresByCoordinates

**Signature:** `static searchStoresByCoordinates(latitude : Number, longitude : Number, distanceUnit : String, maxDistance : Number) : LinkedHashMap`

**Description:** Convenience method. Same as searchStoresByCoordinates(latitude, longitude, distanceUnit, maxDistance, null).

**Parameters:**

- `latitude`: Latitude coordinate which is the center of the search area. Must not be null or an exception is thrown.
- `longitude`: Longitude coordinate which is the center of the search area. Must not be null or an exception is thrown.
- `distanceUnit`: The distance unit to be used for the calculation. Supported values are 'mi' and 'km' (for miles and kilometers respectively). If an invalid value is passed then 'km' will be used.
- `maxDistance`: Area (radius) in DistanceUnit where Stores will be searched for. If null is passed, a system default is used.

**Returns:**

The stores and their distance from the specified location, sorted in ascending order by distance.

---

### searchStoresByPostalCode

**Signature:** `static searchStoresByPostalCode(countryCode : String, postalCode : String, distanceUnit : String, maxDistance : Number, queryString : String, args : Object...) : LinkedHashMap`

**Description:** Search for stores by country/postal code and optionally by additional filter criteria. This method is analagous to searchStoresByCoordinates(Number, Number, String, Number, String, Object...) but identifies a location on the earth indirectly using country and postal code. The method will look first in the saved geolocations of the system to find a geolocation matching the passed country and postal code. If none is found, this method will return an empty map. If one is found, it will use the latitude/longitude of the found geolocation as the center of the search.

**Parameters:**

- `countryCode`: The country code for the search area, must not be null.
- `postalCode`: The postal code for the center of the search area, must not be null.
- `distanceUnit`: The distance unit to be used for the calculation. Supported values are 'mi' and 'km' (for miles and kilometers respectively). If an invalid value is passed then 'km' will be used.
- `maxDistance`: Area (radius) in DistanceUnit where Stores will be searched for. If null is passed, a system default is used.
- `queryString`: An optional search querystring which provides additional criteria to filter stores by.
- `args`: The arguments providing the dynamic values to the querystring.

**Returns:**

The stores and their distance from the specified location, sorted in ascending order by distance.

---

### searchStoresByPostalCode

**Signature:** `static searchStoresByPostalCode(countryCode : String, postalCode : String, distanceUnit : String, maxDistance : Number) : LinkedHashMap`

**Description:** Convenience method. Same as searchStoresByPostalCode(countryCode, postalCode, distanceUnit, maxDistance, null).

**Parameters:**

- `countryCode`: The country code for the search area, must not be null.
- `postalCode`: The postal code for the center of the search area, must not be null.
- `distanceUnit`: The distance unit to be used for the calculation. Supported values are 'mi' and 'km' (for miles and kilometers respectively). If an invalid value is passed then 'km' will be used.
- `maxDistance`: Area (radius) in DistanceUnit where Stores will be searched for. If null is passed, a system default is used.

**Returns:**

The stores and their distance from the specified location, sorted in ascending order by distance.

---

### setStoreIDToSession

**Signature:** `static setStoreIDToSession(storeID : String) : void`

**Description:** Set the store id for the current session. The store id is also saved on the cookie with the cookie name "dw_store" with no expiration time. Null is allowed to remove store id from session, when null is passed in, the cookie will be removed when browser exits.

**Parameters:**

- `storeID`: the id of the store. The leading and trailing white spaces are removed by system from storeID

---