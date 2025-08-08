## Package: TopLevel

# Class Fault

## Inheritance Hierarchy

- Object
  - TopLevel.Error
  - Fault

## Description

This error indicates an RPC related error in the system. The Fault is always related to a systems internal Java exception. The class provides access to some more details about this internal Java exception. In particular it provides details about the error send from the remote system.

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

### faultActor

**Type:** String

Provides some information on who cause the fault along the message
 path.

### faultCode

**Type:** String

An identifier for the specific fault.

### faultDetail

**Type:** String

More detailed information about the fault.

### faultString

**Type:** String

A human readable description for the fault.

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

Fault()

## Method Summary

## Constructor Detail