## Package: TopLevel

# Class APIException

## Inheritance Hierarchy

- Object
  - TopLevel.Error
  - APIException

## Description

This error indicates an exceptional outcome of some business logic. Instances of this exception in general provide additional information about the reason of this case. See the actual type referred by the type property for the description of the properties with this additional information. Limitation: The sub classes of this APIException shown in this documentation actually do not exist. All instances are of type APIException, but with different property sets as listed in the sub classes. The APIException is always related to a systems internal Java exception. The class provides access to some more details about this internal Java exception.

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

### type

**Type:** String

The name of the actual APIException type, without the package name.

## Constructor Summary

APIException()

## Method Summary

## Constructor Detail