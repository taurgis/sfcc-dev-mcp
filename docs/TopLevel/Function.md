## Package: TopLevel

# Class Function

## Inheritance Hierarchy

- Object
  - Function

## Description

The Function class represent a JavaScript function.

## Properties

### length

**Type:** Number

The number of named arguments that were specified
 when the function was declared.

### prototype

**Type:** Object

An object that defines properties and methods
 shared by all objects created with that
 constructor function.

## Constructor Summary

Function(args : String...) Constructs the function with the specified arguments where the last argument represents the function body and all preceeding arguments represent the function parameters.

## Method Summary

### apply

**Signature:** `apply(thisobj : Object, args : Array) : Object`

Invokes this function as a method of the specified object passing the specified Array of arguments.

### call

**Signature:** `call(thisobj : Object, args : Object...) : Object`

Invokes this function as a method of the specified object passing the specified optional arguments.

### toString

**Signature:** `toString() : String`

Returns a String representation of this function object.

## Constructor Detail

## Method Detail

## Method Details

### apply

**Signature:** `apply(thisobj : Object, args : Array) : Object`

**Description:** Invokes this function as a method of the specified object passing the specified Array of arguments.

**Parameters:**

- `thisobj`: the object to which the function is applied.
- `args`: Array of values or an arguments object to be passed as arguments to the function.

**Returns:**

whatever value is returned by the invocation of the function.

---

### call

**Signature:** `call(thisobj : Object, args : Object...) : Object`

**Description:** Invokes this function as a method of the specified object passing the specified optional arguments.

**Parameters:**

- `thisobj`: the object to which the function is applied.
- `args`: an optional list of one or more arguments values that are passed as arguments to the function.

**Returns:**

whatever value is returned by the invocation of the function.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a String representation of this function object.

**Returns:**

a String representation of this function object.

---