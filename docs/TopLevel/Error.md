## Package: TopLevel

# Class Error

## Inheritance Hierarchy

- Object
  - Error

## Description

Error represents a generic exception.

## Properties

### message

**Type:** String

An error message that provides details about the exception.

### name

**Type:** String

The name of the error based on the constructor used.

### stack

**Type:** String

The script stack trace. 
 This property is filled on throwing or via an explicit call captureStackTrace(Error, Function).

## Constructor Summary

Error() Constructs the Error object.

Error(msg : String) Constructs the Error object using the specified message.

## Method Summary

### captureStackTrace

**Signature:** `static captureStackTrace(error : Error, constructorOpt : Function) : void`

Fills the stack property for the passed error.

### toString

**Signature:** `toString() : String`

Returns a String representation of the Error.

## Constructor Detail

## Method Detail

## Method Details

### captureStackTrace

**Signature:** `static captureStackTrace(error : Error, constructorOpt : Function) : void`

**Description:** Fills the stack property for the passed error. The optional constructorOpt parameter allows you to pass in a function value. When collecting the stack trace all frames above the topmost call to this function, including that call, are left out of the stack trace. This can be useful to hide implementation details that won’t be useful to the user. The usual way of defining a custom error that captures a stack trace would be: function MyError() { // fill the stack trace, but hide the call to MyError Error.captureStackTrace(this, MyError); }

**API Versioned:**

From version 21.2.

**Parameters:**

- `error`: The error whose stack trace should be filled.
- `constructorOpt`: An optional filter to hide the topmost stack frames.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a String representation of the Error.

**Returns:**

a String representation of the Error.

---