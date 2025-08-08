## Package: dw.system

# Class Log

## Inheritance Hierarchy

- Object
  - dw.system.Log

## Description

A log4j like logger instance. To obtain such an instance, use the Logger.getRootLogger() or Logger.getLogger(String) or Logger.getLogger(String, String) methods.

## Properties

### debugEnabled

**Type:** boolean (Read Only)

This method returns true if debug logging is enabled for this logging instance.

### errorEnabled

**Type:** boolean (Read Only)

This method returns true if error logging is enabled for this logging instance.

### infoEnabled

**Type:** boolean (Read Only)

This method returns true if information logging is enabled for this logging instance.

### NDC

**Type:** LogNDC (Read Only)

The Nested Diagnostic Context for this script call.

### warnEnabled

**Type:** boolean (Read Only)

This method returns true if warning logging is enabled for this logging instance.

## Constructor Summary

## Method Summary

### debug

**Signature:** `debug(msg : String, args : Object...) : void`

The method reports an debug level message.

### error

**Signature:** `error(msg : String, args : Object...) : void`

The method reports an error level message.

### fatal

**Signature:** `fatal(msg : String, args : Object...) : void`

The method reports an warning level message.

### getNDC

**Signature:** `static getNDC() : LogNDC`

Returns the Nested Diagnostic Context for this script call.

### info

**Signature:** `info(msg : String, args : Object...) : void`

The method reports an information level message.

### isDebugEnabled

**Signature:** `isDebugEnabled() : boolean`

This method returns true if debug logging is enabled for this logging instance.

### isErrorEnabled

**Signature:** `isErrorEnabled() : boolean`

This method returns true if error logging is enabled for this logging instance.

### isInfoEnabled

**Signature:** `isInfoEnabled() : boolean`

This method returns true if information logging is enabled for this logging instance.

### isWarnEnabled

**Signature:** `isWarnEnabled() : boolean`

This method returns true if warning logging is enabled for this logging instance.

### warn

**Signature:** `warn(msg : String, args : Object...) : void`

The method reports an warning level message.

## Method Detail

## Method Details

### debug

**Signature:** `debug(msg : String, args : Object...) : void`

**Description:** The method reports an debug level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### error

**Signature:** `error(msg : String, args : Object...) : void`

**Description:** The method reports an error level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### fatal

**Signature:** `fatal(msg : String, args : Object...) : void`

**Description:** The method reports an warning level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax. Note: Fatal log messages are always enabled and optionally send via E-Mail.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### getNDC

**Signature:** `static getNDC() : LogNDC`

**Description:** Returns the Nested Diagnostic Context for this script call.

**Returns:**

the nested diagnostic context

---

### info

**Signature:** `info(msg : String, args : Object...) : void`

**Description:** The method reports an information level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---

### isDebugEnabled

**Signature:** `isDebugEnabled() : boolean`

**Description:** This method returns true if debug logging is enabled for this logging instance.

**Returns:**

true if logging of debug messages is enabled, false otherwise.

---

### isErrorEnabled

**Signature:** `isErrorEnabled() : boolean`

**Description:** This method returns true if error logging is enabled for this logging instance.

**Returns:**

true if logging of error messages is enabled, false otherwise.

---

### isInfoEnabled

**Signature:** `isInfoEnabled() : boolean`

**Description:** This method returns true if information logging is enabled for this logging instance.

**Returns:**

true if logging of information messages is enabled, false otherwise.

---

### isWarnEnabled

**Signature:** `isWarnEnabled() : boolean`

**Description:** This method returns true if warning logging is enabled for this logging instance.

**Returns:**

true if logging of warning messages is enabled, false otherwise.

---

### warn

**Signature:** `warn(msg : String, args : Object...) : void`

**Description:** The method reports an warning level message. Arguments can be embedded into the message, e.g. like "Failure {0} in {1}". The method implements the Java MessageFormat.format() syntax.

**Parameters:**

- `msg`: the message to log.
- `args`: the arguments to insert into the message.

---