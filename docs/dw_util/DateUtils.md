## Package: dw.util

# Class DateUtils

## Inheritance Hierarchy

- Object
  - dw.util.DateUtils

## Description

A class with several utility methods for Date objects.

## Constructor Summary

## Method Summary

### nowForInstance

**Signature:** `static nowForInstance() : Date`

Returns the current time stamp in the time zone of the instance.

### nowForSite

**Signature:** `static nowForSite() : Date`

Returns the current timestamp in the time zone of the current site.

### nowInUTC

**Signature:** `static nowInUTC() : Date`

Returns the current time stamp in UTC.

## Method Detail

## Method Details

### nowForInstance

**Signature:** `static nowForInstance() : Date`

**Description:** Returns the current time stamp in the time zone of the instance.

**Deprecated:**

Use System.getCalendar() instead.

**Returns:**

the current time stamp in the time zone of the instance.

---

### nowForSite

**Signature:** `static nowForSite() : Date`

**Description:** Returns the current timestamp in the time zone of the current site.

**Deprecated:**

Use Site.getCalendar() instead.

**Returns:**

the current timestamp in the time zone of the current site.

---

### nowInUTC

**Signature:** `static nowInUTC() : Date`

**Description:** Returns the current time stamp in UTC.

**Deprecated:**

Create a new Calendar object and set the time zone "UTC" instead.

**Returns:**

the current time stamp in UTC.

---