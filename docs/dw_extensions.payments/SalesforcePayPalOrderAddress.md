## Package: dw.extensions.payments

# Class SalesforcePayPalOrderAddress

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePayPalOrderAddress

## Description

Salesforce Payments representation of a PayPal order address object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### addressLine1

**Type:** String (Read Only)

The address line 1.

### addressLine2

**Type:** String (Read Only)

The address line 2.

### adminArea1

**Type:** String (Read Only)

The address highest level sub-division in a country, which is usually a province, state, or ISO-3166-2
 subdivision.

### adminArea2

**Type:** String (Read Only)

The address city, town, or village.

### countryCode

**Type:** String (Read Only)

The address two-character ISO 3166-1 code that identifies the country or region.

### fullName

**Type:** String (Read Only)

The address full name.

### postalCode

**Type:** String (Read Only)

The address postal code.

## Constructor Summary

## Method Summary

### getAddressLine1

**Signature:** `getAddressLine1() : String`

Returns the address line 1.

### getAddressLine2

**Signature:** `getAddressLine2() : String`

Returns the address line 2.

### getAdminArea1

**Signature:** `getAdminArea1() : String`

Returns the address highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision.

### getAdminArea2

**Signature:** `getAdminArea2() : String`

Returns the address city, town, or village.

### getCountryCode

**Signature:** `getCountryCode() : String`

Returns the address two-character ISO 3166-1 code that identifies the country or region.

### getFullName

**Signature:** `getFullName() : String`

Returns the address full name.

### getPostalCode

**Signature:** `getPostalCode() : String`

Returns the address postal code.

## Method Detail

## Method Details

### getAddressLine1

**Signature:** `getAddressLine1() : String`

**Description:** Returns the address line 1.

**Returns:**

address line 1

---

### getAddressLine2

**Signature:** `getAddressLine2() : String`

**Description:** Returns the address line 2.

**Returns:**

address line 2

---

### getAdminArea1

**Signature:** `getAdminArea1() : String`

**Description:** Returns the address highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision.

**Returns:**

address highest level sub-division in a country, such as a state

---

### getAdminArea2

**Signature:** `getAdminArea2() : String`

**Description:** Returns the address city, town, or village.

**Returns:**

address city, town, or village

---

### getCountryCode

**Signature:** `getCountryCode() : String`

**Description:** Returns the address two-character ISO 3166-1 code that identifies the country or region.

**Returns:**

address country code

---

### getFullName

**Signature:** `getFullName() : String`

**Description:** Returns the address full name.

**Returns:**

address full name

---

### getPostalCode

**Signature:** `getPostalCode() : String`

**Description:** Returns the address postal code.

**Returns:**

address postal code

---