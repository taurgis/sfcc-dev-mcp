## Package: dw.system

# Class System

## Inheritance Hierarchy

- Object
  - dw.system.System

## Description

Represents the Commerce Cloud Digital server instance. An application server instance is configured to be of one of three types, "development system", "staging system" or "production system".

## Constants

### DEVELOPMENT_SYSTEM

**Type:** Number = 0

Represents the development system.

### PRODUCTION_SYSTEM

**Type:** Number = 2

Represents the production system.

### STAGING_SYSTEM

**Type:** Number = 1

Represents the staging system.

## Properties

### calendar

**Type:** Calendar (Read Only)

A new Calendar object in the time zone of the
 current instance.

### compatibilityMode

**Type:** Number (Read Only)

The compatibility mode of the custom code version that is currently active. The compatibility mode is
 returned as a number, e.g. compatibility mode "15.5" is returned as 1505.

### instanceHostname

**Type:** String (Read Only)

Returns instance hostname.

### instanceTimeZone

**Type:** String (Read Only)

The instance time zone. The instance time zone is the time zone in which global actions like jobs or
 reporting are specified in the system. Keep in mind that the instance time zone is cached at the current session.
 Changes will affect only new sessions.

### instanceType

**Type:** Number (Read Only)

The type of the instance. An application server instance is configured to be of one of three types,
 "development system", "staging system" or "production system".
 This method returns a constant representing the instance type of this
 application server.

### preferences

**Type:** OrganizationPreferences (Read Only)

This method returns a container of all global preferences of this
 organization (instance).

## Constructor Summary

## Method Summary

### getCalendar

**Signature:** `static getCalendar() : Calendar`

Returns a new Calendar object in the time zone of the current instance.

### getCompatibilityMode

**Signature:** `static getCompatibilityMode() : Number`

Returns the compatibility mode of the custom code version that is currently active.

### getInstanceHostname

**Signature:** `static getInstanceHostname() : String`

Returns instance hostname.

### getInstanceTimeZone

**Signature:** `static getInstanceTimeZone() : String`

Returns the instance time zone.

### getInstanceType

**Signature:** `static getInstanceType() : Number`

Returns the type of the instance.

### getPreferences

**Signature:** `static getPreferences() : OrganizationPreferences`

This method returns a container of all global preferences of this organization (instance).

## Method Detail

## Method Details

### getCalendar

**Signature:** `static getCalendar() : Calendar`

**Description:** Returns a new Calendar object in the time zone of the current instance.

**Returns:**

a Calendar object in the time zone of the instance.

---

### getCompatibilityMode

**Signature:** `static getCompatibilityMode() : Number`

**Description:** Returns the compatibility mode of the custom code version that is currently active. The compatibility mode is returned as a number, e.g. compatibility mode "15.5" is returned as 1505.

**Returns:**

The currently active compatibility mode.

---

### getInstanceHostname

**Signature:** `static getInstanceHostname() : String`

**Description:** Returns instance hostname.

**Returns:**

instance hostname.

---

### getInstanceTimeZone

**Signature:** `static getInstanceTimeZone() : String`

**Description:** Returns the instance time zone. The instance time zone is the time zone in which global actions like jobs or reporting are specified in the system. Keep in mind that the instance time zone is cached at the current session. Changes will affect only new sessions.

**Returns:**

the instance time zone.

---

### getInstanceType

**Signature:** `static getInstanceType() : Number`

**Description:** Returns the type of the instance. An application server instance is configured to be of one of three types, "development system", "staging system" or "production system". This method returns a constant representing the instance type of this application server.

**Returns:**

the instance type of the application server where this method was called.

**See Also:**

DEVELOPMENT_SYSTEM
PRODUCTION_SYSTEM
STAGING_SYSTEM

---

### getPreferences

**Signature:** `static getPreferences() : OrganizationPreferences`

**Description:** This method returns a container of all global preferences of this organization (instance).

**Returns:**

a preferences object containing all global system and custom preferences of this instance

---