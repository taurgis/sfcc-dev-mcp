## Package: dw.customer

# Class CustomerAddress

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.CustomerAddress

## Description

The Address class represents a customer's address. Note: this class allows access to sensitive personal and private information. Pay attention to appropriate legal and regulatory requirements.

## Properties

### address1

**Type:** String

The customer's first address.

### address2

**Type:** String

The customer's second address value.

### city

**Type:** String

The customer's city.

### companyName

**Type:** String

The customer's company name.

### countryCode

**Type:** EnumValue

The customer's country code. Commerce Cloud Digital supports two-character
 country codes per ISO 3166-1 alpha-2. See
 http://www.iso.org/iso/country_codes/iso_3166-faqs/iso_3166_faqs_general.htm
 for additional information.

### firstName

**Type:** String

The customer's first name.

### fullName

**Type:** String (Read Only)

A concatenation of the customer's first, middle,
 and last names and its suffix.

### ID

**Type:** String

The name of the address.

### jobTitle

**Type:** String

The customer's job title.

### lastName

**Type:** String

The customer's last name.

### phone

**Type:** String

The customer's phone number.

### postalCode

**Type:** String

The customer's postal code.

### postBox

**Type:** String

The customer's post box.

### salutation

**Type:** String

The customer's salutation.

### secondName

**Type:** String

The customer's second name.

### stateCode

**Type:** String

The customer's state.

### suffix

**Type:** String

The customer's suffix.

### suite

**Type:** String

The customer's suite.

### title

**Type:** String

The customer's title.

## Constructor Summary

## Method Summary

### getAddress1

**Signature:** `getAddress1() : String`

Returns the customer's first address.

### getAddress2

**Signature:** `getAddress2() : String`

Returns the customer's second address value.

### getCity

**Signature:** `getCity() : String`

Returns the customer's city.

### getCompanyName

**Signature:** `getCompanyName() : String`

Returns the customer's company name.

### getCountryCode

**Signature:** `getCountryCode() : EnumValue`

Returns the customer's country code.

### getFirstName

**Signature:** `getFirstName() : String`

Returns the customer's first name.

### getFullName

**Signature:** `getFullName() : String`

Returns a concatenation of the customer's first, middle, and last names and its suffix.

### getID

**Signature:** `getID() : String`

Returns the name of the address.

### getJobTitle

**Signature:** `getJobTitle() : String`

Returns the customer's job title.

### getLastName

**Signature:** `getLastName() : String`

Returns the customer's last name.

### getPhone

**Signature:** `getPhone() : String`

Returns the customer's phone number.

### getPostalCode

**Signature:** `getPostalCode() : String`

Returns the customer's postal code.

### getPostBox

**Signature:** `getPostBox() : String`

Returns the customer's post box.

### getSalutation

**Signature:** `getSalutation() : String`

Returns the customer's salutation.

### getSecondName

**Signature:** `getSecondName() : String`

Returns the customer's second name.

### getStateCode

**Signature:** `getStateCode() : String`

Returns the customer's state.

### getSuffix

**Signature:** `getSuffix() : String`

Returns the customer's suffix.

### getSuite

**Signature:** `getSuite() : String`

Returns the customer's suite.

### getTitle

**Signature:** `getTitle() : String`

Returns the customer's title.

### isEquivalentAddress

**Signature:** `isEquivalentAddress(address : Object) : boolean`

Returns true if the specified address is equivalent to this address.

### setAddress1

**Signature:** `setAddress1(value : String) : void`

Sets the value of the customer's first address.

### setAddress2

**Signature:** `setAddress2(value : String) : void`

Sets the customer's second address value.

### setCity

**Signature:** `setCity(city : String) : void`

Sets the customer's city.

### setCompanyName

**Signature:** `setCompanyName(companyName : String) : void`

Sets the customer's company name.

### setCountryCode

**Signature:** `setCountryCode(countryCode : String) : void`

Sets the customer's country code.

### setFirstName

**Signature:** `setFirstName(firstName : String) : void`

Sets the customer's first name.

### setID

**Signature:** `setID(value : String) : void`

Sets the address name.

### setJobTitle

**Signature:** `setJobTitle(jobTitle : String) : void`

Sets the customer's job title.

### setLastName

**Signature:** `setLastName(lastName : String) : void`

Sets the customer's last name.

### setPhone

**Signature:** `setPhone(phoneNumber : String) : void`

Sets the customer's phone number.

### setPostalCode

**Signature:** `setPostalCode(postalCode : String) : void`

Sets the customer's postal code.

### setPostBox

**Signature:** `setPostBox(postBox : String) : void`

Sets the customer's post box.

### setSaluation

**Signature:** `setSaluation(value : String) : void`

Sets the customer's salutation.

### setSalutation

**Signature:** `setSalutation(value : String) : void`

Sets the customer's salutation.

### setSecondName

**Signature:** `setSecondName(secondName : String) : void`

Sets the customer's second name.

### setStateCode

**Signature:** `setStateCode(state : String) : void`

Sets the customer's state.

### setSuffix

**Signature:** `setSuffix(suffix : String) : void`

Sets the customer's suffix.

### setSuite

**Signature:** `setSuite(value : String) : void`

Sets the customer's suite.

### setTitle

**Signature:** `setTitle(title : String) : void`

Sets the customer's title.

## Method Detail

## Method Details

### getAddress1

**Signature:** `getAddress1() : String`

**Description:** Returns the customer's first address.

**Returns:**

the first address value.

---

### getAddress2

**Signature:** `getAddress2() : String`

**Description:** Returns the customer's second address value.

**Returns:**

the value of the second address.

---

### getCity

**Signature:** `getCity() : String`

**Description:** Returns the customer's city.

**Returns:**

the customer's city.

---

### getCompanyName

**Signature:** `getCompanyName() : String`

**Description:** Returns the customer's company name.

**Returns:**

the company name.

---

### getCountryCode

**Signature:** `getCountryCode() : EnumValue`

**Description:** Returns the customer's country code. Commerce Cloud Digital supports two-character country codes per ISO 3166-1 alpha-2. See http://www.iso.org/iso/country_codes/iso_3166-faqs/iso_3166_faqs_general.htm for additional information.

**Returns:**

the two-digit country code.

---

### getFirstName

**Signature:** `getFirstName() : String`

**Description:** Returns the customer's first name.

**Returns:**

the customer first name.

---

### getFullName

**Signature:** `getFullName() : String`

**Description:** Returns a concatenation of the customer's first, middle, and last names and its suffix.

**Returns:**

a concatenation of the customer's first, middle, and last names and its suffix.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the name of the address.

**Returns:**

the address name.

---

### getJobTitle

**Signature:** `getJobTitle() : String`

**Description:** Returns the customer's job title.

**Returns:**

the job title.

---

### getLastName

**Signature:** `getLastName() : String`

**Description:** Returns the customer's last name.

**Returns:**

the last name.

---

### getPhone

**Signature:** `getPhone() : String`

**Description:** Returns the customer's phone number.

**Returns:**

the phone number.

---

### getPostalCode

**Signature:** `getPostalCode() : String`

**Description:** Returns the customer's postal code.

**Returns:**

the postal code.

---

### getPostBox

**Signature:** `getPostBox() : String`

**Description:** Returns the customer's post box.

**Returns:**

the post box.

---

### getSalutation

**Signature:** `getSalutation() : String`

**Description:** Returns the customer's salutation.

**Returns:**

the salutation.

---

### getSecondName

**Signature:** `getSecondName() : String`

**Description:** Returns the customer's second name.

**Returns:**

the second name.

---

### getStateCode

**Signature:** `getStateCode() : String`

**Description:** Returns the customer's state.

**Returns:**

the state.

---

### getSuffix

**Signature:** `getSuffix() : String`

**Description:** Returns the customer's suffix.

**Returns:**

the suffix.

---

### getSuite

**Signature:** `getSuite() : String`

**Description:** Returns the customer's suite.

**Returns:**

the suite.

---

### getTitle

**Signature:** `getTitle() : String`

**Description:** Returns the customer's title.

**Returns:**

the title.

---

### isEquivalentAddress

**Signature:** `isEquivalentAddress(address : Object) : boolean`

**Description:** Returns true if the specified address is equivalent to this address. An equivalent address is an address whose core attributes contain the same values. The core attributes are: address1 address2 city companyName countryCode firstName lastName postalCode postBox stateCode

**Parameters:**

- `address`: the address to test.

**Returns:**

true if the specified address is equivalent to this address, false otherwise.

---

### setAddress1

**Signature:** `setAddress1(value : String) : void`

**Description:** Sets the value of the customer's first address.

**Parameters:**

- `value`: The value to set.

---

### setAddress2

**Signature:** `setAddress2(value : String) : void`

**Description:** Sets the customer's second address value.

**Parameters:**

- `value`: The value to set.

---

### setCity

**Signature:** `setCity(city : String) : void`

**Description:** Sets the customer's city.

**Parameters:**

- `city`: the customer's city to set.

---

### setCompanyName

**Signature:** `setCompanyName(companyName : String) : void`

**Description:** Sets the customer's company name.

**Parameters:**

- `companyName`: the name of the company.

---

### setCountryCode

**Signature:** `setCountryCode(countryCode : String) : void`

**Description:** Sets the customer's country code. Commerce Cloud Digital supports two-character country codes per ISO 3166-1 alpha-2. See http://www.iso.org/iso/country_codes/iso_3166-faqs/iso_3166_faqs_general.htm for additional information.

**Parameters:**

- `countryCode`: the country code, must be no more than 2 characters or will be truncated.

---

### setFirstName

**Signature:** `setFirstName(firstName : String) : void`

**Description:** Sets the customer's first name.

**Parameters:**

- `firstName`: the customer's first name to set.

---

### setID

**Signature:** `setID(value : String) : void`

**Description:** Sets the address name.

**Parameters:**

- `value`: the name to use.

---

### setJobTitle

**Signature:** `setJobTitle(jobTitle : String) : void`

**Description:** Sets the customer's job title.

**Parameters:**

- `jobTitle`: The jobTitle to set.

---

### setLastName

**Signature:** `setLastName(lastName : String) : void`

**Description:** Sets the customer's last name.

**Parameters:**

- `lastName`: The last name to set.

---

### setPhone

**Signature:** `setPhone(phoneNumber : String) : void`

**Description:** Sets the customer's phone number. The length is restricted to 32 characters.

**Parameters:**

- `phoneNumber`: The phone number to set.

---

### setPostalCode

**Signature:** `setPostalCode(postalCode : String) : void`

**Description:** Sets the customer's postal code.

**Parameters:**

- `postalCode`: The postal code to set.

---

### setPostBox

**Signature:** `setPostBox(postBox : String) : void`

**Description:** Sets the customer's post box.

**Parameters:**

- `postBox`: The post box to set.

---

### setSaluation

**Signature:** `setSaluation(value : String) : void`

**Description:** Sets the customer's salutation.

**Deprecated:**

Use setSalutation(String)

**Parameters:**

- `value`: the salutation.

---

### setSalutation

**Signature:** `setSalutation(value : String) : void`

**Description:** Sets the customer's salutation.

**Parameters:**

- `value`: the salutation.

---

### setSecondName

**Signature:** `setSecondName(secondName : String) : void`

**Description:** Sets the customer's second name.

**Parameters:**

- `secondName`: The second name to set.

---

### setStateCode

**Signature:** `setStateCode(state : String) : void`

**Description:** Sets the customer's state.

**Parameters:**

- `state`: The state to set.

---

### setSuffix

**Signature:** `setSuffix(suffix : String) : void`

**Description:** Sets the customer's suffix.

**Parameters:**

- `suffix`: The suffix to set.

---

### setSuite

**Signature:** `setSuite(value : String) : void`

**Description:** Sets the customer's suite. The length is restricted to 32 characters.

**Parameters:**

- `value`: the suite to set.

---

### setTitle

**Signature:** `setTitle(title : String) : void`

**Description:** Sets the customer's title.

**Parameters:**

- `title`: The title to set.

---