## Package: TopLevel

# Class XMLStreamError

## Inheritance Hierarchy

- Object
  - TopLevel.Error
  - XMLStreamError

## Description

This error indicates an XML streaming related error in the system. The IOError is always related to a systems internal Java exception. The class provides access to some more details about this internal Java exception. In particular the class informs about the location of the error.

## Properties

### causeFullName

**Type:** String

If the exception is associated with a root cause, the property
 contains the full name of the associated Java exception.

### causeMessage

**Type:** String

If the exception is associated with a root cause, the property
 contains the message of the associated Java exception.

### causeName

**Type:** String

If the exception is associated with a root cause, the property
 contains the simplified name of the associated Java exception.

### javaFullName

**Type:** String

The full name of the underlying Java exception.

### javaMessage

**Type:** String

The message of the underlying Java exception.

### javaName

**Type:** String

The simplified name of the underlying Java exception.

### xmlColumnNumber

**Type:** Number

The column number where the error occured.

### xmlLineNumber

**Type:** Number

The line where the error occured.

## Constructor Summary

XMLStreamError()

## Method Summary

## Constructor Detail