## Package: dw.util

# Class Geolocation

## Inheritance Hierarchy

- Object
  - dw.util.Geolocation

## Description

Read-only class representing a position on the earth (latitude and longitude) and information associated with that location (e.g. country, city, etc). The Commerce Cloud Digital system can provide geolocation information for a Request and this information can be used in customer group segmentation rules. Note: This class is not related to the store locator API (i.e. the GetNearestStores pipelet) which uses a static set of store locations loaded into the system by the merchant. This product includes GeoLite2 data created by MaxMind, available from http://www.maxmind.com.

## Properties

### available

**Type:** boolean (Read Only)

Returns 'true' if a valid GeoLocation was found for the IP address
 (meaning at least Latitude and Longitude were found), false otherwise.

### city

**Type:** String (Read Only)

Get the city name in English associated with this location.

### countryCode

**Type:** String (Read Only)

Get the ISO country code associated with this location.

### countryName

**Type:** String (Read Only)

Get the country name in English that the system associates with this location on the
 earth.

### latitude

**Type:** Number (Read Only)

Get the latitude coordinate associated with this location which is a
 number between -90.0 and +90.0.

### longitude

**Type:** Number (Read Only)

Get the longitude coordinate associated with this location which is a
 number between -180.0 and +180.0.

### metroCode

**Type:** String (Read Only)

Get the metro code associated with this location.

### postalCode

**Type:** String (Read Only)

Get the postal code associated with this location.

### regionCode

**Type:** String (Read Only)

Get the region (e.g. province or state) code for this location.

### regionName

**Type:** String (Read Only)

Get the region (e.g. province in state) name in English that the system
 associates with this location.

## Constructor Summary

Geolocation(countryCode : String, countryName : String, regionCode : String, regionName : String, metroCode : String, city : String, postalCode : String, latitude : Number, longitude : Number) Constructor for a Geolocation object

## Method Summary

### getCity

**Signature:** `getCity() : String`

Get the city name in English associated with this location.

### getCountryCode

**Signature:** `getCountryCode() : String`

Get the ISO country code associated with this location.

### getCountryName

**Signature:** `getCountryName() : String`

Get the country name in English that the system associates with this location on the earth.

### getLatitude

**Signature:** `getLatitude() : Number`

Get the latitude coordinate associated with this location which is a number between -90.0 and +90.0.

### getLongitude

**Signature:** `getLongitude() : Number`

Get the longitude coordinate associated with this location which is a number between -180.0 and +180.0.

### getMetroCode

**Signature:** `getMetroCode() : String`

Get the metro code associated with this location.

### getPostalCode

**Signature:** `getPostalCode() : String`

Get the postal code associated with this location.

### getRegionCode

**Signature:** `getRegionCode() : String`

Get the region (e.g.

### getRegionName

**Signature:** `getRegionName() : String`

Get the region (e.g.

### isAvailable

**Signature:** `isAvailable() : boolean`

Returns 'true' if a valid GeoLocation was found for the IP address (meaning at least Latitude and Longitude were found), false otherwise.

## Constructor Detail

## Method Detail

## Method Details

### getCity

**Signature:** `getCity() : String`

**Description:** Get the city name in English associated with this location.

**Returns:**

the city that the system associates with this location on the earth.

---

### getCountryCode

**Signature:** `getCountryCode() : String`

**Description:** Get the ISO country code associated with this location.

**Returns:**

The two-character ISO 3166-1 alpha code for the country.

---

### getCountryName

**Signature:** `getCountryName() : String`

**Description:** Get the country name in English that the system associates with this location on the earth.

**Returns:**

the country name that the system associates with this location on the earth.

---

### getLatitude

**Signature:** `getLatitude() : Number`

**Description:** Get the latitude coordinate associated with this location which is a number between -90.0 and +90.0.

**Returns:**

The latitude of the location as a floating point number.

---

### getLongitude

**Signature:** `getLongitude() : Number`

**Description:** Get the longitude coordinate associated with this location which is a number between -180.0 and +180.0.

**Returns:**

The longitude of the location as a floating point number.

---

### getMetroCode

**Signature:** `getMetroCode() : String`

**Description:** Get the metro code associated with this location.

**Returns:**

The metro code of the location if the location is in the US. See the Google AdWords API for returned values.

---

### getPostalCode

**Signature:** `getPostalCode() : String`

**Description:** Get the postal code associated with this location.

**Returns:**

The postal code of the location. Postal codes are not available for all countries. In some countries, this will only contain part of the postal code.

---

### getRegionCode

**Signature:** `getRegionCode() : String`

**Description:** Get the region (e.g. province or state) code for this location.

**Returns:**

This is a string up to three characters long containing the subdivision portion of the code.

---

### getRegionName

**Signature:** `getRegionName() : String`

**Description:** Get the region (e.g. province in state) name in English that the system associates with this location.

**Returns:**

the region name that the system associates with this location on the earth.

---

### isAvailable

**Signature:** `isAvailable() : boolean`

**Description:** Returns 'true' if a valid GeoLocation was found for the IP address (meaning at least Latitude and Longitude were found), false otherwise.

**Returns:**

'true' if a valid GeoLocation was found for the IP address (meaning at least Latitude and Longitude were found), false otherwise.

---