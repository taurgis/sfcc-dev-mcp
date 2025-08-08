## Package: dw.campaign

# Class Campaign

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.campaign.Campaign

## Description

A Campaign is a set of experiences (or site configurations) which may be deployed as a single unit for a given time frame. The system currently supports 3 types of experience that may be assigned to a campaign: Promotions Slot Configurations Sorting Rules This list may be extended in the future. A campaign can have a start and end date or be open-ended. It may also have "qualifiers" which determine which customers the campaign applies to. The currently supported qualifiers are: Customer groups (where "Everyone" is a possible customer group) Source codes Coupons A campaign can have list of stores or store groups where it can be applicable to.

## Properties

### active

**Type:** boolean (Read Only)

Returns 'true' if the campaign is currently active, otherwise
 'false'. 
 A campaign is active if it is enabled and scheduled for now.

### applicableInStore

**Type:** boolean (Read Only)

Returns true if campaign is applicable to store, otherwise false.

### applicableOnline

**Type:** boolean (Read Only)

Returns true if campaign is applicable to online site, otherwise false.

### coupons

**Type:** Collection (Read Only)

The coupons assigned to the campaign.

### customerGroups

**Type:** Collection (Read Only)

The customer groups assigned to the campaign.

### description

**Type:** String (Read Only)

The internal description of the campaign.

### enabled

**Type:** boolean (Read Only)

Returns true if campaign is enabled, otherwise false.

### endDate

**Type:** Date (Read Only)

The end date of the campaign. If no end date is defined for the
 campaign, null is returned. A campaign w/o end date will run forever.

### ID

**Type:** String (Read Only)

The unique campaign ID.

### promotions

**Type:** Collection (Read Only)

Returns promotions defined in this campaign in no particular order.

### sourceCodeGroups

**Type:** Collection (Read Only)

The source codes assigned to the campaign.

### startDate

**Type:** Date (Read Only)

The start date of the campaign. If no start date is defined for the
 campaign, null is returned. A campaign w/o start date is immediately
 effective.

### storeGroups

**Type:** Collection (Read Only)

Returns store groups assigned to the campaign.

### stores

**Type:** Collection (Read Only)

Returns stores assigned to the campaign.

## Constructor Summary

## Method Summary

### getCoupons

**Signature:** `getCoupons() : Collection`

Returns the coupons assigned to the campaign.

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

Returns the customer groups assigned to the campaign.

### getDescription

**Signature:** `getDescription() : String`

Returns the internal description of the campaign.

### getEndDate

**Signature:** `getEndDate() : Date`

Returns the end date of the campaign.

### getID

**Signature:** `getID() : String`

Returns the unique campaign ID.

### getPromotions

**Signature:** `getPromotions() : Collection`

Returns promotions defined in this campaign in no particular order.

### getSourceCodeGroups

**Signature:** `getSourceCodeGroups() : Collection`

Returns the source codes assigned to the campaign.

### getStartDate

**Signature:** `getStartDate() : Date`

Returns the start date of the campaign.

### getStoreGroups

**Signature:** `getStoreGroups() : Collection`

Returns store groups assigned to the campaign.

### getStores

**Signature:** `getStores() : Collection`

Returns stores assigned to the campaign.

### isActive

**Signature:** `isActive() : boolean`

Returns 'true' if the campaign is currently active, otherwise 'false'.

### isApplicableInStore

**Signature:** `isApplicableInStore() : boolean`

Returns true if campaign is applicable to store, otherwise false.

### isApplicableOnline

**Signature:** `isApplicableOnline() : boolean`

Returns true if campaign is applicable to online site, otherwise false.

### isEnabled

**Signature:** `isEnabled() : boolean`

Returns true if campaign is enabled, otherwise false.

## Method Detail

## Method Details

### getCoupons

**Signature:** `getCoupons() : Collection`

**Description:** Returns the coupons assigned to the campaign.

**Returns:**

All coupons assigned to the campaign.

---

### getCustomerGroups

**Signature:** `getCustomerGroups() : Collection`

**Description:** Returns the customer groups assigned to the campaign.

**Returns:**

Customer groups assigned to campaign.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the internal description of the campaign.

**Returns:**

Internal description of campaign.

---

### getEndDate

**Signature:** `getEndDate() : Date`

**Description:** Returns the end date of the campaign. If no end date is defined for the campaign, null is returned. A campaign w/o end date will run forever.

**Returns:**

End date of campaign.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique campaign ID.

**Returns:**

ID of the campaign.

---

### getPromotions

**Signature:** `getPromotions() : Collection`

**Description:** Returns promotions defined in this campaign in no particular order.

**Returns:**

All promotions defined in campaign.

---

### getSourceCodeGroups

**Signature:** `getSourceCodeGroups() : Collection`

**Description:** Returns the source codes assigned to the campaign.

**Returns:**

All source code groups assigned to campaign.

---

### getStartDate

**Signature:** `getStartDate() : Date`

**Description:** Returns the start date of the campaign. If no start date is defined for the campaign, null is returned. A campaign w/o start date is immediately effective.

**Returns:**

Start date of campaign.

---

### getStoreGroups

**Signature:** `getStoreGroups() : Collection`

**Description:** Returns store groups assigned to the campaign.

**Returns:**

All store groups assigned to the campaign.

---

### getStores

**Signature:** `getStores() : Collection`

**Description:** Returns stores assigned to the campaign.

**Returns:**

All stores assigned to the campaign.

---

### isActive

**Signature:** `isActive() : boolean`

**Description:** Returns 'true' if the campaign is currently active, otherwise 'false'. A campaign is active if it is enabled and scheduled for now.

**Returns:**

true of campaign is active, otherwise false.

---

### isApplicableInStore

**Signature:** `isApplicableInStore() : boolean`

**Description:** Returns true if campaign is applicable to store, otherwise false.

**Returns:**

true if campaign is applicable to store, otherwise false.

---

### isApplicableOnline

**Signature:** `isApplicableOnline() : boolean`

**Description:** Returns true if campaign is applicable to online site, otherwise false.

**Returns:**

true if campaign is applicable to online site, otherwise false.

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Returns true if campaign is enabled, otherwise false.

**Returns:**

true if campaign is enabled, otherwise false.

---