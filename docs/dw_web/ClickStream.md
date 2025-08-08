## Package: dw.web

# Class ClickStream

## Inheritance Hierarchy

- Object
  - dw.web.ClickStream

## Description

Represents the click stream in the session. A maximum number of 50 clicks is recorded per session. After the maximum is reached, each time the customer clicks on a new link, the oldest click stream entry is purged. The ClickStream always remembers the first click. The click stream is consulted when the GetLastVisitedProducts pipelet is called to retrieve the products that the customer has recently visited.

## Properties

### clicks

**Type:** List (Read Only)

A collection with all clicks. The first entry is the oldest
 entry. The last entry is the latest entry. The method returns a copy of
 the click stream, which makes it safe to work with the click stream,
 while it might be modified.

### enabled

**Type:** Session.isTrackingAllowed() (Read Only)

Identifies if the clickstream recording is enabled or not.
 It is considered enabled if either:
 the method Session.isTrackingAllowed() returns true
 or if the above method returns false but the preference 'ClickstreamHonorDNT' is set to false.
 
 When clickstream tracking is not enabled the getFirst() method still operates as expected
 but the rest of the clicks are not collected.

### first

**Type:** ClickStreamEntry (Read Only)

The first click within this session. This first click
 is stored independent of whether entries are purged.

### last

**Type:** ClickStreamEntry (Read Only)

The last recorded click stream, which is also typically
 the current click. In where rare cases (e.g. RedirectURL pipeline) this
 is not the current click, but instead the last recorded click.

### partial

**Type:** boolean (Read Only)

Identifies if this is only a partial click stream. If the maximum number
 of clicks (50) is recorded, the oldest entry is automatically purged with
 each additional click. In this case, this flag indicates that the click
 stream is only partial.

## Constructor Summary

## Method Summary

### getClicks

**Signature:** `getClicks() : List`

Returns a collection with all clicks.

### getFirst

**Signature:** `getFirst() : ClickStreamEntry`

Returns the first click within this session.

### getLast

**Signature:** `getLast() : ClickStreamEntry`

Returns the last recorded click stream, which is also typically the current click.

### isEnabled

**Signature:** `isEnabled() : boolean`

Identifies if the clickstream recording is enabled or not.

### isPartial

**Signature:** `isPartial() : boolean`

Identifies if this is only a partial click stream.

## Method Detail

## Method Details

### getClicks

**Signature:** `getClicks() : List`

**Description:** Returns a collection with all clicks. The first entry is the oldest entry. The last entry is the latest entry. The method returns a copy of the click stream, which makes it safe to work with the click stream, while it might be modified.

**Returns:**

a collection of ClickStreamEntry instances, sorted chronologically.

---

### getFirst

**Signature:** `getFirst() : ClickStreamEntry`

**Description:** Returns the first click within this session. This first click is stored independent of whether entries are purged.

**Returns:**

the first click within this session.

---

### getLast

**Signature:** `getLast() : ClickStreamEntry`

**Description:** Returns the last recorded click stream, which is also typically the current click. In where rare cases (e.g. RedirectURL pipeline) this is not the current click, but instead the last recorded click.

**Returns:**

the last recorded click stream, which is also typically the current click.

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Identifies if the clickstream recording is enabled or not. It is considered enabled if either: the method Session.isTrackingAllowed() returns true or if the above method returns false but the preference 'ClickstreamHonorDNT' is set to false. When clickstream tracking is not enabled the getFirst() method still operates as expected but the rest of the clicks are not collected.

**Returns:**

whether clickstream tracking is enabled

---

### isPartial

**Signature:** `isPartial() : boolean`

**Description:** Identifies if this is only a partial click stream. If the maximum number of clicks (50) is recorded, the oldest entry is automatically purged with each additional click. In this case, this flag indicates that the click stream is only partial.

**Returns:**

true if this click stream is partial, false otherwise.

---