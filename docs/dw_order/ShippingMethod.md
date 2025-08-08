## Package: dw.order

# Class ShippingMethod

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.ShippingMethod

## Description

ShippingMethod represents how the shipment will be shipped.

## Properties

### baseMethod

**Type:** ShippingMethod (Read Only)

The base shipping method or null if undefined.

### currencyCode

**Type:** String (Read Only)

The currency code associated with the shipping method

### customerGroups

**Type:** Collection (Read Only)

The customer groups assigned to the shipping method.
 Assigned ids that do not belong to an existing customer group are ignored.

### defaultMethod

**Type:** boolean (Read Only)

Returns 'true' if the shipping method is marked as 'default' for the current session's currency.
 Otherwise 'false' is returned.

### dependentMethods

**Type:** Collection (Read Only)

The dependent shipping methods of this shipping method,
 regardless of the online status of the methods. 
 Dependent shipping methods have this method as their base method.

### description

**Type:** String (Read Only)

The description of the shipping method as specified in the current locale or
 null if it could not be found.

### displayName

**Type:** String (Read Only)

The display name of the shipping method in the current locale or
 null if it could not be found.

### ID

**Type:** String (Read Only)

The ID of the shipping method.

### online

**Type:** boolean (Read Only)

Returns true if shipping method is online, false otherwise

### taxClassID

**Type:** String (Read Only)

The tax class id of the shipping method.

## Constructor Summary

## Method Summary

### getBaseMethod

**Signature:** `getBaseMethod() : ShippingMethod`

Returns the base shipping method or null if undefined.

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

Returns the currency code associated with the shipping method

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

Returns the customer groups assigned to the shipping method.

### getDependentMethods

**Signature:** `getDependentMethods() : Collection`

Returns the dependent shipping methods of this shipping method, regardless of the online status of the methods.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the shipping method as specified in the current locale or null if it could not be found.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of the shipping method in the current locale or null if it could not be found.

### getID

**Signature:** `getID() : String`

Returns the ID of the shipping method.

### getTaxClassID

**Signature:** `getTaxClassID() : String`

Returns the tax class id of the shipping method.

### isDefaultMethod

**Signature:** `isDefaultMethod() : boolean`

Returns 'true' if the shipping method is marked as 'default' for the current session's currency.

### isOnline

**Signature:** `isOnline() : boolean`

Returns true if shipping method is online, false otherwise

## Method Detail

## Method Details

### getBaseMethod

**Signature:** `getBaseMethod() : ShippingMethod`

**Description:** Returns the base shipping method or null if undefined.

**Returns:**

Base shipping method

---

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

**Description:** Returns the currency code associated with the shipping method

**Returns:**

currency code

---

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

**Description:** Returns the customer groups assigned to the shipping method. Assigned ids that do not belong to an existing customer group are ignored.

**Returns:**

customer groups

---

### getDependentMethods

**Signature:** `getDependentMethods() : Collection`

**Description:** Returns the dependent shipping methods of this shipping method, regardless of the online status of the methods. Dependent shipping methods have this method as their base method.

**Returns:**

Dependent shipping methods

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the shipping method as specified in the current locale or null if it could not be found.

**Returns:**

he description of the shipping method as specified in the current locale or null if it could not be found.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of the shipping method in the current locale or null if it could not be found.

**Returns:**

the display name of the shipping method or null if it could not be found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the shipping method.

**Returns:**

the ID of the shipping method.

---

### getTaxClassID

**Signature:** `getTaxClassID() : String`

**Description:** Returns the tax class id of the shipping method.

**Returns:**

the tax class id of the shipping method.

---

### isDefaultMethod

**Signature:** `isDefaultMethod() : boolean`

**Description:** Returns 'true' if the shipping method is marked as 'default' for the current session's currency. Otherwise 'false' is returned.

**Returns:**

'true' if it is the default shipping method of the site

---

### isOnline

**Signature:** `isOnline() : boolean`

**Description:** Returns true if shipping method is online, false otherwise

---