## Package: dw.system

# Class Logger

## Inheritance Hierarchy

- Object
  - dw.system.Logger

## Description

The Logger class provides logging utility methods.

## Properties

### debugEnabled

**Type:** boolean (Read Only)

This method returns true if debug logging is enabled.

### errorEnabled

**Type:** boolean (Read Only)

This method returns true if error logging is enabled.

### infoEnabled

**Type:** boolean (Read Only)

This method returns true if info logging is enabled.

### rootLogger

**Type:** Log (Read Only)

The root logger object.

### warnEnabled

**Type:** boolean (Read Only)

This method returns true if warning logging is enabled.

## Constructor Summary

## Method Summary

### debug

**Signature:** `static debug(msg : String, args : Object...) : void`

The method reports an debug level message.

### error

**Signature:** `static error(msg : String, args : Object...) : void`

The method reports an error level message.

### getLogger

**Signature:** `static getLogger(category : String) : Log`

Returns the logger object for the given category.

### getLogger

**Signature:** `static getLogger(fileNamePrefix : String, category : String) : Log`

Returns the logger object for the given file name prefix and category.

### getRootLogger

**Signature:** `static getRootLogger() : Log`

Returns the root logger object.

### info

**Signature:** `static info(msg : String, args : Object...) : void`

The method reports an information level message.

### isDebugEnabled

**Signature:** `static isDebugEnabled() : boolean`

This method returns true if debug logging is enabled.

### isErrorEnabled

**Signature:** `static isErrorEnabled() : boolean`

This method returns true if error logging is enabled.

### isInfoEnabled

**Signature:** `static isInfoEnabled() : boolean`

This method returns true if info logging is enabled.

### isWarnEnabled

**Signature:** `static isWarnEnabled() : boolean`

This method returns true if warning logging is enabled.

### warn

**Signature:** `static warn(msg : String, args : Object...) : void`

The method reports an warning level message.

## Method Detail

## Method Details

### debug

**Signature:** `static debug(msg : String, args : Object...) : void`

**Description:** The method reports an debug level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### error

**Signature:** `static error(msg : String, args : Object...) : void`

**Description:** The method reports an error level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### getLogger

**Signature:** `static getLogger(category : String) : Log`

**Description:** Returns the logger object for the given category.

**Parameters:**

- `category`: - the category to get the logger for

**Returns:**

the logger object for the given category.

---

### getLogger

**Signature:** `static getLogger(fileNamePrefix : String, category : String) : Log`

**Description:** Returns the logger object for the given file name prefix and category. Throws an exception if maximum number of custom log files per day has already been obtained.

**Parameters:**

- `fileNamePrefix`: - the file name prefix to identify the logger must not be null or an empty string, must be at least 3 characters long, can contain characters a-z A-Z 0-9 '-' '_' only, can have up to 25 characters must not start or end with '-' or '_' can only start or end with a-z A-Z 0-9
- `category`: - the category to get the logger for, must not be null

**Returns:**

the logger object for the given category.

---

### getRootLogger

**Signature:** `static getRootLogger() : Log`

**Description:** Returns the root logger object.

**Returns:**

the root logger object.

---

### info

**Signature:** `static info(msg : String, args : Object...) : void`

**Description:** The method reports an information level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### isDebugEnabled

**Signature:** `static isDebugEnabled() : boolean`

**Description:** This method returns true if debug logging is enabled.

**Returns:**

true if logging of debug messages is enabled, false otherwise.

---

### isErrorEnabled

**Signature:** `static isErrorEnabled() : boolean`

**Description:** This method returns true if error logging is enabled.

**Returns:**

true if logging of error messages is enabled, false otherwise.

---

### isInfoEnabled

**Signature:** `static isInfoEnabled() : boolean`

**Description:** This method returns true if info logging is enabled.

**Returns:**

true if logging of info messages is enabled, false otherwise.

---

### isWarnEnabled

**Signature:** `static isWarnEnabled() : boolean`

**Description:** This method returns true if warning logging is enabled.

**Returns:**

true if logging of warn messages is enabled, false otherwise.

---

### warn

**Signature:** `static warn(msg : String, args : Object...) : void`

**Description:** The method reports an warning level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---