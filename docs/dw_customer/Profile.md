## Package: dw.customer

# Class Profile

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.EncryptedObject
      - dw.customer.Profile

## Description

The class represents a customer profile. It also provides access to the customers address book and credentials. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Properties

### addressBook

**Type:** AddressBook (Read Only)

The customer's address book.

### birthday

**Type:** Date

The customer's birthday as a date.

### companyName

**Type:** String

The customer's company name.

### credentials

**Type:** Credentials (Read Only)

The customer's credentials.

### customer

**Type:** Customer (Read Only)

The customer object related to this profile.

### customerNo

**Type:** String (Read Only)

The customer's number, which is a number used to identify the Customer.

### email

**Type:** String

The customer's email address.

### fax

**Type:** String

The fax number to use for the customer.
 The length is restricted to 32 characters.

### female

**Type:** boolean (Read Only)

Indicates that the customer is female when set to true.

### firstName

**Type:** String

The customer's first name.

### gender

**Type:** EnumValue

The customer's gender.

### jobTitle

**Type:** String

The customer's job title.

### lastLoginTime

**Type:** Date (Read Only)

The last login time of the customer.

### lastName

**Type:** String

The customer's last name.

### lastVisitTime

**Type:** Date (Read Only)

The last visit time of the customer.

### male

**Type:** boolean (Read Only)

Indicates that the customer is male when set to true.

### nextBirthday

**Type:** Date (Read Only)

The upcoming customer's birthday as a date.
 If the customer already had birthday this year the method returns the birthday of the next year.
 Otherwise its birthday in this year.
 If the customer has not set a birthday this method returns null.

### phoneBusiness

**Type:** String

The business phone number to use for the customer.

### phoneHome

**Type:** String

The phone number to use for the customer.

### phoneMobile

**Type:** String

The mobile phone number to use for the customer.

### preferredLocale

**Type:** String

The customer's preferred locale.

### previousLoginTime

**Type:** Date (Read Only)

The time the customer logged in prior to the current login.

### previousVisitTime

**Type:** Date (Read Only)

The time the customer visited the store prior to the current visit.

### salutation

**Type:** String

The salutation to use for the customer.

### secondName

**Type:** String

The customer's second name.

### suffix

**Type:** String

The customer's suffix, such as "Jr." or "Sr.".

### taxID

**Type:** String

The tax ID value. The value is returned either plain
 text if the current context allows plain text access, or
 if it's not allowed, the ID value will be returned masked.
 The following criteria must be met in order to have plain text access:
 
 
 	the method call must happen in the context of a storefront request;
 	the current customer must be registered and authenticated;
 	it is the profile of the current customer;
  and the current protocol is HTTPS.

### taxIDMasked

**Type:** String (Read Only)

The masked value of the tax ID.

### taxIDType

**Type:** EnumValue

The tax ID type.

### title

**Type:** String

The customer's title, such as "Mrs" or "Mr".

### wallet

**Type:** Wallet (Read Only)

The wallet of this customer.

## Constructor Summary

## Method Summary

### getAddressBook

**Signature:** `getAddressBook() : AddressBook`

Returns the customer's address book.

### getBirthday

**Signature:** `getBirthday() : Date`

Returns the customer's birthday as a date.

### getCompanyName

**Signature:** `getCompanyName() : String`

Returns the customer's company name.

### getCredentials

**Signature:** `getCredentials() : Credentials`

Returns the customer's credentials.

### getCustomer

**Signature:** `getCustomer() : Customer`

Returns the customer object related to this profile.

### getCustomerNo

**Signature:** `getCustomerNo() : String`

Returns the customer's number, which is a number used to identify the Customer.

### getEmail

**Signature:** `getEmail() : String`

Returns the customer's email address.

### getFax

**Signature:** `getFax() : String`

Returns the fax number to use for the customer.

### getFirstName

**Signature:** `getFirstName() : String`

Returns the customer's first name.

### getGender

**Signature:** `getGender() : EnumValue`

Returns the customer's gender.

### getJobTitle

**Signature:** `getJobTitle() : String`

Returns the customer's job title.

### getLastLoginTime

**Signature:** `getLastLoginTime() : Date`

Returns the last login time of the customer.

### getLastName

**Signature:** `getLastName() : String`

Returns the customer's last name.

### getLastVisitTime

**Signature:** `getLastVisitTime() : Date`

Returns the last visit time of the customer.

### getNextBirthday

**Signature:** `getNextBirthday() : Date`

Returns the upcoming customer's birthday as a date.

### getPhoneBusiness

**Signature:** `getPhoneBusiness() : String`

Returns the business phone number to use for the customer.

### getPhoneHome

**Signature:** `getPhoneHome() : String`

Returns the phone number to use for the customer.

### getPhoneMobile

**Signature:** `getPhoneMobile() : String`

Returns the mobile phone number to use for the customer.

### getPreferredLocale

**Signature:** `getPreferredLocale() : String`

Returns the customer's preferred locale.

### getPreviousLoginTime

**Signature:** `getPreviousLoginTime() : Date`

Returns the time the customer logged in prior to the current login.

### getPreviousVisitTime

**Signature:** `getPreviousVisitTime() : Date`

Returns the time the customer visited the store prior to the current visit.

### getSalutation

**Signature:** `getSalutation() : String`

Returns the salutation to use for the customer.

### getSecondName

**Signature:** `getSecondName() : String`

Returns the customer's second name.

### getSuffix

**Signature:** `getSuffix() : String`

Returns the customer's suffix, such as "Jr." or "Sr.".

### getTaxID

**Signature:** `getTaxID() : String`

Returns the tax ID value.

### getTaxIDMasked

**Signature:** `getTaxIDMasked() : String`

Returns the masked value of the tax ID.

### getTaxIDType

**Signature:** `getTaxIDType() : EnumValue`

Returns the tax ID type.

### getTitle

**Signature:** `getTitle() : String`

Returns the customer's title, such as "Mrs" or "Mr".

### getWallet

**Signature:** `getWallet() : Wallet`

Returns the wallet of this customer.

### isFemale

**Signature:** `isFemale() : boolean`

Indicates that the customer is female when set to true.

### isMale

**Signature:** `isMale() : boolean`

Indicates that the customer is male when set to true.

### setBirthday

**Signature:** `setBirthday(aValue : Date) : void`

Sets the customer's birthday as a date.

### setCompanyName

**Signature:** `setCompanyName(aValue : String) : void`

Sets the customer's company name.

### setEmail

**Signature:** `setEmail(aValue : String) : void`

Sets the customer's email address.

### setFax

**Signature:** `setFax(number : String) : void`

Sets the fax number to use for the customer.

### setFirstName

**Signature:** `setFirstName(aValue : String) : void`

Sets the customer's first name.

### setGender

**Signature:** `setGender(aValue : Number) : void`

Sets the customer's gender.

### setJobTitle

**Signature:** `setJobTitle(aValue : String) : void`

Sets the customer's job title.

### setLastName

**Signature:** `setLastName(aValue : String) : void`

Sets the customer's last name.

### setPhoneBusiness

**Signature:** `setPhoneBusiness(number : String) : void`

Sets the business phone number to use for the customer.

### setPhoneHome

**Signature:** `setPhoneHome(number : String) : void`

Sets the phone number to use for the customer.

### setPhoneMobile

**Signature:** `setPhoneMobile(number : String) : void`

Sets the mobile phone number to use for the customer.

### setPreferredLocale

**Signature:** `setPreferredLocale(aValue : String) : void`

Sets the customer's preferred locale.

### setSaluation

**Signature:** `setSaluation(salutation : String) : void`

Sets the salutation to use for the customer.

### setSalutation

**Signature:** `setSalutation(salutation : String) : void`

Sets the salutation to use for the customer.

### setSecondName

**Signature:** `setSecondName(aValue : String) : void`

Sets the customer's second name.

### setSuffix

**Signature:** `setSuffix(aValue : String) : void`

Sets the the customer's suffix.

### setTaxID

**Signature:** `setTaxID(taxID : String) : void`

Sets the tax ID value.

### setTaxIDType

**Signature:** `setTaxIDType(taxIdType : String) : void`

Sets the tax ID type.

### setTitle

**Signature:** `setTitle(aValue : String) : void`

Sets the customer's title.

## Method Detail

## Method Details

### getAddressBook

**Signature:** `getAddressBook() : AddressBook`

**Description:** Returns the customer's address book.

**Returns:**

the customer's address book.

---

### getBirthday

**Signature:** `getBirthday() : Date`

**Description:** Returns the customer's birthday as a date.

**Returns:**

the customer's birthday as a date.

---

### getCompanyName

**Signature:** `getCompanyName() : String`

**Description:** Returns the customer's company name.

**Returns:**

the customer's company name.

---

### getCredentials

**Signature:** `getCredentials() : Credentials`

**Description:** Returns the customer's credentials.

**Returns:**

the customer's credentials.

---

### getCustomer

**Signature:** `getCustomer() : Customer`

**Description:** Returns the customer object related to this profile.

**Returns:**

customer object related to profile.

---

### getCustomerNo

**Signature:** `getCustomerNo() : String`

**Description:** Returns the customer's number, which is a number used to identify the Customer.

**Returns:**

the customer's number.

---

### getEmail

**Signature:** `getEmail() : String`

**Description:** Returns the customer's email address.

**Returns:**

the customer's email address.

---

### getFax

**Signature:** `getFax() : String`

**Description:** Returns the fax number to use for the customer. The length is restricted to 32 characters.

**Returns:**

the fax mobile phone number to use for the customer.

---

### getFirstName

**Signature:** `getFirstName() : String`

**Description:** Returns the customer's first name.

**Returns:**

the customer's first name.

---

### getGender

**Signature:** `getGender() : EnumValue`

**Description:** Returns the customer's gender.

**Returns:**

the customer's gender.

---

### getJobTitle

**Signature:** `getJobTitle() : String`

**Description:** Returns the customer's job title.

**Returns:**

the customer's job title.

---

### getLastLoginTime

**Signature:** `getLastLoginTime() : Date`

**Description:** Returns the last login time of the customer.

**Returns:**

the time, when the customer was last logged in.

---

### getLastName

**Signature:** `getLastName() : String`

**Description:** Returns the customer's last name.

**Returns:**

the customer's last name.

---

### getLastVisitTime

**Signature:** `getLastVisitTime() : Date`

**Description:** Returns the last visit time of the customer.

**Returns:**

the time, when the customer has visited the storefront the last time (with enabled remember me functionality).

---

### getNextBirthday

**Signature:** `getNextBirthday() : Date`

**Description:** Returns the upcoming customer's birthday as a date. If the customer already had birthday this year the method returns the birthday of the next year. Otherwise its birthday in this year. If the customer has not set a birthday this method returns null.

**Returns:**

the customer's next birthday as a date.

---

### getPhoneBusiness

**Signature:** `getPhoneBusiness() : String`

**Description:** Returns the business phone number to use for the customer.

**Returns:**

the business phone number to use for the customer.

---

### getPhoneHome

**Signature:** `getPhoneHome() : String`

**Description:** Returns the phone number to use for the customer.

**Returns:**

the phone number to use for the customer.

---

### getPhoneMobile

**Signature:** `getPhoneMobile() : String`

**Description:** Returns the mobile phone number to use for the customer.

**Returns:**

the mobile phone number to use for the customer.

---

### getPreferredLocale

**Signature:** `getPreferredLocale() : String`

**Description:** Returns the customer's preferred locale.

**Returns:**

the customer's preferred locale.

---

### getPreviousLoginTime

**Signature:** `getPreviousLoginTime() : Date`

**Description:** Returns the time the customer logged in prior to the current login.

**Returns:**

the time the customer logged in prior to the current login.

---

### getPreviousVisitTime

**Signature:** `getPreviousVisitTime() : Date`

**Description:** Returns the time the customer visited the store prior to the current visit.

**Returns:**

the time the customer visited the store prior to the current visit.

---

### getSalutation

**Signature:** `getSalutation() : String`

**Description:** Returns the salutation to use for the customer.

**Returns:**

the salutation to use for the customer.

---

### getSecondName

**Signature:** `getSecondName() : String`

**Description:** Returns the customer's second name.

**Returns:**

the customer's second name.

---

### getSuffix

**Signature:** `getSuffix() : String`

**Description:** Returns the customer's suffix, such as "Jr." or "Sr.".

**Returns:**

the customer's suffix.

---

### getTaxID

**Signature:** `getTaxID() : String`

**Description:** Returns the tax ID value. The value is returned either plain text if the current context allows plain text access, or if it's not allowed, the ID value will be returned masked. The following criteria must be met in order to have plain text access: the method call must happen in the context of a storefront request; the current customer must be registered and authenticated; it is the profile of the current customer; and the current protocol is HTTPS.

**Returns:**

the tax ID value

---

### getTaxIDMasked

**Signature:** `getTaxIDMasked() : String`

**Description:** Returns the masked value of the tax ID.

**Returns:**

the masked value of the tax ID

---

### getTaxIDType

**Signature:** `getTaxIDType() : EnumValue`

**Description:** Returns the tax ID type.

**Returns:**

the tax ID type

---

### getTitle

**Signature:** `getTitle() : String`

**Description:** Returns the customer's title, such as "Mrs" or "Mr".

**Returns:**

the customer's title.

---

### getWallet

**Signature:** `getWallet() : Wallet`

**Description:** Returns the wallet of this customer.

**Returns:**

the wallet of this customer.

---

### isFemale

**Signature:** `isFemale() : boolean`

**Description:** Indicates that the customer is female when set to true.

**Returns:**

true if the customer is a female, false otherwise.

---

### isMale

**Signature:** `isMale() : boolean`

**Description:** Indicates that the customer is male when set to true.

**Returns:**

true if the customer is a male, false otherwise.

---

### setBirthday

**Signature:** `setBirthday(aValue : Date) : void`

**Description:** Sets the customer's birthday as a date.

**Parameters:**

- `aValue`: the customer's birthday as a date.

---

### setCompanyName

**Signature:** `setCompanyName(aValue : String) : void`

**Description:** Sets the customer's company name.

**Parameters:**

- `aValue`: the customer's company name.

---

### setEmail

**Signature:** `setEmail(aValue : String) : void`

**Description:** Sets the customer's email address.

**Parameters:**

- `aValue`: the customer's email address.

---

### setFax

**Signature:** `setFax(number : String) : void`

**Description:** Sets the fax number to use for the customer. The length is restricted to 32 characters.

**Parameters:**

- `number`: the fax number to use for the customer.

---

### setFirstName

**Signature:** `setFirstName(aValue : String) : void`

**Description:** Sets the customer's first name.

**Parameters:**

- `aValue`: the customer's first name.

---

### setGender

**Signature:** `setGender(aValue : Number) : void`

**Description:** Sets the customer's gender.

**Parameters:**

- `aValue`: the customer's gender.

---

### setJobTitle

**Signature:** `setJobTitle(aValue : String) : void`

**Description:** Sets the customer's job title.

**Parameters:**

- `aValue`: the customer's job title.

---

### setLastName

**Signature:** `setLastName(aValue : String) : void`

**Description:** Sets the customer's last name.

**Parameters:**

- `aValue`: the customer's last name.

---

### setPhoneBusiness

**Signature:** `setPhoneBusiness(number : String) : void`

**Description:** Sets the business phone number to use for the customer. The length is restricted to 32 characters.

**Parameters:**

- `number`: the business phone number to use for the customer.

---

### setPhoneHome

**Signature:** `setPhoneHome(number : String) : void`

**Description:** Sets the phone number to use for the customer. The length is restricted to 32 characters.

**Parameters:**

- `number`: the phone number to use for the customer.

---

### setPhoneMobile

**Signature:** `setPhoneMobile(number : String) : void`

**Description:** Sets the mobile phone number to use for the customer. The length is restricted to 32 characters.

**Parameters:**

- `number`: the mobile phone number to use for the customer.

---

### setPreferredLocale

**Signature:** `setPreferredLocale(aValue : String) : void`

**Description:** Sets the customer's preferred locale.

**Parameters:**

- `aValue`: the customer's preferred locale.

---

### setSaluation

**Signature:** `setSaluation(salutation : String) : void`

**Description:** Sets the salutation to use for the customer.

**Deprecated:**

Use setSalutation(String)

**Parameters:**

- `salutation`: the salutation to use for the customer.

---

### setSalutation

**Signature:** `setSalutation(salutation : String) : void`

**Description:** Sets the salutation to use for the customer.

**Parameters:**

- `salutation`: the salutation to use for the customer.

---

### setSecondName

**Signature:** `setSecondName(aValue : String) : void`

**Description:** Sets the customer's second name.

**Parameters:**

- `aValue`: the customer's second name.

---

### setSuffix

**Signature:** `setSuffix(aValue : String) : void`

**Description:** Sets the the customer's suffix.

**Parameters:**

- `aValue`: the customer's suffix.

---

### setTaxID

**Signature:** `setTaxID(taxID : String) : void`

**Description:** Sets the tax ID value. The value can be set if the current context allows write access. The current context allows write access if the currently logged in user owns this profile and the connection is secured.

**Parameters:**

- `taxID`: the tax ID value to set

---

### setTaxIDType

**Signature:** `setTaxIDType(taxIdType : String) : void`

**Description:** Sets the tax ID type.

**Parameters:**

- `taxIdType`: the tax ID type to set

---

### setTitle

**Signature:** `setTitle(aValue : String) : void`

**Description:** Sets the customer's title.

**Parameters:**

- `aValue`: the customer's title.

---