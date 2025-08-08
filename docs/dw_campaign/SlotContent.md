## Package: dw.campaign

# Class SlotContent

## Inheritance Hierarchy

- Object
  - dw.campaign.SlotContent

## Description

Represents content for a slot.

## Properties

### calloutMsg

**Type:** MarkupText (Read Only)

The callout message for the slot.

### content

**Type:** Collection (Read Only)

A collection of content based on the content type
 for the slot. The collection will include one of the following
 types: Product, Content, Category, or MarkupText.

### custom

**Type:** Map (Read Only)

The custom attributes for the slot.

### recommenderName

**Type:** String (Read Only)

The recommender name for slot configurations of type 'Recommendation'

### slotID

**Type:** String (Read Only)

The unique slot ID.

## Constructor Summary

## Method Summary

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

Returns the callout message for the slot.

### getContent

**Signature:** `getContent() : Collection`

Returns a collection of content based on the content type for the slot.

### getCustom

**Signature:** `getCustom() : Map`

Returns the custom attributes for the slot.

### getRecommenderName

**Signature:** `getRecommenderName() : String`

Returns the recommender name for slot configurations of type 'Recommendation'

### getSlotID

**Signature:** `getSlotID() : String`

Returns the unique slot ID.

## Method Detail

## Method Details

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

**Description:** Returns the callout message for the slot.

**Returns:**

Callout message of the slot.

---

### getContent

**Signature:** `getContent() : Collection`

**Description:** Returns a collection of content based on the content type for the slot. The collection will include one of the following types: Product, Content, Category, or MarkupText.

**Returns:**

All content of the slot.

---

### getCustom

**Signature:** `getCustom() : Map`

**Description:** Returns the custom attributes for the slot.

**Returns:**

Custom attributes of the slot.

---

### getRecommenderName

**Signature:** `getRecommenderName() : String`

**Description:** Returns the recommender name for slot configurations of type 'Recommendation'

**Returns:**

the recommender name for slot configurations of type 'Recommendation'

---

### getSlotID

**Signature:** `getSlotID() : String`

**Description:** Returns the unique slot ID.

**Returns:**

ID of the slot.

---