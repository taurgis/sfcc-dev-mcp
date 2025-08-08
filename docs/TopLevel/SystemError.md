## Package: TopLevel

# Class SystemError

## Inheritance Hierarchy

- Object
  - TopLevel.Error
  - SystemError

## Description

This error indicates an error in the system, which doesn't fall into any of the other error categories like for example IOError. The SystemError is always related to a systems internal Java exception. The class provides access to some more details about this internal Java exception.

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

## Constructor Summary

SystemError()

## Method Summary

## Constructor Detail